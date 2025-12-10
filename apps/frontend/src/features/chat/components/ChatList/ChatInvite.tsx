import { useState } from 'react';
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
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Avatar } from '@/components/shared/Avatar';
import { useUsers, useCreateChat } from '@/features/hooks';
import type { UserListItem } from '@/features/auth/services/user.service';

export function ChatInvite() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

  const { data: users = [] } = useUsers();

  const userOptions = users.map((user: UserListItem) => user.userName);

  const resetForm = () => {
    setSearchValue('');
    setSelectedUser(null);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const { mutate: createChatMutation, isPending } = useCreateChat({
    onSuccess: () => {
      resetForm();
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    createChatMutation(selectedUser.id);
  };

  const handleSelectUser = (userName: string) => {
    setSearchValue(userName);
    const user = users.find((u: UserListItem) => u.userName === userName) || null;
    setSelectedUser(user);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <MessageSquarePlus className='w-6 h-6 bg-muted' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite</DialogTitle>
            <DialogDescription>Invite your friends to chat</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-3'>
              <Autocomplete
                options={userOptions}
                value={searchValue}
                onChange={(value) => {
                  setSearchValue(value);
                  setSelectedUser(null);
                }}
                onSelect={handleSelectUser}
                placeholder='Search users...'
                emptyMessage='No users found'
                renderOption={(option) => (
                  <>
                    <Avatar name={option} />
                    {option}
                  </>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={!selectedUser || isPending}>
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
