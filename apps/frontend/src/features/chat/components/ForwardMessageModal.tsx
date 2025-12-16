import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/shared/Avatar';
import { useChats } from '@/features/hooks';

interface ForwardMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContent: string;
  onForward: (chatIds: string[]) => void;
  currentChatId?: string;
}

export function ForwardMessageModal({
  open,
  onOpenChange,
  messageContent,
  onForward,
  currentChatId,
}: ForwardMessageModalProps) {
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);

  const { data: chats = [] } = useChats();

  // Filter chats based on search and exclude current chat
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      if (currentChatId && chat.id === currentChatId) return false;

      return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chats, searchQuery, currentChatId]);

  const toggleChat = (chatId: string) => {
    setSelectedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChats.length === 0) return;

    setIsForwarding(true);
    try {
      await onForward(selectedChats);
      handleClose();
    } finally {
      setIsForwarding(false);
    }
  };

  const handleClose = () => {
    setSelectedChats([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
            <DialogDescription>
              Select chats to forward this message to
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Message Preview */}
            <div className='bg-muted p-3 rounded-md'>
              <p className='text-sm text-muted-foreground mb-1'>Message:</p>
              <p className='text-sm line-clamp-3'>{messageContent}</p>
            </div>

            {/* Search Input */}
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Select Chats</label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search chats'
              />
            </div>

            {/* Chat List */}
            <div className='max-h-[250px] overflow-y-auto'>
              {filteredChats.length === 0 ? (
                <div className='text-center py-4 text-muted-foreground text-sm'>
                  {searchQuery
                    ? 'No chats found matching your search'
                    : 'No chats available'}
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isSelected = selectedChats.includes(chat.id || '');

                  return (
                    <div
                      key={chat.id}
                      onClick={() => toggleChat(chat.id || '')}
                      className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors
                        ${isSelected ? 'bg-primary/10 border border-primary/20' : ''}
                        hover:bg-accent`}
                    >
                      <Avatar name={chat.name} />
                      <div className='flex-1 min-w-0'>
                        <p
                          className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}
                        >
                          {chat.name}
                        </p>
                        {chat.isGroupChat && (
                          <p className='text-xs text-muted-foreground'>
                            {chat.participants?.length || 0} members
                          </p>
                        )}
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          className='pointer-events-none'
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected count */}
            {selectedChats.length > 0 && (
              <div className='text-sm text-muted-foreground'>
                {selectedChats.length} chat(s) selected
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button' onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type='submit'
              disabled={isForwarding || selectedChats.length === 0}
            >
              {isForwarding ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Forwarding...
                </>
              ) : (
                `Forward to ${selectedChats.length || ''} Chat${selectedChats.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
