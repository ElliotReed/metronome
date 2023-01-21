import * as React from "react";

import "./mechanicalMetronome.css";

interface Props {
  bpm: number,
  clickLength: number,
  onChange: () => void,
}

export default function MechanicalMetronome({ bpm, clickLength, onChange }: Props) {
  const [degrees, setDegrees] = React.useState(270);
  const [pointerEvents, setPointerEvents] = React.useState("all");


  let swingAnimation: React.CSSProperties = {
    transform: `rotateZ(${degrees}deg)`,
    transitionDuration: `${clickLength}ms`,
    pointerEvents: `${pointerEvents}` as any,
  };

  const stopPendulum = () => {
    setDegrees(270);
    setPointerEvents("all");
    // clickLength: (state.clickLength / 2)
  };

  const swingPendulum = () => {
    const initialPosition = degrees;
    const centerDegrees = 270;
    const swingAmount = 45;

    if (initialPosition <= centerDegrees) {
      setDegrees(centerDegrees + swingAmount);
      setPointerEvents("none");
    }
    if (initialPosition > centerDegrees) {
      setDegrees(centerDegrees - swingAmount);
      setPointerEvents("none");
    }
  };

  return (
    <div className="mechanicalMetronome">
      <div className="metronome__body-faceplate" />
      <div className="pendulum" style={swingAnimation}>
        <div className="pendulum__bottom">
          <div className="pendulum__weight" />
        </div>
        <input
          tabIndex={0}
          className="pendulum__top"
          type="range"
          min="40"
          max="320"
          value={bpm}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
