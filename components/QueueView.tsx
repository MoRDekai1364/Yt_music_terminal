import React, { useState, useEffect, useRef } from 'react';
import type { Song } from '../types';
import TerminalWindow from './TerminalWindow';

interface QueueViewProps {
  queue: Song[];
  nowPlaying: Song | null;
  onPlay: (song: Song) => void;
  isActive: boolean;
  setActive: () => void;
}

const QueueView: React.FC<QueueViewProps> = ({ queue, nowPlaying, onPlay, isActive, setActive }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const nowPlayingIndex = queue.findIndex(s => s.id === nowPlaying?.id);
        if (nowPlayingIndex !== -1) {
            setSelectedIndex(nowPlayingIndex);
        }
    }, [nowPlaying, queue]);

    useEffect(() => {
        if (listRef.current && listRef.current.children[selectedIndex]) {
            (listRef.current.children[selectedIndex] as HTMLElement).scrollIntoView({
                block: 'nearest',
            });
        }
    }, [selectedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isActive) return;
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(queue.length - 1, prev + 1));
        } else if (e.key === 'Enter' && queue[selectedIndex]) {
          e.preventDefault();
          onPlay(queue[selectedIndex]);
        }
      };

    return (
    <div className="h-full" onKeyDown={handleKeyDown} onClick={setActive} tabIndex={-1}>
      <TerminalWindow title="Playlist" isActive={isActive}>
        {queue.length > 0 ? (
          <ul ref={listRef}>
            {queue.map((song, index) => {
              const isNowPlaying = song.id === nowPlaying?.id;
              const isSelected = index === selectedIndex && isActive;
              let itemClass = 'whitespace-nowrap overflow-hidden truncate';
              if (isNowPlaying) itemClass += ' text-[var(--color-accent)]';
              if (isSelected) itemClass += ' bg-[var(--color-highlight)] text-white';

              return (
                <li key={song.id} className={itemClass} onDoubleClick={() => onPlay(song)}>
                  {`${isSelected ? '>' : ' '} ${isNowPlaying ? '>>' : '  '}`}
                  {song.isDownloaded ? <span className="text-cyan-400 mx-1">[D]</span> : <span className="mx-1">   </span>}
                  {`${song.title} - ${song.artist}`}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[var(--color-text-dim)]">Queue is empty. Add songs from the library.</p>
        )}
      </TerminalWindow>
    </div>
  );
};

export default QueueView;