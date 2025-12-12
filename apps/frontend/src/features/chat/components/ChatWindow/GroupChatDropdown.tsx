import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Info, Heart, BellOff, CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClearChat } from '../../hooks/useChats';
import { useChatContext } from '../../context/ChatContext';
export function ChatDropdown() {
  const { mutate: clearChat } = useClearChat();
  const { activeChatId } = useChatContext();
  const handleClearChat = () => {
    clearChat({ chatId: activeChatId || '' });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-56 max-h-96 overflow-y-auto mr-4'
      >
        <DropdownMenuItem className='flex items-center gap-2'>
          <Info className='w-4 h-4 text-muted-foreground' />
          Group info
        </DropdownMenuItem>

        <DropdownMenuItem className='flex items-center gap-2'>
          <Heart className='w-4 h-4 text-muted-foreground' />
          Add to favorites
        </DropdownMenuItem>

        <DropdownMenuItem className='flex items-center gap-2'>
          <BellOff className='w-4 h-4 text-muted-foreground' />
          Mute notifications
        </DropdownMenuItem>

        <DropdownMenuItem
          className='flex items-center gap-2'
          onClick={handleClearChat}
        >
          <CircleX className='w-4 h-4 text-muted-foreground' />
          Clear Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
