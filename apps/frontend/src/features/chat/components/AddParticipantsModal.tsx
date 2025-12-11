import { useState, useMemo } from 'react';
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
import { useAddParticipants } from '@/features/hooks';

interface AddParticipantsModalProps {
  chatId: string;
  existingParticipants: (User | string)[];
}

export function AddParticipantsModal({
  chatId,
  existingParticipants,
}: AddParticipantsModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Add participants mutation
  const { mutate: addParticipantsMutation, isPending } = useAddParticipants({
    onSuccess: () => {
      setOpen(false);
      setSelectedUsers([]);
    },
  });

  // Get existing participant IDs
  const existingParticipantIds = useMemo(() => {
    return existingParticipants.map((participant) =>
      typeof participant === 'string' ? participant : participant.id
    );
  }, [existingParticipants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      return;
    }

    addParticipantsMutation({
      chatId,
      userIds: selectedUsers,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full'>Add Participants</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Participants</DialogTitle>
            <DialogDescription>
              Select users to add to this group chat
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <UserSelector
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              excludeUserIds={existingParticipantIds}
              searchPlaceholder='Search users to add'
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
              disabled={isPending || selectedUsers.length === 0}
            >
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Adding...
                </>
              ) : (
                `Add ${selectedUsers.length || ''} Participant${selectedUsers.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
