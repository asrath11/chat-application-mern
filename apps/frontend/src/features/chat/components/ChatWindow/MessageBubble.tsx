import React, { useState } from 'react';
import type { Message } from '@chat-app/shared-types';
import { useUsers } from '@/features/hooks';
import { generateRandomColor } from '@/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Copy, Forward, Trash2 } from 'lucide-react';
import { ForwardMessageModal } from '../ForwardMessageModal';
import { useSocket } from '@/app/providers/SocketContext';
import { toast } from 'sonner';
import type { MessageSendPayload } from '@chat-app/shared-types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  isGroupChat: boolean;
  currentChatId?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  isGroupChat,
  currentChatId,
}) => {
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const { data: users } = useUsers();
  const { socket } = useSocket();

  const user = React.useMemo(
    () => users?.find((u) => u.id === message.sender),
    [users, message.sender]
  );

  const userColor = React.useMemo(
    () => generateRandomColor(user?.userName || ''),
    [user?.userName]
  );

  const formattedTime = React.useMemo(() => {
    if (!message.timestamp) return '';
    return new Date(message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [message.timestamp]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Message copied to clipboard');
  };

  const handleForward = () => {
    setForwardModalOpen(true);
  };

  const handleForwardSubmit = async (chatIds: string[]) => {
    if (!socket) {
      toast.error('Connection error. Please try again.');
      return;
    }

    try {
      // Send the message to each selected chat
      for (const chatId of chatIds) {
        const payload: MessageSendPayload = {
          content: message.content,
          chatId: chatId,
          isForwarded: true,
        };
        socket.emit('message:send', payload);
      }
    } catch (error) {
      toast.error('Failed to forward message');
      console.error('Error forwarding message:', error);
    }
  };

  const handleDelete = () => {
    console.log('Delete message', message.id);
    toast.info('Delete functionality coming soon');
  };

  return (
    <>
      <div className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm cursor-default ${
                isMe
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary text-secondary-foreground rounded-bl-md'
              }`}
            >
              {isGroupChat && !isMe && (
                <div
                  className='text-xs font-semibold mb-1'
                  style={{ color: userColor }}
                >
                  {user?.userName}
                </div>
              )}

              {message.isForwarded && (
                <div
                  className={`text-xs italic mb-1 ${
                    isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  <Forward className='inline h-3 w-3 mr-1' />
                  Forwarded
                </div>
              )}

              <div className='text-sm whitespace-pre-wrap'>{message.content}</div>

              <div className='flex items-center justify-end gap-1.5 mt-1'>
                <span
                  className={`text-[11px] ${
                    isMe
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground/70'
                  }`}
                >
                  {formattedTime}
                </span>

                {isMe && (
                  <span
                    className='text-xs leading-none'
                    aria-label={`Message ${message.status}`}
                  >
                    {message.status === 'read' ? (
                      <span className='text-blue-400'>✓✓</span>
                    ) : message.status === 'delivered' ? (
                      <span className='text-primary-foreground/60'>✓✓</span>
                    ) : (
                      <span className='text-primary-foreground/50'>✓</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </ContextMenuTrigger>

          {/* Context Menu */}
          <ContextMenuContent className='w-44'>
            <ContextMenuItem onClick={handleCopy}>
              <Copy className='mr-2 h-4 w-4' />
              Copy
            </ContextMenuItem>

            <ContextMenuItem onClick={handleForward}>
              <Forward className='mr-2 h-4 w-4' />
              Forward
            </ContextMenuItem>

            <ContextMenuItem
              onClick={handleDelete}
              className='text-red-500 focus:text-red-500'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {isMe ? 'Delete' : 'Delete for me'}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <ForwardMessageModal
        open={forwardModalOpen}
        onOpenChange={setForwardModalOpen}
        messageContent={message.content}
        onForward={handleForwardSubmit}
        currentChatId={currentChatId}
      />
    </>
  );
};
