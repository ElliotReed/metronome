import * as React from "react";

import BpmIncreaseOrDecrease from "./BpmIncreaseOrDecrease";
import Staff from "../Staff";
import TempoTapper from "../TempoTapper";

import * as Button from "../common/Button";
import Collapsible from "../common/Collapsible";
import MeshContainer from "../common/MeshContainer";

import click from "../../assets/click.wav";
import clickAccent from "../../assets/clickAccent.wav";

import getIntervalFromBpm from "@/utils/getBpmFromInterval";

import "./metronome.css";

const defaultSound = new Audio(click);
const accentSound = new Audio(clickAccent);

export default function Metronome() {
  const [bpm, setBpm] = React.useState(100);
  const [beatCount, setBeatCount] = React.useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);
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

  return (
    <div className="Metronome">
      <Staff
        defaultSound={defaultSound}
        accentSound={accentSound}
        beatCount={beatCount}
        beatsPerMeasure={beatsPerMeasure}
        setBeatsPerMeasure={setBeatsPerMeasure}
      />

      <MetronomeControls>
        <BpmIncreaseOrDecrease
          setBpm={setBpm}
        >
          <BpmDisplay bpm={bpm} />
        </BpmIncreaseOrDecrease>

        <Button.Default onClick={startStop}>
          {isPlaying ? "Stop" : "Start"}
        </Button.Default>
        <Collapsible
          shouldExpand={false}
          title={"Tempo Tapper"}
          titleColor="dark"
        >
          <TempoTapper setBpm={setBpm} />
        </Collapsible>
      </MetronomeControls>
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

function BpmDisplay({ bpm }: Readonly<{ bpm: number }>) {
  return (
    <MeshContainer size="stretch">
      <div className="bpm-display">{bpm}</div>
    </MeshContainer>
  )
}
