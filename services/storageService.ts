import type { UserProfile, ThemeName } from '../types';

const PROFILE_KEY = 'termitune_profile';
const INSTALLED_KEY = 'termitune_installed';
const DOWNLOADED_SONGS_KEY = 'termitune_downloaded_songs';
const THEME_KEY = 'termitune_theme';

// --- Installation ---
export const isInstalled = (): boolean => {
    return localStorage.getItem(INSTALLED_KEY) === 'true';
};

export const setInstalledFlag = (installed: boolean): void => {
    localStorage.setItem(INSTALLED_KEY, String(installed));
};

// --- Profile ---
export const saveProfile = (profile: UserProfile): void => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
    const profileStr = localStorage.getItem(PROFILE_KEY);
    return profileStr ? JSON.parse(profileStr) : null;
};

// --- Songs ---
export const getDownloadedSongs = (): string[] => {
    const songsStr = localStorage.getItem(DOWNLOADED_SONGS_KEY);
    return songsStr ? JSON.parse(songsStr) : [];
};

export const addDownloadedSong = (songId: string): void => {
    const songs = getDownloadedSongs();
    if (!songs.includes(songId)) {
        songs.push(songId);
        localStorage.setItem(DOWNLOADED_SONGS_KEY, JSON.stringify(songs));
    }
};

// --- Theme ---
export const saveTheme = (themeName: ThemeName): void => {
    localStorage.setItem(THEME_KEY, themeName);
};

export const getTheme = (): ThemeName => {
    const themeName = localStorage.getItem(THEME_KEY);
    return (themeName as ThemeName) || 'Monochrome'; // Default theme
};

// --- Uninstaller ---
export const clearAllData = (): void => {
    // This is the "destructive" uninstallation part.
    // We clear all keys that our application uses.
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(INSTALLED_KEY);
    localStorage.removeItem(DOWNLOADED_SONGS_KEY);
    localStorage.removeItem(THEME_KEY);
    // Also clear session data
    localStorage.removeItem('termitune_session'); 
    console.log("All TermiTune data has been cleared.");
};