import * as storageService from './storageService';
import type { UserProfile } from '../types';

const SESSION_KEY = 'termitune_session';

// This is a placeholder for a real authentication flow (e.g., OAuth2)
// It uses localStorage to simulate a persistent session.

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(SESSION_KEY);
};

export const signIn = (): UserProfile => {
    const profile = storageService.getProfile();
    if (!profile) {
        throw new Error("User profile not found. Installation might be corrupt.");
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ loggedIn: true, userId: profile.email }));
    return profile;
};

export const signOut = (): void => {
    localStorage.removeItem(SESSION_KEY);
};

export const getProfile = (): UserProfile | null => {
    if (!isAuthenticated()) {
        return null;
    }
    return storageService.getProfile();
};
