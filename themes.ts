import type { Theme, ThemeName } from './types';

export const THEMES: Record<ThemeName, Theme> = {
    Monochrome: {
        name: 'Monochrome',
        colors: {
            text: '#d1d5db', // gray-300
            textDim: '#6b7280', // gray-500
            primary: '#e5e7eb', // gray-200
            primaryDark: '#9ca3af', // gray-400
            background: '#000000',
            border: '#4b5563', // gray-600
            highlight: '#374151', // gray-700
            accent: '#f3f4f6', // gray-100
            destructive: '#f87171', // red-400
            destructiveHover: '#ef4444', // red-500
        }
    },
    Terminal: {
        name: 'Terminal',
        colors: {
            text: '#d1d5db', // gray-300
            textDim: '#6b7280', // gray-500
            primary: '#34d399', // green-400
            primaryDark: '#10b981', // green-500
            background: '#000000',
            border: '#4b5563', // gray-600
            highlight: '#064e3b', // green-900
            accent: '#facc15', // yellow-400
            destructive: '#f87171', // red-400
            destructiveHover: '#ef4444', // red-500
        }
    },
    Amber: {
        name: 'Amber',
        colors: {
            text: '#d1d5db', // gray-300
            textDim: '#6b7280', // gray-500
            primary: '#fbbf24', // amber-400
            primaryDark: '#f59e0b', // amber-500
            background: '#1c1917', // stone-900
            border: '#57534e', // stone-600
            highlight: '#57534e', // stone-600
            accent: '#a78bfa', // violet-400
            destructive: '#f87171', // red-400
            destructiveHover: '#ef4444', // red-500
        }
    },
    Cyan: {
        name: 'Cyan',
        colors: {
            text: '#e0f2fe', // sky-100
            textDim: '#7dd3fc', // sky-300
            primary: '#67e8f9', // cyan-300
            primaryDark: '#22d3ee', // cyan-400
            background: '#082f49', // cyan-950
            border: '#0891b2', // cyan-600
            highlight: '#164e63', // cyan-900
            accent: '#f472b6', // pink-400
            destructive: '#fb7185', // rose-400
            destructiveHover: '#f43f5e', // rose-500
        }
    }
};
