import { useMemo } from 'react';
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
import { Loader2 } from 'lucide-react';
import type { User } from '@chat-app/shared-types';
import { UserSelector } from './UserSelector';
import { useParticipantsModal } from '../hooks/useParticipantsModal';
import { useDeleteParticipants } from '../hooks/useChats';

interface DeleteParticipantsModalProps {
  chatId: string;
  participants: (User | string)[];
}

export function DeleteParticipantsModal({
  chatId,
  participants,
}: DeleteParticipantsModalProps) {
  const {
    open,
    selectedUsers,
    setSelectedUsers,
    handleSubmit,
    handleOpenChange,
    closeModal,
  } = useParticipantsModal();

  const { mutate: deleteParticipantsMutation, isPending } = useDeleteParticipants(
    {
      onSuccess: () => {
        closeModal();
      },
    }
  );

  const participantIds = useMemo(() => {
    return participants.map((participant) =>
      typeof participant === 'string' ? participant : participant.id
    );
  }, [participants]);

  const onSubmit = (userIds: string[]) => {
    deleteParticipantsMutation({
      chatId,
      userIds,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='w-full' variant='destructive'>
          Delete Participants
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete Participants</DialogTitle>
            <DialogDescription>
              Select users to remove from this group chat
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <UserSelector
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              includeUserIds={participantIds}
              searchPlaceholder='Search participants to remove'
              label='Search Users'
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type='submit'
              disabled={selectedUsers.length === 0}
              variant='destructive'
            >
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Removing...
                </>
              ) : (
                `Remove ${selectedUsers.length || ''} Participant${selectedUsers.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
