import * as React from "react";

import { useMetronomeStore } from '@/store';
import { useKeyPress, useSimulateButtonEvents, useTimer } from '@/hooks';

import BpmIncreaseOrDecrease from "./BpmIncreaseOrDecrease";

import Staff from "@/components/Staff";
import Button from "@/components/common/Button";
import { MeshContainer, PageHeading } from "@/components/common";

import "./metronome.css";

export default function Metronome() {
  const keyPress = useKeyPress();
  const { bpm, beatCount, incrementBeatCount, resetBeatCount } = useMetronomeStore();
  const { buttonSimulatedRef, simulateClick } = useSimulateButtonEvents();
  const timer = useTimer();

  const [isPlaying, setIsPlaying] = React.useState(false);

  const startStop = React.useCallback(() => {
    if (!isPlaying) {
      timer.start(bpm);
      setIsPlaying(true);
    } else {
      timer.stop();
      setIsPlaying(false);
      resetBeatCount();
    }
  }, [isPlaying, bpm]);

  React.useEffect(() => {
    timer.subscribe(incrementBeatCount);
  }, []);

  React.useEffect(() => {
    timer.update(bpm);
  }, [bpm]);

  React.useEffect(() => {
    keyPress('Space', simulateClick);
  }, [keyPress])

  return (
    <div className="metronome">
      <PageHeading>Metronome</PageHeading>

      <div className="display main-layout-grid__centered">
        <Staff />

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
