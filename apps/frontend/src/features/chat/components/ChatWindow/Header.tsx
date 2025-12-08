import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';

interface HeaderProps {
    name: string;
    statusText: string;
    isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    name,
    statusText,
    isOnline,
}) => {
    return (
        <div className='flex items-center justify-between p-4 bg-card border-b'>
            <div className='flex items-center gap-3'>
                <div className='relative'>
                    <Avatar name={name} />

                    {isOnline && (
                        <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full'></div>
                    )}
                </div>

                <div>
                    <h2 className='font-semibold text-gray-900 dark:text-white'>
                        {name}
                    </h2>
                    <p className='text-xs'>{statusText}</p>
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
    );
};
