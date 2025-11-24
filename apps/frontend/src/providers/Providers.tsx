import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme='system' attribute='class' enableSystem={true}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
};
