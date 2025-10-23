
import React, { useState } from 'react';
import { THEMES } from '../themes';

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    // Login screen uses default theme before user can select one
    const theme = THEMES['Monochrome'];
    // FIX: The default React.CSSProperties type does not include custom properties (CSS variables).
    // Casting to `any` allows us to use them without TypeScript errors.
    const themeStyles: React.CSSProperties = {
        '--color-text': theme.colors.text,
        '--color-text-dim': theme.colors.textDim,
        '--color-primary': theme.colors.primary,
        '--color-primary-dark': theme.colors.primaryDark,
        '--color-background': theme.colors.background,
        '--color-border': theme.colors.border,
        '--color-highlight': theme.colors.highlight,
    } as any;

    const handleLoginClick = () => {
        setIsLoggingIn(true);
        // In a real app, this would trigger the OAuth flow.
        // Here, we simulate a brief delay for the auth service.
        setTimeout(() => {
            onLogin();
            setIsLoggingIn(false);
        }, 500);
    };

    return (
        <div style={themeStyles} className="font-mono text-[var(--color-primary)] bg-[var(--color-background)] min-h-screen flex flex-col items-center justify-center p-4">
            <div className="border-2 border-[var(--color-primary)] p-8 w-full max-w-2xl text-center">
                <h1 className="text-3xl mb-4">[ TermiTune ]</h1>
                <p className="mb-8 text-[var(--color-text)]">A Terminal-Based Music Client</p>
                <div className="text-left bg-gray-900 p-4 border border-[var(--color-primary-dark)] min-h-[100px]">
                    <p>> Please sign in to continue.</p>
                </div>
                <button
                    onClick={handleLoginClick}
                    disabled={isLoggingIn}
                    className="mt-8 border-2 border-[var(--color-primary)] px-6 py-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black focus:bg-[var(--color-primary)] focus:text-black transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--color-primary)]"
                >
                    {isLoggingIn ? 'Connecting...' : 'Sign In with Google'}
                </button>
            </div>
            <div className="mt-8 text-xs text-[var(--color-text-dim)]">
                <p>NOTE: This is a placeholder for a real Google OAuth flow.</p>
                <p>No real account data is used.</p>
            </div>
        </div>
    );
};

export default LoginScreen;