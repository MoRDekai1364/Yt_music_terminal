
import React, { useState, useEffect } from 'react';
import { THEMES } from '../themes';

const STEPS = [
    'Closing active sessions...',
    'Deleting user profile...',
    'Clearing song cache...',
    'Removing local data...',
    'Uninstallation complete. You can now close this window.'
];

const UninstallingScreen: React.FC = () => {
    const [step, setStep] = useState(0);
    // Uninstaller uses default theme before user can select one
    const theme = THEMES['Monochrome'];
    // FIX: The default React.CSSProperties type does not include custom properties (CSS variables).
    // Casting to `any` allows us to use them without TypeScript errors.
    const themeStyles: React.CSSProperties = {
        '--color-destructive': theme.colors.destructive,
        '--color-accent': theme.colors.accent,
        '--color-background': theme.colors.background,
    } as any;

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => {
                if (prev < STEPS.length - 1) {
                    return prev + 1;
                }
                clearInterval(timer);
                return prev;
            });
        }, 500); // 2500ms total for 5 steps, matches the timeout in App.tsx
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={themeStyles} className="font-mono text-[var(--color-destructive)] bg-[var(--color-background)] min-h-screen flex flex-col items-center justify-center p-4">
            <div className="border-2 border-[var(--color-destructive)] p-8 w-full max-w-2xl">
                <h1 className="text-2xl mb-4 text-center text-[var(--color-destructive)]">[ Uninstalling TermiTune ]</h1>
                <div className="text-left bg-gray-900 p-4 border border-[var(--color-destructive)] min-h-[150px]">
                    {STEPS.slice(0, step + 1).map((s, i) => (
                         <p key={i} className={i === STEPS.length - 1 ? 'text-[var(--color-accent)]' : ''}>> {s}{i === step && i < STEPS.length - 1 ? '_' : ''}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UninstallingScreen;