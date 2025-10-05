import React from 'react';
import './PlaybackProgress.css';

interface PlaybackProgressProps {
  progress: number;
}

const PlaybackProgress: React.FC<PlaybackProgressProps> = ({ progress }) => {
  const radius = 50;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      className="playback-progress-container"
      style={{ opacity: progress > 0 && progress < 1 ? 1 : 0 }}
    >
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="progress-ring-bg"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="progress-ring-fg"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};

export default PlaybackProgress;
