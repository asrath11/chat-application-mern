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
import { Avatar } from '@/components/common/Avatar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService, type UserListItem } from '@/services/user.service';
import { createChat } from '@/services/chat.service';

export function ChatInvite() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  const userOptions = users.map((user) => user.userName);

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

  const { mutate: createChatMutation, isPending } = useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      toast.success('Chat created');
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      resetForm();
      setOpen(false);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create chat';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    createChatMutation(selectedUser.id);
  };

  const handleSelectUser = (userName: string) => {
    setSearchValue(userName);
    const user = users.find((u) => u.userName === userName) || null;
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
