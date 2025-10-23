import { GoogleGenAI, Type } from "@google/genai";
import type { Song, UserProfile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'The name of the song.',
        },
        artist: {
          type: Type.STRING,
          description: 'The name of the artist or band.',
        },
        album: {
          type: Type.STRING,
          description: 'The album the song belongs to.',
        },
        duration: {
            type: Type.INTEGER,
            description: 'The duration of the song in seconds.'
        },
        releaseYear: {
            type: Type.INTEGER,
            description: 'The year the song was released.'
        },
        isCover: {
            type: Type.BOOLEAN,
            description: 'True if the song is a cover version.'
        },
        isRemaster: {
            type: Type.BOOLEAN,
            description: 'True if the song is a remastered version.'
        }
      },
      required: ["title", "artist", "album", "duration", "releaseYear"],
    },
};

export const generatePlaylistFromPrompt = async (prompt: string, userProfile: UserProfile | null): Promise<Song[]> => {
    try {
        let fullPrompt = `Generate a playlist of 15 songs based on the following prompt: "${prompt}". For each song, include its title, artist, album, duration in seconds, release year, and whether it is a cover or a remaster. Provide diverse and interesting tracks.`;

        if (userProfile && userProfile.genres.length > 0) {
            fullPrompt += ` The user enjoys genres like ${userProfile.genres.join(', ')}, so try to tailor the results to their taste.`
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const playlistData = JSON.parse(jsonText);

        // Add a unique ID and isDownloaded status to each song
        return playlistData.map((song: Omit<Song, 'id' | 'isDownloaded'>, index: number) => ({
            ...song,
            id: `${Date.now()}-${index}`,
            isDownloaded: false,
        }));

    } catch (error) {
        console.error("Error generating playlist with Gemini:", error);
        throw new Error("Failed to fetch playlist from Gemini API.");
    }
};
