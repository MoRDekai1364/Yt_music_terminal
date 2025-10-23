import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import AudioVisualizer from './AudioVisualizer';

interface PlayerControlsProps {
  nowPlaying: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (volume: number) => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const width = 50; // characters
    const filledCount = Math.floor(width * (progress / 100));
    const emptyCount = width - filledCount;
    const filled = '█'.repeat(filledCount);
    const empty = '░'.repeat(emptyCount);
    return <span className="text-[var(--color-accent)]">{`[${filled}${empty}]`}</span>;
};


const PlayerControls: React.FC<PlayerControlsProps> = ({ nowPlaying, isPlaying, progress, volume, onTogglePlay, onNext, onPrev, onVolumeChange }) => {
  const [vizData, setVizData] = useState<number[]>(() => new Array(32).fill(0));

  useEffect(() => {
    let intervalId: number | null = null;
    if (isPlaying) {
      intervalId = window.setInterval(() => {
        setVizData(Array.from({ length: 32 }, () => Math.random()));
      }, 100);
    } else {
      setVizData(new Array(32).fill(0));
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  const currentTime = nowPlaying ? (progress / 100) * nowPlaying.duration : 0;

  const handleVolumeDown = () => onVolumeChange(Math.max(0, volume - 5));
  const handleVolumeUp = () => onVolumeChange(Math.min(100, volume + 5));

  return (
    <footer className="mt-2 border-t border-[var(--color-border)] pt-1">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <p className="font-bold truncate text-white">{nowPlaying?.title || 'Nothing Playing'}</p>
          <p className="truncate text-[var(--color-text-dim)]">
            {nowPlaying?.isDownloaded && <span className="text-cyan-400 mr-1">[D]</span>}
            {nowPlaying?.artist || '---'}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <AudioVisualizer data={vizData} />
          <div>
            <button onClick={onPrev} className="px-2 hover:text-white">{'<<'}</button>
            <button onClick={onTogglePlay} className="px-4 text-lg hover:text-white">{isPlaying ? '❚❚' : '▶'}</button>
            <button onClick={onNext} className="px-2 hover:text-white">{'>>'}</button>
          </div>
          <div className="flex items-center space-x-2">
            <span>{formatTime(currentTime)}</span>
            <ProgressBar progress={progress} />
            <span>{nowPlaying ? formatTime(nowPlaying.duration) : '0:00'}</span>
          </div>
        </div>
        <div className="w-1/3 flex justify-end items-center">
          <span className="mr-2">Volume</span>
          <button onClick={handleVolumeDown} className="px-2 hover:text-white">-</button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 h-1 mx-2 appearance-none bg-[var(--color-border)] rounded-full outline-none
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:w-2
                       [&::-webkit-slider-thumb]:bg-[var(--color-primary)]
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:appearance-none
                       [&::-moz-range-thumb]:h-3
                       [&::-moz-range-thumb]:w-2
                       [&::-moz-range-thumb]:bg-[var(--color-primary)]
                       [&::-moz-range-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-track]:bg-[var(--color-border)]
                      "
          />
          <button onClick={handleVolumeUp} className="px-2 hover:text-white">+</button>
          <span className="ml-2 w-8 text-right">{volume}%</span>
        </div>
      </div>
    </footer>
  );
};

export default PlayerControls;