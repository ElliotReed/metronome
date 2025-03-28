import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useMetronomeStore, useAudioStore } from '@/store';
import { useKeyPress, useSimulateButtonEvents } from '@/hooks';

import { NoTranslate, PageHeading } from '@/components/common';
import Button from '../common/Button';

import './tempo-tapper.css';

function convertMillisecondsToSeconds(milliseconds: number) {
  return milliseconds / 1000;
}

export default function TempoTapper() {
  const navigate = useNavigate();
  const { playDefaultSound } = useAudioStore();
  const { setBpm } = useMetronomeStore();
  const keyPress = useKeyPress();
  const { buttonSimulatedRef, simulateClick } = useSimulateButtonEvents();

  const [lastTappedTime, setLastTappedTime] = React.useState<number | null>(null);
  const [tapCount, setTapCount] = React.useState(0);
  const [tempo, setTempo] = React.useState<number | undefined>(undefined);
  const [totalTimeBetweenTaps, setTotalTimeBetweenTaps] = React.useState(0)

  const handleTempoTap = () => {
    playDefaultSound();
    const now = Date.now();

    if (buttonSimulatedRef.current && document.activeElement !== buttonSimulatedRef.current) {
      buttonSimulatedRef.current.focus();
    }

    if (lastTappedTime !== null) {
      const timeDifference = now - lastTappedTime;

      if (tapCount > 0) {
        // Calculate the ratio between current tap interval and average
        const currentAverage = totalTimeBetweenTaps / tapCount;
        const ratio = timeDifference / currentAverage;

        // Reset if the tempo changed drastically (e.g., more than 50% faster or slower)
        const isResetRequired = ratio > 1.5 || ratio < 0.67;

        if (isResetRequired) {
          // Reset - start fresh with the new tempo
          console.log("Resetting due to tempo change:", {
            oldAverage: currentAverage,
            newInterval: timeDifference,
            ratio
          });
          setTapCount(1);
          setTotalTimeBetweenTaps(timeDifference);
        } else {
          // Normal update with some weighted averaging to favor recent taps
          // Limit the number of taps we consider to prevent old tempos from having too much influence
          const maxTapsToConsider = 4;
          const newTapCount = tapCount < maxTapsToConsider ? tapCount + 1 : tapCount;

          // If we've reached the max, remove the contribution of the oldest tap
          const oldestContribution = tapCount >= maxTapsToConsider ?
            (totalTimeBetweenTaps / tapCount) : 0;

          const newTotalTime = tapCount >= maxTapsToConsider ?
            totalTimeBetweenTaps - oldestContribution + timeDifference :
            totalTimeBetweenTaps + timeDifference;

          setTapCount(newTapCount);
          setTotalTimeBetweenTaps(newTotalTime);

          // Directly calculate tempo from the running average
          setTempo(Math.floor(60 / convertMillisecondsToSeconds(newTotalTime / newTapCount)));
        }
      } else {
        // First tap after a reset
        setTapCount(1);
        setTotalTimeBetweenTaps(timeDifference);
      }
    }

    setLastTappedTime(now);
  }

  const handleSetTempoInMetronome = () => {
    if (typeof tempo !== "number") return;
    setBpm(tempo);
    navigate({ to: '/' });
  }

  React.useEffect(() => {
    keyPress(['Space'], simulateClick);
    keyPress(['Enter', 'NumpadEnter'], handleSetTempoInMetronome);
  }, [keyPress]);

  return (
    <div className="tempo-tapper">
      <PageHeading><NoTranslate>Tempo</NoTranslate>{" "}Tapper</PageHeading>

      <div
        className="tempo-tapper-content-container main-layout-grid__centered main-layout-grid"
      >

        <TempoDisplay tempo={tempo} tapCount={tapCount} />

        <Button.Tapper
          ref={buttonSimulatedRef}
          title="Shortcut: Spacebar"
          onClick={handleTempoTap}
        >
          Tap!
        </Button.Tapper>

        <Button.Default
          title="Shortcut: Enter"
          onClick={handleSetTempoInMetronome}>
          Set Tempo In Metronome
        </Button.Default>
      </div>
    </div>
  );
}

function TempoTapperMessage({ tapCount }: { tapCount: number }) {
  let message = "";

  if (tapCount === 0) {
    message = "Tap to start";
  }
  if (tapCount > 0 && tapCount < 2) {
    message = "Keep tapping...";
  }

  const opacity = message == "" ? 0 : 1;

  return (
    <p
      aria-live="polite"
      className="tempo-tapper__message"
      style={{ opacity }}>
      {message}
    </p>
  );
}

const TempoDisplay = (
  { tempo, tapCount }: { tempo: number | undefined, tapCount: number }
) => {
  const normalizedTempoString = tempo !== undefined
    ? String(tempo).padStart(3, '\u00A0')
    : '\u00A0'.repeat(3);

  return (
    <div className="tempo-tapper__tempo-and-message-container">
      <TempoTapperMessage tapCount={tapCount} />
      <div className="tempo-display">
        <span className="tempo-display__label">Tempo: </span>
        <span className="tempo-display__value">{normalizedTempoString}</span>
      </div>
    </div>
  );
}