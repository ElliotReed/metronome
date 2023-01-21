import * as React from "react";

// import MechanicalMetronome from "../MechanicalMetronome";
import Staff from "../Staff";
import TempoTapper from "../TempoTapper";

import * as Button from "../common/Button";
import Collapsible from "../common/Collapsible";
import MeshContainer from "../common/MeshContainer";

import "./metronome.css";

function intervalFromBpm(bpm: number) {
  return Math.round((60 / bpm) * 1000);
}

export default function Metronome() {
  const [bpm, setBpm] = React.useState(100);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [timer, setTimer] = React.useState<number>();

  const [beatCount, setBeatCount] = React.useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);

  // for mechanical metronome NOT IMPLEMENTED
  // const [count, setCount] = React.useState(0);
  // const [clickLength, setClickLength] = React.useState(1);

  const initializeTimer = (timerInterval: number) => {
    setTimer(
      window.setTimeout(() => {
        triggerEffects();
        initializeTimer(intervalFromBpm(bpm))
      }, timerInterval)
    );
  };

  const updatedBeatCount = (prevBeatCount: number) =>
    prevBeatCount < beatsPerMeasure ? prevBeatCount + 1 : 1;

  const triggerEffects = () => {
    // The first beat will have a different sound than the others
    // Track the beat
    setBeatCount(updatedBeatCount);
    // setCount((count + 1) % beatsPerMeasure);
  };



  const startStop = () => {
    if (!isPlaying) {
      // Start a timer with the current BPM
      const timerInterval = intervalFromBpm(bpm);
      initializeTimer(timerInterval);
      setIsPlaying(true);
    } else {
      // Stop the timer
      clearInterval(timer);
      setIsPlaying(false);
      setBeatCount(0);
      // stopPendulum()
    }
    // setCount(0);
    // clickLength
    // playClick();
    // swingPendulum();
  };

  // for Mechanical Metronome handles range input change
  // const handleBpmChange = () => {
  //   const newBPM = Number(event.target.value);
  //   setBpm(newBPM);

  //   if (isPlaying) {
  //     // Stop old timer and start a new one
  //     clearInterval(timer);
  //     const timerInterval = Math.floor((60 / newBPM) * 1000);
  //     initializeTimer(timerInterval);
  //     // setCount(0);
  //   }
  // };

  React.useEffect(() => {
    if (!isPlaying) return;

    clearInterval(timer);
    const newInterval = intervalFromBpm(bpm);
    initializeTimer(newInterval);
  }, [bpm])

  return (
    <div className="Metronome">
      {/* <MechanicalMetronome
          bpm={bpm}
          clickLength={clickLength}
          onChange={handleBpmChange}
        /> */}
      <Staff
        beatCount={beatCount}
        beatsPerMeasure={beatsPerMeasure}
        setBeatsPerMeasure={setBeatsPerMeasure}
      />
      <MetronomeControls bpm={bpm} setBpm={setBpm}>
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
    </div>
  );
}

interface IMetronomeControls {
  bpm: number,
  children: any,
  setBpm: Function,
}
function MetronomeControls({ bpm, children, setBpm }: IMetronomeControls) {
  const DEFAULT_DELAY_IN_MILLISECONDS = 160;
  const timeoutRef = React.useRef<number | null>(null);
  const incrementBpm = () => setBpm((bpm: number) => bpm + 1);
  const decrementBpm = () => setBpm((bpm: number) => bpm - 1);
  const initializeTimer = (callback: Function, interval: number,) => {
    const MAXIMUM_SPEED_IN_MILLISECONDS = 25;
    timeoutRef.current = (
      window.setTimeout(() => {
        callback();
        let newInterval = interval;
        if (interval > MAXIMUM_SPEED_IN_MILLISECONDS) {
          newInterval = interval - 5;
        }

        initializeTimer(callback, newInterval,)
      }, interval)
    );
  };
  const handleDecrementMouseDown = () => {
    decrementBpm()
    initializeTimer(decrementBpm, DEFAULT_DELAY_IN_MILLISECONDS,);
  };

  const handleIncrementMouseDown = () => {
    incrementBpm()
    initializeTimer(incrementBpm, DEFAULT_DELAY_IN_MILLISECONDS,);
  };

  const handleMouseUp = () => {
    window.clearTimeout(timeoutRef.current);
    // if (intervalRef.current) {
    //   clearInterval(intervalRef.current);
    //   intervalRef.current = null;
    // }
  };

  React.useEffect(() => {
    console.log('controls rendered')
  });

  React.useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="MetronomeControls">
      <div className="metronomeControls__container-bpm">
        <Button.Circular
          onPointerDown={handleDecrementMouseDown}
          onPointerUp={handleMouseUp}
          onPointerLeave={handleMouseUp}
        >
          -
        </Button.Circular>
        <MeshContainer size="stretch">
          <div className="bpm-display">{bpm}</div>
        </MeshContainer>
        <Button.Circular
          onPointerDown={handleIncrementMouseDown}
          onPointerUp={handleMouseUp}
          onPointerLeave={handleMouseUp}
        >
          +
        </Button.Circular>
      </div>
      {children}
    </div>
  );
}
