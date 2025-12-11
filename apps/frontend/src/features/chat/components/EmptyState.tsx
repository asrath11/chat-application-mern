import React from 'react';

const EmptyState: React.FC = () => (
    <div className='flex flex-col items-center justify-center h-full w-full bg-card'>
        <div className='text-center'>
            <svg
                className='w-32 h-32 mx-auto mb-4 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
            </svg>
            <h3 className='text-xl font-semibold mb-2 text-muted-foreground'>
                Welcome to Chat
            </h3>
            <p className='text-sm text-muted-foreground'>
                Select a conversation to start messaging
            </p>
        </div>
    </div>
);

export default EmptyState;