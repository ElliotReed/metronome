import * as React from "react";

import BpmIncreaseOrDecrease from "./BpmIncreaseOrDecrease";
import Staff from "../Staff";
import TempoTapper from "../TempoTapper";

import * as Button from "../common/Button";
import Collapsible from "../common/Collapsible";
import MeshContainer from "../common/MeshContainer";

import drumstickSound from "/assets/drumstick.wav";
import drumstickAccentSound from "/assets/drumstick-accent.wav";

import getIntervalFromBpm from "@/utils/getBpmFromInterval";
import createLocalStorageService from '@/services/localStorageService';

import "./metronome.css";

const METRONOME_STORAGE_KEY = 'metronome_state';

const defaultSound = new Audio(drumstickSound);
const accentSound = new Audio(drumstickAccentSound);

type MetronomeStorageData = {
  bpm: number;
  beatsPerMeasure: number;
}

const metronomeStateStorage = createLocalStorageService(METRONOME_STORAGE_KEY);

const initialMetronomeState = () => {
  const storedState: MetronomeStorageData = metronomeStateStorage.get();
  return {
    bpm: storedState?.bpm ?? 120,
    beatsPerMeasure: storedState?.beatsPerMeasure ?? 4
  };
};

const storeMetronomeState = (bpm: number, beatsPerMeasure: number) => {
  const dataToStore = { bpm, beatsPerMeasure };
  metronomeStateStorage.set(dataToStore);
};

export default function Metronome() {
  const [bpm, setBpm] = React.useState(() => initialMetronomeState().bpm);
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(() => initialMetronomeState().beatsPerMeasure);
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
    storeMetronomeState(bpm, beatsPerMeasure);
  }, [bpm, beatsPerMeasure]);

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
