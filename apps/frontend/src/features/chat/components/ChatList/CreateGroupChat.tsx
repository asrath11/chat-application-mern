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
import { Loader2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCreateGroupChat } from '@/features/hooks';
import { UserSelector } from '../UserSelector';

export function CreateGroupChat() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Create group chat mutation
  const { mutate: createGroupChatMutation, isPending } = useCreateGroupChat({
    onSuccess: () => {
      setOpen(false);
      setGroupName('');
      setSelectedUsers([]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) return toast.error('Group name is required');
    if (selectedUsers.length < 2)
      return toast.error('Select at least 2 users for a group');

    createGroupChatMutation({ name: groupName, users: selectedUsers });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Users className='w-6 h-6 bg-muted' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Group Chat</DialogTitle>
            <DialogDescription>
              Choose a name and invite your friends
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Group Name */}
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder='Enter group name'
              />
            </div>

            {/* User Selector */}
            <UserSelector
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              searchPlaceholder='Search users'
              label='Add Members'
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>

            <Button type='submit' disabled={isPending}>
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
