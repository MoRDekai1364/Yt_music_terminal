import React, { useEffect, useRef, useState } from 'react';
import type { UserProfile, ThemeName } from '../types';
import TerminalWindow from './TerminalWindow';
import { THEMES } from '../themes';

interface SettingsMenuProps {
  userProfile: UserProfile;
  currentThemeName: ThemeName;
  onClose: () => void;
  onSignOut: () => void;
  onUninstall: () => void;
  onThemeChange: (themeName: ThemeName) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ userProfile, currentThemeName, onClose, onSignOut, onUninstall, onThemeChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [confirmUninstall, setConfirmUninstall] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        containerRef.current?.focus();
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

  const handleUninstallClick = () => {
    if (confirmUninstall) {
        onUninstall();
    } else {
        setConfirmUninstall(true);
    }
  };

  return (
    <div
        ref={containerRef}
        tabIndex={-1}
        className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 outline-none"
        onClick={onClose}
    >
        <div className="w-2/3 max-w-2xl min-h-1/2" onClick={e => e.stopPropagation()}>
            <TerminalWindow title="Settings" isActive={true}>
                <div className="p-4 space-y-4">
                    <h3 className="text-lg text-[var(--color-primary)] border-b border-[var(--color-border)] mb-3">User Profile</h3>
                    <p><span className="text-[var(--color-primary)] w-36 inline-block">Name:</span> {userProfile.name}</p>
                    <p><span className="text-[var(--color-primary)] w-36 inline-block">Email:</span> {userProfile.email}</p>
                    <p><span className="text-[var(--color-primary)] w-36 inline-block">Favorite Genres:</span> {userProfile.genres.join(', ')}</p>
                    
                     <h3 className="text-lg text-[var(--color-primary)] border-b border-[var(--color-border)] mb-3 pt-4">Appearance</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-[var(--color-primary)] w-36 inline-block">Theme:</span>
                        {Object.values(THEMES).map(theme => (
                            <button
                                key={theme.name}
                                onClick={() => onThemeChange(theme.name)}
                                className={`border px-3 py-1 text-sm transition-colors ${currentThemeName === theme.name ? 'bg-[var(--color-primary)] text-black' : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'}`}
                            >
                                {theme.name}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-lg text-[var(--color-primary)] border-b border-[var(--color-border)] mb-3 pt-4">Actions</h3>
                    <div className="flex space-x-4">
                         <button 
                            onClick={onSignOut}
                            className="border border-[var(--color-accent)] px-4 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-colors"
                         >
                             Sign Out
                         </button>
                         <button 
                            onClick={handleUninstallClick}
                            onMouseLeave={() => setConfirmUninstall(false)}
                            className={`border px-4 py-1 transition-colors ${confirmUninstall ? 'bg-[var(--color-destructive-hover)] text-white border-[var(--color-destructive-hover)]' : 'border-[var(--color-destructive)] text-[var(--color-destructive)] hover:bg-[var(--color-destructive)] hover:text-black'}`}
                         >
                             {confirmUninstall ? 'Confirm Uninstall?' : 'Uninstall'}
                         </button>
                    </div>
                    {confirmUninstall && <p className="text-[var(--color-destructive)] text-sm">This will delete all local data and reset the application. This action cannot be undone.</p>}

                </div>
                <div className="absolute bottom-4 left-6 text-[var(--color-text-dim)]">
                    Press [Esc] to close
                </div>
            </TerminalWindow>
        </div>
    </div>
  );
};

export default SettingsMenu;