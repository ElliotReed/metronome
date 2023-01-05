import * as React from "react";

import MechanicalMetronome from "../MechanicalMetronome";
import Staff from "../Staff";
import TempoTapper from "../TempoTapper";

import * as Button from "../common/Button";
import Collapsible from "../common/Collapsible";
import MeshContainer from "../common/MeshContainer";

import "./metronome.css";

export default function Metronome() {
  const [bpm, setBpm] = React.useState(100);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [timer, setTimer] = React.useState(null);

  const [beatCount, setBeatCount] = React.useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);

  const [count, setCount] = React.useState(0);
  const [clickLength, setClickLength] = React.useState(1);

  const initializeTimer = (timerInterval) => {
    setTimer(
      setInterval(() => {
        triggerEffects();
      }, timerInterval)
    );
  };

  const updatedBeatCount = (prevBeatCount) =>
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
      const timerInterval = ((60 / bpm) * 1000).toFixed(0);
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

  const handleBpmChange = (event) => {
    const newBPM = event.target.value;
    setBpm(newBPM);

    if (isPlaying) {
      // Stop old timer and start a new one
      clearInterval(timer);
      const timerInterval = ((60 / newBPM) * 1000).toFixed(0);
      initializeTimer(timerInterval);
      // setCount(0);
    }
  };

  return (
    <section className="Metronome">
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
    </section>
  );
}

function MetronomeControls({ bpm, children, setBpm }) {
  const [time, setTime] = React.useState(160);
  const intervalRef = React.useRef(null);

  const handleDecrementMouseDown = () => {
    if (intervalRef.current) return;
    setBpm((bpm) => bpm - 1);
    intervalRef.current = setInterval(() => {
      setBpm((bpm) => bpm - 1);
    }, time);
  };
  const handleIncrementMouseDown = () => {
    if (intervalRef.current) return;
    setBpm((bpm) => bpm + 1);
    intervalRef.current = setInterval(() => {
      setBpm((bpm) => bpm + 1);
    }, time);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => handleMouseUp();
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
