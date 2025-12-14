import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/shared/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';

interface ChatListFooterProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export const ChatListFooter: React.FC<ChatListFooterProps> = ({
  userName,
  userEmail,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className='p-4 border-t'>
      <div className='flex items-center gap-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent/50 rounded-lg p-2 -ml-2 transition-colors'>
              <Avatar name={userName} />
              <div className='flex-1 min-w-0'>
                <p className='font-semibold truncate'>{userName}</p>
                <p className='text-xs text-muted-foreground truncate'>
                  {userEmail}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-56'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className='text-red-400'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
