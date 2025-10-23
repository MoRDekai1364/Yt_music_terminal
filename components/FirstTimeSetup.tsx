import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface InstallerProps {
    onComplete: (profile: UserProfile) => void;
}

const STEPS = [
    'Initialize application environment...',
    'Verifying system requirements...',
    'Setting up local cache...',
    'Awaiting user profile configuration...',
];

const Installer: React.FC<InstallerProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [genres, setGenres] = useState('');
    const [isInstalling, setIsInstalling] = useState(true);

    React.useEffect(() => {
        if (isInstalling) {
            const timer = setInterval(() => {
                setStep(prev => {
                    if (prev < STEPS.length - 1) {
                        return prev + 1;
                    }
                    clearInterval(timer);
                    setIsInstalling(false);
                    return prev;
                });
            }, 700);
            return () => clearInterval(timer);
        }
    }, [isInstalling]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const profile: UserProfile = {
            name,
            email: `${name.toLowerCase().replace(/\s/g, '.')}@termitune.io`, // create a fake email
            genres: genres.split(',').map(g => g.trim()).filter(Boolean),
        };
        onComplete(profile);
    };

    return (
        <div className="font-mono text-green-400 bg-black min-h-screen flex flex-col items-center justify-center p-4">
            <div className="border-2 border-green-400 p-8 w-full max-w-3xl">
                <h1 className="text-2xl mb-4 text-center">[ TermiTune First-Time Setup ]</h1>
                <div className="text-left bg-gray-900 p-4 border border-green-700 min-h-[150px] mb-6">
                    {STEPS.slice(0, step + 1).map((s, i) => <p key={i}>> {s}{i === step && isInstalling ? '_' : ''}</p>)}
                </div>
                
                {!isInstalling && (
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-1">> Enter your name:</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent border border-green-500 w-full px-2 py-1 outline-none focus:bg-green-900"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="genres" className="block mb-1">> Enter your favorite music genres (comma-separated):</label>
                            <input
                                id="genres"
                                type="text"
                                value={genres}
                                onChange={(e) => setGenres(e.target.value)}
                                placeholder="e.g. 90s rock, synthwave, classical"
                                className="bg-transparent border border-green-500 w-full px-2 py-1 outline-none focus:bg-green-900"
                                required
                            />
                        </div>
                         <button
                            type="submit"
                            disabled={!name || !genres}
                            className="mt-4 border-2 border-green-400 px-6 py-2 text-green-400 hover:bg-green-400 hover:text-black focus:bg-green-400 focus:text-black transition-colors disabled:opacity-50"
                        >
                            Complete Setup
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Installer;
