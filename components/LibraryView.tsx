import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Song } from '../types';
import TerminalWindow from './TerminalWindow';

interface LibraryViewProps {
  songs: Song[];
  onAddToQueue: (song: Song) => void;
  onDownload: (song: Song) => void;
  isActive: boolean;
  setActive: () => void;
}

const FilterCheckbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; isActive: boolean; }> = ({label, checked, onChange, isActive}) => (
    <label onClick={() => onChange(!checked)} className="flex items-center cursor-pointer select-none">
        <div className={`w-3 h-3 border ${isActive ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'} mr-2 flex items-center justify-center`}>
            {checked && <div className="w-2 h-2 bg-[var(--color-primary)]" />}
        </div>
        {label}
    </label>
);

const LibraryView: React.FC<LibraryViewProps> = ({ songs, onAddToQueue, onDownload, isActive, setActive }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
      isDownloaded: false,
      isCover: false,
      isRemaster: false,
  });

  const listRef = useRef<HTMLUListElement>(null);

  const displayedSongs = useMemo(() => {
    return songs.filter(song => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            song.title.toLowerCase().includes(searchTermLower) ||
            song.artist.toLowerCase().includes(searchTermLower) ||
            song.album.toLowerCase().includes(searchTermLower);

        const matchesFilters = 
            (!filters.isDownloaded || song.isDownloaded) &&
            (!filters.isCover || !!song.isCover) &&
            (!filters.isRemaster || !!song.isRemaster);
        
        return matchesSearch && matchesFilters;
    });
  }, [songs, searchTerm, filters]);
  
  useEffect(() => {
      setSelectedIndex(0);
  }, [displayedSongs, songs]);

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
        (listRef.current.children[selectedIndex] as HTMLElement).scrollIntoView({
            block: 'nearest',
        });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;
    // Allow typing in search input
    if (e.target instanceof HTMLInputElement && e.key.length === 1) {
        return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(displayedSongs.length - 1, prev + 1));
    } else if (e.key === 'Enter' && displayedSongs[selectedIndex] && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      onAddToQueue(displayedSongs[selectedIndex]);
    } else if (e.key.toLowerCase() === 'd' && displayedSongs[selectedIndex]) {
        e.preventDefault();
        onDownload(displayedSongs[selectedIndex]);
    }
  };
  
  return (
    <div className="h-full" onKeyDown={handleKeyDown} onClick={setActive} tabIndex={-1}>
      <TerminalWindow title="Library" isActive={isActive}>
        <div className="flex flex-col h-full">
            <div className="text-xs mb-2 p-1 border-b border-[var(--color-border)] space-y-1">
                <div className="flex items-center space-x-2">
                    <span className="text-[var(--color-text-dim)] w-16">Search:</span>
                    <input type="text" value={searchTerm} onFocus={setActive} onChange={e => setSearchTerm(e.target.value)} className="bg-gray-800 px-1 flex-grow outline-none border border-[var(--color-border)] focus:border-[var(--color-primary)]" />
                </div>
                 <div className="flex items-center space-x-4">
                    <span className="text-[var(--color-text-dim)] w-16">Filters:</span>
                    <FilterCheckbox label="Downloaded" checked={filters.isDownloaded} onChange={c => setFilters(f => ({...f, isDownloaded: c}))} isActive={isActive} />
                    <FilterCheckbox label="Cover" checked={filters.isCover} onChange={c => setFilters(f => ({...f, isCover: c}))} isActive={isActive} />
                    <FilterCheckbox label="Remaster" checked={filters.isRemaster} onChange={c => setFilters(f => ({...f, isRemaster: c}))} isActive={isActive} />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-1">
                {
                    displayedSongs.length > 0 ? (
                        <ul ref={listRef}>
                            {displayedSongs.map((song, index) => (
                                <li key={song.id} className={`flex justify-between whitespace-nowrap overflow-hidden ${selectedIndex === index && isActive ? 'bg-[var(--color-highlight)] text-white' : ''}`}>
                                    <span className="truncate">
                                      {`${selectedIndex === index && isActive ? '>' : ' '}`}
                                      {song.isDownloaded ? <span className="text-cyan-400 mx-1">[D]</span> : <span className="mx-1">   </span>}
                                      {`${song.title} (${song.artist})`}
                                      {song.isCover && <span className="text-purple-400 ml-2">(Cover)</span>}
                                      {song.isRemaster && <span className="text-yellow-400 ml-2">(Remaster)</span>}
                                    </span>
                                    <span className="text-[var(--color-text-dim)]">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[var(--color-text-dim)]">{songs.length > 0 ? 'No songs match your filters.' : 'Library is empty.'}</p>
                    )
                }
            </div>
        </div>
      </TerminalWindow>
    </div>
  );
};

export default LibraryView;