import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatWindowProps {
  chatId: string;
}

// Mock data - replace with real data later
const mockMessages = [
  {
    id: '1',
    sender: 'other',
    content: 'Hey! How are you doing?',
    timestamp: '10:30 AM',
    status: 'read',
  },
  {
    id: '2',
    sender: 'me',
    content: "I'm doing great! Just working on the chat app.",
    timestamp: '10:32 AM',
    status: 'read',
  },
  {
    id: '3',
    sender: 'other',
    content: 'That sounds awesome! How is it going?',
    timestamp: '10:33 AM',
    status: 'read',
  },
  {
    id: '4',
    sender: 'me',
    content: 'Pretty well! Building the UI right now. Check out this design!',
    timestamp: '10:35 AM',
    status: 'delivered',
  },
  {
    id: '5',
    sender: 'other',
    content: 'Wow, looks amazing! 🎉',
    timestamp: '10:36 AM',
    status: 'sent',
  },
];

const mockContact = {
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  isOnline: true,
  lastSeen: 'online',
};

const ChatWindow: React.FC<ChatWindowProps> = () => {
  const [message, setMessage] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // TODO: Send message via socket
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className='flex flex-col h-screen w-full'>
      {/* Chat Header */}
      <div className='flex items-center justify-between p-4 bg-card border-b'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <img
              src={mockContact.avatar}
              alt={mockContact.name}
              className='w-10 h-10 rounded-full'
            />
            {mockContact.isOnline && (
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full'></div>
            )}
          </div>
          <div>
            <h2 className='font-semibold text-gray-900 dark:text-white'>
              {mockContact.name}
            </h2>
            <p className='text-xs'>{mockContact.lastSeen}</p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button className='p-2 rounded-full transition-colors'>
            <Phone className='w-5 h-5' />
          </button>
          <button className='p-2 rounded-full transition-colors'>
            <Video className='w-5 h-5' />
          </button>
          <button className='p-2 rounded-full transition-colors'>
            <MoreVertical className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                msg.sender === 'me'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <p className='text-sm wrap-break-word'>{msg.content}</p>
              <div className='flex items-center justify-end gap-1 mt-1'>
                <span
                  className={`text-xs ${
                    msg.sender === 'me' ? 'text-muted-foreground' : 'text-primary'
                  }`}
                >
                  {msg.timestamp}
                </span>
                {msg.sender === 'me' && (
                  <span className='text-xs'>
                    {msg.status === 'read'
                      ? '✓✓'
                      : msg.status === 'delivered'
                        ? '✓✓'
                        : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className='flex justify-start'>
            <div className='rounded-2xl rounded-bl-none px-4 py-3 shadow-sm'>
              <div className='flex gap-1'>
                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className='p-4 border-t dark:border-gray-700'>
        <form onSubmit={handleSend} className='flex items-center gap-2'>
          <button
            type='button'
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
          >
            <Smile className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </button>

          <button
            type='button'
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
          >
            <Paperclip className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </button>

          <Input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 px-4 py-2'
          />

          <button type='submit' disabled={!message.trim()} className='p-2'>
            <Send className='w-6 h-6' />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
