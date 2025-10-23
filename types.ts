export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  releaseYear?: number;
  isCover?: boolean;
  isRemaster?: boolean;
  isDownloaded?: boolean; // Represents both cached and downloaded
}

export interface UserProfile {
  name: string;
  email: string; // Simulated email for display
  genres: string[];
}

export type ThemeName = 'Monochrome' | 'Terminal' | 'Amber' | 'Cyan';

export interface Theme {
  name: ThemeName;
  colors: {
    text: string;
    textDim: string;
    primary: string;
    primaryDark: string;
    background: string;
    border: string;
    highlight: string;
    accent: string;
    destructive: string;
    destructiveHover: string;
  };
}
