import * as React from 'react';

import Staff from '@/components/Staff';

import * as Button from '@/components/common/Button';
import MeshContainer from '@/components/common/MeshContainer';

import click from '@/assets/click.wav';
import clickAccent from '@/assets/clickAccent.wav';

import '@/components/Metronome/metronome.css';

import { createFileRoute } from '@tanstack/react-router'

const defaultSound = new Audio(click);
const accentSound = new Audio(clickAccent);

const metronomeStops = [
  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 142, 148, 152, 160, 168, 176, 184, 192, 200, 208
]

export const Route = createFileRoute('/game')({
  component: Game
})

function Game() {
  const [beatCount, setBeatCount] = React.useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const [practiceBPM, setPracticeBPM] = React.useState(0)
  const [pickedStop, setPickedStop] = React.useState<number | undefined>(undefined)
  const [isWinner, setIsWinner] = React.useState(false);
  console.log('component render');

  const initializeTimer = (timerInterval: number) => {
    timeoutRef.current = (
      window.setTimeout(() => {
        triggerEffects();
        initializeTimer(intervalFromBpm(practiceBPM));
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
      const timerInterval = intervalFromBpm(practiceBPM);
      initializeTimer(timerInterval);
      setIsPlaying(true);
    } else {
      // Stop the timer
      clearIfRefCurrentExists();
      setIsPlaying(false);
      setBeatCount(0);
    }
  }, [isPlaying, practiceBPM]);

  React.useEffect(() => {
    if (!isPlaying) return;

    clearIfRefCurrentExists();

    initializeTimer(intervalFromBpm(practiceBPM));

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

    if (elapsedTimeRef.current >= intervalFromBpm(practiceBPM)) {

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


    </div >
  );
}

function intervalFromBpm(bpm: number) {
  return Math.floor((60 / bpm) * 1000);
}