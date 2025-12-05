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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageSquarePlus } from 'lucide-react';

export function ChatInvite() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <MessageSquarePlus className='w-6 h-6 bg-muted' />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Invite</DialogTitle>
            <DialogDescription>Invite your friends to chat</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='username-1'>Username</Label>
              <Input id='username-1' name='username' />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
