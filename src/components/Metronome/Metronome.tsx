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

  const [isPracticeMode, setIsPracticeMode] = React.useState(false)
  const [practiceBPM, setPracticeBPM] = React.useState(0)
  const [pickedStop, setPickedStop] = React.useState<number | undefined>(undefined)
  const [isWinner, setIsWinner] = React.useState(false);

  const initializeTimer = (timerInterval: number) => {
    timeoutRef.current = (
      window.setTimeout(() => {
        triggerEffects();
        initializeTimer(intervalFromBpm(isPracticeMode ? practiceBPM : bpm));
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
      const timerInterval = intervalFromBpm(isPracticeMode ? practiceBPM : bpm);
      initializeTimer(timerInterval);
      setIsPlaying(true);
    } else {
      // Stop the timer
      clearIfRefCurrentExists();
      setIsPlaying(false);
      setBeatCount(0);
    }
  }, [isPlaying, isPracticeMode, practiceBPM, bpm]);

  React.useEffect(() => {
    if (!isPlaying) return;

    clearIfRefCurrentExists();

    initializeTimer(intervalFromBpm(isPracticeMode ? practiceBPM : bpm));

    return () => {
      clearIfRefCurrentExists();
    };
  });

  function handlePracticeStart() {
    setPickedStop(undefined)
    setIsWinner(false)
    const randomStopIndex = Math.floor(Math.random() * metronomeStops.length)
    setPracticeBPM(() => metronomeStops[randomStopIndex])
    startStop()
  }

  const handleTempoPick = React.useCallback((stop: number | undefined) => {
    if (stop === undefined) return;

    const offset = 10;
    setPickedStop(stop);
    startStop(); // Ensure startStop is being called correctly
    if (stop === practiceBPM || (stop >= practiceBPM - offset && stop <= practiceBPM + offset)) {
      setIsWinner(true);
    } else {
      setIsWinner(false);
    }
  }, [startStop, practiceBPM]);


  return (
    <div className="Metronome">
      <Button.Default
        onClick={() => {
          isPlaying && startStop()
          setIsPracticeMode(!isPracticeMode)
        }}>
        {isPracticeMode ? 'Exit Practice Mode' : 'Practice Mode'}
      </Button.Default>
      <Staff
        defaultSound={defaultSound}
        accentSound={accentSound}
        beatCount={beatCount}
        beatsPerMeasure={beatsPerMeasure}
        setBeatsPerMeasure={setBeatsPerMeasure}
      />

      {
        isPracticeMode
          ? (
            <div className="practice-mode">
              <Button.Default
                onClick={() => handlePracticeStart()}>
                Play?
              </Button.Default>

              <MeshContainer>
                <p>
                  Actual: {pickedStop !== undefined ? practiceBPM : '?'}
                  {' - '}
                  Your pick: {pickedStop ?? '?'}
                </p>
                <p>
                  {pickedStop == undefined && 'Status: ?'}
                  {pickedStop !== undefined && isWinner && 'You win!'}
                  {pickedStop !== undefined && !isWinner && 'Nice try...'}
                </p>
              </MeshContainer>
              <ul className="choices">
                {metronomeStops.map(stop => (
                  <li key={stop}>
                    <button
                      onClick={() => handleTempoPick(stop)}
                    >{stop}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
          : (<MetronomeControls>
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
          )
      }
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
  return Math.round((60 / bpm) * 1000);
}
