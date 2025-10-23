import React from 'react';

interface AudioVisualizerProps {
  data: number[];
  barWidth?: number;
  gap?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ data, barWidth = 3, gap = 2 }) => {
  return (
    <div className="flex items-end justify-center h-10 mb-1" style={{ gap: `${gap}px` }}>
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-[var(--color-primary)]"
          style={{
            width: `${barWidth}px`,
            height: `${Math.max(2, value * 100)}%`,
            transition: 'height 0.08s ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
