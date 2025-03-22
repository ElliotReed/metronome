import * as React from 'react';
import { useMetronomeStore } from '@/store';

import * as Buttons from '../common/Button';

const DEFAULT_DELAY_IN_MILLISECONDS = 160;

export default function BpmIncreaseOrDecrease({ children }:
  { children: React.ReactNode }) {
  const timeoutRef = React.useRef<number | null>(null);
  const { incrementBpm, decrementBpm } = useMetronomeStore();

  const initializeTimer = (callback: Function, interval: number,) => {
    const MAXIMUM_SPEED_IN_MILLISECONDS = 25;
    timeoutRef.current = (
      window.setTimeout(() => {
        callback();
        let newInterval = interval;
        if (interval > MAXIMUM_SPEED_IN_MILLISECONDS) {
          newInterval = interval - 5;
        }

        initializeTimer(callback, newInterval,)
      }, interval)
    );
  };

  const clearIfRefCurrentExists = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }
  const handleDecrementMouseDown = () => {
    decrementBpm()
    initializeTimer(decrementBpm, DEFAULT_DELAY_IN_MILLISECONDS,);
  };

  const handleIncrementMouseDown = () => {
    incrementBpm()
    initializeTimer(incrementBpm, DEFAULT_DELAY_IN_MILLISECONDS,);
  };

  const handleMouseUp = () => {
    clearIfRefCurrentExists();
  };

  React.useEffect(() => {
    return () => {
      clearIfRefCurrentExists();
    };
  }, []);

  return (
    <div className="metronomeControls__container-bpm">
      <Buttons.Circular
        onPointerDown={handleDecrementMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        -
      </Buttons.Circular>
      {children}
      <Buttons.Circular
        onPointerDown={handleIncrementMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        +
      </Buttons.Circular>
    </div>
  );
}

