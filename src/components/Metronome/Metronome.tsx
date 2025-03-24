import * as React from "react";

import { useMetronomeStore } from '@/store';
import { useKeyPress, useSimulateButtonEvents } from '@/hooks';

import BpmIncreaseOrDecrease from "./BpmIncreaseOrDecrease";
import getIntervalFromBpm from "@/utils/getBpmFromInterval";

import Staff from "@/components/Staff";
import Button from "@/components/common/Button";
import MeshContainer from "@/components/common/MeshContainer";
import PageHeading from '../common/PageHeading';

import "./metronome.css";

export default function Metronome() {
  const { bpm, beatsPerMeasure } = useMetronomeStore();
  const keyPress = useKeyPress();
  const { buttonSimulatedRef, simulateClick } = useSimulateButtonEvents();

  const [beatCount, setBeatCount] = React.useState(0);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const initializeTimer = (timerInterval: number) => {
    timeoutRef.current = (
      window.setTimeout(() => {
        triggerEffects();
        initializeTimer(getIntervalFromBpm(bpm));
      }, timerInterval)
    );
  };

  const updatedBeatCount = (prevBeatCount: number) =>
    prevBeatCount < beatsPerMeasure ? prevBeatCount + 1 : 1;

  const triggerEffects = () => {
    setBeatCount(updatedBeatCount);
  };

  const clearIfRefCurrentExists = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startStop = React.useCallback(() => {
    if (!isPlaying) {
      // Start a timer with the current BPM
      const timerInterval = getIntervalFromBpm(bpm);
      initializeTimer(timerInterval);
      setIsPlaying(true);
    } else {
      // Stop the timer
      clearIfRefCurrentExists();
      setIsPlaying(false);
      setBeatCount(0);
    }
  }, [isPlaying, bpm]);

  React.useEffect(() => {
    if (!isPlaying) return;

    clearIfRefCurrentExists();

    initializeTimer(getIntervalFromBpm(bpm));

    return () => {
      clearIfRefCurrentExists();
    };
  });

  React.useEffect(() => {
    keyPress('Space', simulateClick);
  }, [keyPress])

  return (
    <div className="metronome">
      <PageHeading>Metronome</PageHeading>

      <div className="display main-layout-grid__centered">
        <Staff beatCount={beatCount} />

        <MetronomeControls>
          <BpmIncreaseOrDecrease>
            <BpmDisplay />
          </BpmIncreaseOrDecrease>

          <Button.Default onClick={startStop} ref={buttonSimulatedRef}>
            {isPlaying ? "Stop" : "Start"}
          </Button.Default>
        </MetronomeControls>
      </div>
    </div >
  );
}

function MetronomeControls({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <div className="MetronomeControls">
      {children}
    </div>
  );
}

function BpmDisplay() {
  const { bpm } = useMetronomeStore();
  return (
    <MeshContainer>
      <div className="bpm-display">{bpm}</div>
    </MeshContainer>
  )
}
