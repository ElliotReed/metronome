import * as React from 'react';

import { useMetronomeStore } from '@/store';
import { useKeyPress, useSimulateButtonEvents } from '@/hooks';

import Button from '../common/Button';

const DEFAULT_DELAY_IN_MILLISECONDS = 160;
const MAXIMUM_SPEED_IN_MILLISECONDS = 25;

export default function BpmIncreaseOrDecrease(
  { children }: { children: React.ReactNode }
) {
  const keyPress = useKeyPress();
  const { buttonSimulatedRef: decrementButton, simulatePointerDown: decrecrementButtonDown, simulatePointerUp: decrecrementButtonUp } = useSimulateButtonEvents();
  const { buttonSimulatedRef: incrementButton, simulatePointerDown: incrementButtonDown, simulatePointerUp: incrementButtonUp } = useSimulateButtonEvents();

  const timeoutRef = React.useRef<number | null>(null);
  const { incrementBpm, decrementBpm } = useMetronomeStore();

  const initializeTimer = (callback: Function, interval: number) => {
    clearTimeout(timeoutRef.current!);
    timeoutRef.current = window.setTimeout(() => {
      callback();
      const newInterval = Math.max(interval - 5, MAXIMUM_SPEED_IN_MILLISECONDS);
      initializeTimer(callback, newInterval);
    }, interval);
  };

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  const handleDecrementMouseDown = () => {
    decrementBpm();
    initializeTimer(decrementBpm, DEFAULT_DELAY_IN_MILLISECONDS,);
  };

  const handleIncrementMouseDown = () => {
    incrementBpm()
    initializeTimer(incrementBpm, DEFAULT_DELAY_IN_MILLISECONDS,);
  };

  const handleMouseUp = () => {
    clearTimer();
  };

  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  React.useEffect(() => {
    keyPress(['ArrowUp', '+'], incrementButtonDown, 'keydown');
    keyPress(['ArrowUp', '+'], incrementButtonUp, 'keyup');
    keyPress(['ArrowDown', '-'], decrecrementButtonDown, 'keydown');
    keyPress(['ArrowDown', '-'], decrecrementButtonUp, 'keyup');
  }, [keyPress])

  return (
    <div className="metronomeControls__container-bpm">
      <Button.Circular
        ref={decrementButton}
        onPointerDown={handleDecrementMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        -
      </Button.Circular>
      {children}
      <Button.Circular
        ref={incrementButton}
        onPointerDown={handleIncrementMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        +
      </Button.Circular>
    </div>
  );
}

