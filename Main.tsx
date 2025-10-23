import React, { useState, useEffect } from 'react';
import App from './App';
import Installer from './components/Installer';
import * as storageService from './services/storageService';
import type { UserProfile } from './types';

const Main: React.FC = () => {
    const [isInstalled, setIsInstalled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use a key to force re-evaluation if app is uninstalled
        const checkInstallation = () => {
            setIsInstalled(storageService.isInstalled());
            setIsLoading(false);
        };
        checkInstallation();
        window.addEventListener('storage', checkInstallation);
        return () => window.removeEventListener('storage', checkInstallation);
    }, []);

    const handleInstallComplete = (profile: UserProfile) => {
        storageService.saveProfile(profile);
        storageService.setInstalledFlag(true);
        setIsInstalled(true);
    };

    const handleUninstall = () => {
        // This will trigger the useEffect to re-check installation status
        setIsInstalled(false); 
        setIsLoading(true);
        // Give it a moment for the state to clear before re-rendering
        setTimeout(() => setIsLoading(false), 50);
    };

    if (isLoading) {
        return <div className="font-mono text-green-400 bg-black min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isInstalled) {
        return <Installer onComplete={handleInstallComplete} />;
    }

    return <App onUninstall={handleUninstall} />;
};

export default Main;
