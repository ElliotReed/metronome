import * as React from "react";

import BpmIncreaseOrDecrease from "./BpmIncreaseOrDecrease";
import Staff from "../Staff";
import TempoTapper from "../TempoTapper";

import * as Button from "../common/Button";
import Collapsible from "../common/Collapsible";
import MeshContainer from "../common/MeshContainer";

import click from "../../assets/click.wav";
import clickAccent from "../../assets/clickAccent.wav";

import "./metronome.css";

const defaultSound = new Audio(click);
const accentSound = new Audio(clickAccent);

const metronomeStops = [
  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 142, 148, 152, 160, 168, 176, 184, 192, 200, 208
]

export default function Metronome() {
  const [bpm, setBpm] = React.useState(100);
  const [beatCount, setBeatCount] = React.useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  console.log('component render');

  const initializeTimer = (timerInterval: number) => {
    timeoutRef.current = (
      window.setTimeout(() => {
        triggerEffects();
        initializeTimer(intervalFromBpm(bpm));
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
      const timerInterval = intervalFromBpm(bpm);
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

    initializeTimer(intervalFromBpm(bpm));

    return () => {
      clearIfRefCurrentExists();
    };
  });

  // raf timer
  const frameIdRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef(0);
  const elapsedTimeRef = React.useRef(0);

  function beatTick(timestamp: number) {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const timeDelta = timestamp - startTimeRef.current;
    elapsedTimeRef.current += timeDelta;

    if (elapsedTimeRef.current >= intervalFromBpm(bpm)) {

      console.log('tick');
      elapsedTimeRef.current = 0;
    }

    startTimeRef.current = timestamp;
    frameIdRef.current = requestAnimationFrame(beatTick);

  }

  // frameIdRef.current = requestAnimationFrame(beatTick);
  // raf timer end

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

function intervalFromBpm(bpm: number) {
  return Math.floor((60 / bpm) * 1000);
}
