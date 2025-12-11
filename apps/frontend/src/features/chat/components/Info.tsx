import { X } from 'lucide-react';
import { useChat } from '@/features/hooks';
import { useChatContext } from '@/features/chat/context';
import { Button } from '@/components/ui/button';

interface InfoProps {
  className?: string;
}
function Info({ className }: InfoProps) {
  const { activeChatId, closeInfoPanel } = useChatContext();
  const { data: chat } = useChat(activeChatId || '');

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className='flex items-center justify-between p-5 border-b'>
        <h3 className='font-semibold'>Chat Info</h3>
        <Button
          variant='ghost'
          size='icon'
          onClick={closeInfoPanel}
          className='h-8 w-8'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      {/* Content */}
      <div className='flex-1 p-4'>
        <div className='space-y-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground mb-2'>Chat Name</h4>
            <p className='text-sm'>{chat?.name || 'Unknown Chat'}</p>
          </div>

          {chat?.isGroupChat && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground mb-2'>Group Chat</h4>
              <p className='text-sm'>This is a group conversation</p>
            </div>
          )}

          <div>
            <h4 className='text-sm font-medium text-muted-foreground mb-2'>Participants</h4>
            <p className='text-sm'>{chat?.participants?.length || 0} members</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
