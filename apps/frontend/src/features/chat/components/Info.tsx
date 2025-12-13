import { X } from 'lucide-react';
import { useChat } from '@/features/hooks';
import { useChatContext } from '@/features/chat/context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/shared/Avatar';
import type { User } from '@chat-app/shared-types';
import { useAuth } from '@/app/providers/AuthContext';
import { AddParticipantsModal } from './AddParticipantsModal';
import { DeleteParticipantsModal } from './DeleteParticipantsModal';
import { ChatInfoSkeleton } from '@/components/shared/LoadingSkeletons';

interface InfoProps {
  className?: string;
}

export default function ChatInfo({ className }: InfoProps) {
  const { activeChatId, closeInfoPanel } = useChatContext();
  const { data: chat, isLoading } = useChat(activeChatId || '');
  const { user } = useAuth();
  const isCurrentUserAdmin = user?.id == chat?.groupAdmin;

  if (isLoading) return <ChatInfoSkeleton className={className} />;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className='flex items-center justify-between p-5 border-b'>
        <h3 className='font-semibold text-lg'>Chat Info</h3>
        <Button
          variant='ghost'
          size='icon'
          onClick={closeInfoPanel}
          className='h-8 w-8'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      {/* Body */}
      <div className='flex-1 p-6 overflow-y-auto'>
        <div className='flex flex-col items-center text-center space-y-4'>
          {/* Avatar */}
          <Avatar
            name={chat?.name || 'Unknown'}
            className='w-24 h-24 ring-4 ring-accent/30'
            size='lg'
          />

          {/* Chat Name */}
          <h2 className='text-xl font-semibold'>
            {chat?.name || 'Unknown Chat'}
          </h2>

          {/* Group Description */}
          {chat?.isGroupChat && (
            <div className='w-full mt-3'>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Group Conversation
              </h4>
              <p className='text-sm text-muted-foreground mt-1'>
                This is a group chat with multiple participants.
              </p>
            </div>
          )}

          {/* Participants List */}
          {chat?.isGroupChat && (
            <div className='w-full mt-6'>
              <h4 className='text-sm font-medium text-muted-foreground mb-2'>
                Participants ({chat?.participants?.length})
              </h4>

              {/* Proper Shadcn ScrollArea */}
              <ScrollArea className='h-50 w-full rounded-md border'>
                <div className='space-y-2 p-3'>
                  {chat?.participants?.length === 0 && (
                    <p className='text-xs text-muted-foreground text-center py-4'>
                      No participants found.
                    </p>
                  )}

                  {chat?.participants?.map((participant) => {
                    const isObject =
                      typeof participant === 'object' && participant !== null;

                    const p = isObject
                      ? (participant as User)
                      : ({ id: participant, name: 'Unknown User' } as User);

                    const participantId = p.id;
                    const isAdmin = chat?.groupAdmin === participantId;

                    return (
                      <div
                        key={participantId}
                        className='flex items-center gap-3 p-2 rounded-md hover:bg-accent transition'
                      >
                        <Avatar name={p.name} size='sm' />
                        <span className='text-sm'>{p.name}</span>

                        {isAdmin && (
                          <span className='text-xs px-1.5 py-0.5 rounded bg-accent text-muted-foreground'>
                            Admin
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Admin Actions */}
              {isCurrentUserAdmin && (
                <div className='mt-4 space-y-2'>
                  <AddParticipantsModal
                    chatId={activeChatId || ''}
                    existingParticipants={chat?.participants || []}
                  />
                  <DeleteParticipantsModal
                    chatId={activeChatId || ''}
                    participants={chat?.participants || []}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
