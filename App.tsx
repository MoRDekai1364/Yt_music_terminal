import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Song, UserProfile, ThemeName } from './types';
import * as authService from './services/authService';
import * as storageService from './services/storageService';
import LibraryView from './components/LibraryView';
import QueueView from './components/QueueView';
import PlayerControls from './components/PlayerControls';
import SettingsMenu from './components/SettingsMenu';
import UninstallingScreen from './components/UninstallingScreen';
import LoginScreen from './components/LoginScreen';
import { SONG_LIBRARY } from './constants';
import { THEMES } from './themes';

const App: React.FC<{ onUninstall: () => void }> = ({ onUninstall }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isInitialising, setIsInitialising] = useState<boolean>(true);
    const [isUninstalling, setIsUninstalling] = useState<boolean>(false);
    
    const [librarySongs, setLibrarySongs] = useState<Song[]>([]);
    const [queue, setQueue] = useState<Song[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [volume, setVolume] = useState<number>(80);
    const [activePane, setActivePane] = useState<'library' | 'queue'>('library');
    const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<ThemeName>(storageService.getTheme());

    const intervalRef = useRef<number | null>(null);
    const appRef = useRef<HTMLDivElement>(null);

    const currentTheme = THEMES[themeName];
    // FIX: The default React.CSSProperties type does not include custom properties (CSS variables).
    // Casting to `any` allows us to use them without TypeScript errors.
    const themeStyles: React.CSSProperties = {
        '--color-text': currentTheme.colors.text,
        '--color-text-dim': currentTheme.colors.textDim,
        '--color-primary': currentTheme.colors.primary,
        '--color-primary-dark': currentTheme.colors.primaryDark,
        '--color-background': currentTheme.colors.background,
        '--color-border': currentTheme.colors.border,
        '--color-highlight': currentTheme.colors.highlight,
        '--color-accent': currentTheme.colors.accent,
        '--color-destructive': currentTheme.colors.destructive,
        '--color-destructive-hover': currentTheme.colors.destructiveHover,
    } as any;


    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = authService.isAuthenticated();
            setIsAuthenticated(authStatus);
            if (authStatus) {
                const profile = authService.getProfile();
                setUserProfile(profile);
                const savedSongs = storageService.getDownloadedSongs();
                const allSongs = SONG_LIBRARY.map(s => ({...s, isDownloaded: savedSongs.includes(s.id)}));
                setLibrarySongs(allSongs);
                const initialQueue = allSongs.slice(0, 5);
                setQueue(initialQueue);
                setNowPlaying(initialQueue[0] || null);
            }
            setIsInitialising(false);
            appRef.current?.focus();
        };
        checkAuth();
    }, []);

    const stopPlaybackInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startPlaybackInterval = useCallback(() => {
        stopPlaybackInterval();
        if (nowPlaying) {
            intervalRef.current = window.setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + 100 / nowPlaying.duration;
                    if (newProgress >= 100) {
                        playNextSong();
                        return 0;
                    }
                    return newProgress;
                });
            }, 1000);
        }
    }, [nowPlaying, queue]);

    useEffect(() => {
        if (isPlaying) {
            startPlaybackInterval();
        } else {
            stopPlaybackInterval();
        }
        return () => stopPlaybackInterval();
    }, [isPlaying, startPlaybackInterval]);


    const playNextSong = () => {
        if (!nowPlaying) return;
        const currentIndex = queue.findIndex(song => song.id === nowPlaying.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        if (queue[nextIndex]) {
            handlePlaySong(queue[nextIndex]);
        }
    };

    const playPrevSong = () => {
        if (!nowPlaying) return;
        const currentIndex = queue.findIndex(song => song.id === nowPlaying.id);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        if (queue[prevIndex]) {
            handlePlaySong(queue[prevIndex]);
        }
    };

    const handlePlaySong = (song: Song) => {
        setNowPlaying(song);
        setProgress(0);
        setIsPlaying(true);
    };

    const handleTogglePlay = () => {
        if (!nowPlaying && queue.length > 0) {
            handlePlaySong(queue[0]);
        } else {
            setIsPlaying(prev => !prev);
        }
    };
    
    const handleAddToQueue = (song: Song) => {
        if (!queue.some(s => s.id === song.id)) {
            setQueue(prev => [...prev, song]);
        }
    };

    const handleDownloadSong = (songToDownload: Song) => {
        const updatedSong = { ...songToDownload, isDownloaded: true };
        storageService.addDownloadedSong(songToDownload.id);
        setLibrarySongs(prev => prev.map(s => s.id === songToDownload.id ? updatedSong : s));
        setQueue(prev => prev.map(s => s.id === songToDownload.id ? updatedSong : s));
        if (nowPlaying?.id === songToDownload.id) {
            setNowPlaying(updatedSong);
        }
    };

    const handleGlobalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isSettingsVisible) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            setActivePane(prev => prev === 'library' ? 'queue' : 'library');
        } else if (e.key.toLowerCase() === 's' && !isSettingsVisible) {
             e.preventDefault();
            setIsSettingsVisible(true);
        } else if (e.code === 'Space' && e.target === appRef.current) {
            e.preventDefault();
            handleTogglePlay();
        } else if (e.key === '-') {
            e.preventDefault();
            setVolume(v => Math.max(0, v - 5));
        } else if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            setVolume(v => Math.min(100, v + 5));
        }
    };
    
    const handleLogin = () => {
       const profile = authService.signIn();
       setUserProfile(profile);
       setIsAuthenticated(true);
       const savedSongs = storageService.getDownloadedSongs();
       const allSongs = SONG_LIBRARY.map(s => ({...s, isDownloaded: savedSongs.includes(s.id)}));
       setLibrarySongs(allSongs);
       const initialQueue = allSongs.slice(0, 5);
       setQueue(initialQueue);
       setNowPlaying(initialQueue[0] || null);
    };

    const handleSignOut = () => {
        authService.signOut();
        setIsAuthenticated(false);
        setUserProfile(null);
        setIsSettingsVisible(false);
        setQueue([]);
        setLibrarySongs([]);
        setNowPlaying(null);
    };
    
    const handleUninstall = () => {
        setIsUninstalling(true);
        storageService.clearAllData();
        setTimeout(() => {
            onUninstall();
        }, 2500);
    };
    
    const handleThemeChange = (newTheme: ThemeName) => {
        storageService.saveTheme(newTheme);
        setThemeName(newTheme);
    };

    if (isInitialising) {
        return <div className="font-mono text-[var(--color-primary)] bg-black min-h-screen flex items-center justify-center">Initializing...</div>;
    }
    
    if (isUninstalling) {
        return <UninstallingScreen />;
    }

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div 
            className="font-mono text-[var(--color-text)] bg-[var(--color-background)] min-h-screen flex flex-col p-2 focus:outline-none"
            onKeyDown={handleGlobalKeyDown}
            tabIndex={-1}
            ref={appRef}
            style={themeStyles}
        >
          <header className="text-center p-1 border-b-2 border-double border-[var(--color-border)]">
            <h1 className="text-xl text-[var(--color-primary)]">TermiTune</h1>
            <p className="text-xs text-[var(--color-text-dim)]">Logged in as: {userProfile?.name} ({userProfile?.email})</p>
          </header>
          
          <main className="flex-grow flex my-2 space-x-2 h-[calc(100vh-150px)]">
            <div className="w-2/3">
              <LibraryView
                songs={librarySongs}
                onAddToQueue={handleAddToQueue}
                onDownload={handleDownloadSong}
                isActive={activePane === 'library'}
                setActive={() => setActivePane('library')}
              />
            </div>
            <div className="w-1/3">
              <QueueView
                queue={queue}
                nowPlaying={nowPlaying}
                onPlay={handlePlaySong}
                isActive={activePane === 'queue'}
                setActive={() => setActivePane('queue')}
              />
            </div>
          </main>
          
          <PlayerControls
            nowPlaying={nowPlaying}
            isPlaying={isPlaying}
            progress={progress}
            volume={volume}
            onTogglePlay={handleTogglePlay}
            onNext={playNextSong}
            onPrev={playPrevSong}
            onVolumeChange={setVolume}
          />
          <div className="text-xs text-center text-[var(--color-text-dim)] pt-1 border-t border-[var(--color-border)]">
              CONTROLS: [Tab] Switch Panes | [Space] Play/Pause | [S] Settings | [-/+] Volume
          </div>
          {isSettingsVisible && userProfile && <SettingsMenu userProfile={userProfile} onClose={() => setIsSettingsVisible(false)} onSignOut={handleSignOut} onUninstall={handleUninstall} onThemeChange={handleThemeChange} currentThemeName={themeName} />}
        </div>
      );
};

export default App;