import './OrbVisualizer.css';
import { useUI } from '@/lib/state';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
// FIX: Import React to provide the React namespace for type casting CSSProperties.
import React, { useEffect, useRef, useState } from 'react';

export default function OrbVisualizer() {
  const { inputVolume: rawInputVolume, isMuted } = useUI();
  const { volume: playbackVolume, connected } = useLiveAPIContext();
  const [displayInputVolume, setDisplayInputVolume] = useState(0);
  const animationFrameRef = useRef<number>();

  const isMicActive = connected && !isMuted;

  useEffect(() => {
    const animate = () => {
      setDisplayInputVolume(currentVolume => {
        const targetVolume = isMicActive ? rawInputVolume : 0;
        // Simple lerp for smoothing
        const newVolume = currentVolume + (targetVolume - currentVolume) * 0.2;

        // Stop animating if volume is negligible to save resources
        if (
          animationFrameRef.current &&
          Math.abs(targetVolume - newVolume) < 0.001 &&
          targetVolume < 0.001
        ) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
          return 0; // Final snap to 0
        }

        animationFrameRef.current = requestAnimationFrame(animate);
        return newVolume;
      });
    };

    // Start animation loop if it's not running
    if (animationFrameRef.current === undefined) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isMicActive, rawInputVolume]);

  return (
    <div
      className="orb-visualizer"
      style={
        {
          '--input-volume': displayInputVolume,
          '--playback-volume': playbackVolume,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="input-visualizer">
        <div className="input-ring" />
        <div className="input-ring" />
        <div className="input-ring" />
      </div>
      <div className="playback-visualizer">
        <div className="aurora-layer aurora1" />
        <div className="aurora-layer aurora2" />
        <div className="aurora-layer aurora3" />
      </div>
    </div>
  );
}