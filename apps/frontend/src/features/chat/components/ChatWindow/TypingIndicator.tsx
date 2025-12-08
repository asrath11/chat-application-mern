import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className='flex justify-start'>
            <div className='rounded-2xl rounded-bl-none px-4 py-3 shadow-sm'>
                <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                    <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
