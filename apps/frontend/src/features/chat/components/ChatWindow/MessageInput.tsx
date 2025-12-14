import React from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSend,
}) => {
  return (
    <div className='p-4 border-t border-border bg-card'>
      <form onSubmit={onSend} className='flex items-center gap-2'>
        <button
          type='button'
          className='p-2 hover:bg-accent rounded-full transition-colors'
        >
          <Smile className='w-6 h-6 text-muted-foreground' />
        </button>

        <button
          type='button'
          className='p-2 hover:bg-accent rounded-full transition-colors'
        >
          <Paperclip className='w-6 h-6 text-muted-foreground' />
        </button>

        <Input
          type='text'
          value={message}
          onChange={onMessageChange}
          placeholder='Type a message...'
          className='flex-1 px-4 py-2'
        />

        <button
          type='submit'
          disabled={!message.trim()}
          className='p-2 hover:bg-accent rounded-full transition-colors disabled:opacity-50'
        >
          <Send className='w-6 h-6 text-primary' />
        </button>
      </form>
    </div>
  );
};
