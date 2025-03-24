import * as React from 'react';

import { useMetronomeStore } from '@/store';
import { useKeyPress, useSimulateButtonPress } from '@/hooks';

import * as Buttons from '../common/Button';
import { useSimulateButtonEvents } from '@/hooks/useSimulateButtonEvents';

const DEFAULT_DELAY_IN_MILLISECONDS = 160;
const MAXIMUM_SPEED_IN_MILLISECONDS = 25;

export default function BpmIncreaseOrDecrease(
  { children }: { children: React.ReactNode }
) {
  const keyPress = useKeyPress();
  const { buttonRef, simulatePointerDown, simulatePointerUp } = useSimulateButtonEvents();
  const { simulatedButtonRef: decrementRef, simulateButtonPress } = useSimulateButtonPress();
  const { simulatedButtonRef: incrementRef, simulateButtonPress: simulateIncrementButtonPress } = useSimulateButtonPress();
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
      console.log('here');
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
    keyPress(['ArrowUp', '+'], handleIncrementMouseDown, 'keydown');
    keyPress(['ArrowUp', '+'], handleMouseUp, 'keyup');
    keyPress(['ArrowDown', '-'], handleDecrementMouseDown, 'keydown');
    keyPress(['ArrowDown', '-'], handleMouseUp, 'keyup');
  }, [keyPress])

  return (
    <div className="metronomeControls__container-bpm">
      <Buttons.Circular
        // ref={decrementRef}
        onPointerDown={handleDecrementMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        -
      </Buttons.Circular>
      {children}
      <Buttons.Circular
        ref={buttonRef}
        onPointerDown={handleIncrementMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        +
      </Buttons.Circular>
    </div>
  );
}

