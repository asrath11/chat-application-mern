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
import { MessageSquarePlus } from 'lucide-react';
import { Autocomplete } from '@/components/ui/autocomplete';

const list = ["asrath", "bablu"]

export function ChatInvite() {
  const [selectedUser, setSelectedUser] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inviting user:', selectedUser);
    // Add your invite logic here
  };

  return (
    <Dialog>
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
                options={list}
                value={selectedUser}
                onChange={setSelectedUser}
                placeholder="Search users..."
                emptyMessage="No users found"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button'>Cancel</Button>
            </DialogClose>
            <Button type='submit' disabled={!selectedUser}>
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
