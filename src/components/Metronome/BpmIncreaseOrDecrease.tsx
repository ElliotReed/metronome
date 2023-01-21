import * as React from 'react';

import * as Buttons from '../common/Button';

interface Props {
  setBpm: React.Dispatch<React.SetStateAction<number>>;
}

export default function BpmIncreaseOrDecrease({ setBpm, children }:
  React.PropsWithChildren<Props>) {
  const DEFAULT_DELAY_IN_MILLISECONDS = 160;
  const timeoutRef = React.useRef<number | null>(null);

  const incrementBpm = () => setBpm((prev: number) => prev + 1);
  const decrementBpm = () => setBpm((prev: number) => prev - 1);

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

