import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/shared/Avatar';
import { toast } from 'sonner';
import { useUsers, useCreateGroupChat } from '@/features/hooks';

export function CreateGroupChat() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Fetch all users
  const { data: users = [] } = useUsers();

  // Filtered list based on search
  const filteredOptions = useMemo(() => {
    return users.filter((u) =>
      u.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Create group chat mutation
  const { mutate: createGroupChatMutation, isPending } = useCreateGroupChat({
    onSuccess: () => {
      setOpen(false);
      setGroupName('');
      setSelectedUsers([]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) return toast.error('Group name is required');
    if (selectedUsers.length < 2)
      return toast.error('Select at least 2 users for a group');

    createGroupChatMutation({ name: groupName, users: selectedUsers });
  };

  // Add or remove user from selection
  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Guard against empty filtered list
    if (filteredOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          toggleUser(filteredOptions[highlightedIndex].id);
        }
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Users className='w-6 h-6 bg-muted' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Group Chat</DialogTitle>
            <DialogDescription>
              Choose a name and invite your friends
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Group Name */}
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder='Enter group name'
              />
            </div>

            {/* User Selector */}
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Add Members</label>

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search users'
                onKeyDown={handleKeyDown}
              />

              <div className='max-h-[200px] overflow-y-auto'>
                {filteredOptions.map((user, index) => {
                  const isSelected = selectedUsers.includes(user.id);
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors
                        ${isSelected ? 'bg-primary/10 border border-primary/20' : ''}
                        ${isHighlighted ? 'bg-accent' : ''}
                        hover:bg-accent`}
                    >
                      <Avatar name={user.userName} />
                      <span className={isSelected ? 'font-medium' : ''}>
                        {user.userName}
                      </span>
                      <div
                        className='ml-auto'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          className='ml-auto pointer-events-none'
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>

            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Chat'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
