import * as React from "react";

import * as Button from "../common/Button";
import Heading from "../common/Heading";

import "./tempoTapper.css";

export const calculteBeatsPerMinute = (taps, setTaps) => {
  const length = taps.length;
  if (length <= 1) {
    return "keep tapping!";
  } else {
    const totalTime = taps[length - 1] - taps[0];
    const seconds = totalTime / 1000;
    const beat = seconds / length;
    const bpm = Math.floor(60 / beat);

    if ((taps[length - 1] - taps[length - 2]) / 1000 > 3) {
      setTaps([taps[length - 1]]);
      return "keep tapping!";
    }
    return bpm;
  }
};

export default function TempoTapper({ setBpm }) {
  const [taps, setTaps] = React.useState([]);
  const [tempo, setTempo] = React.useState("tap button to start");

  const handleTempoTap = () => {
    const now = new Date();
    const newTaps = [...taps, now];
    setTaps((prev) => [...prev, now]);

    if (taps.length > 6) {
      newTaps.shift();
      setTaps(newTaps);
    }

    const newTempo = calculteBeatsPerMinute(newTaps, setTaps);
    setTempo(newTempo);
  };

  return (
    <section className="tapper noise-light">
      <main>
        <div className="tapper__display">
          <h3>Tempo</h3>
          <p>{tempo}</p>
          <Button.Default
            onClick={() => {
              typeof tempo !== "number" ? setBpm(100) : setBpm(tempo);
            }}
          >
            Set BPM
          </Button.Default>
        </div>
        <Button.Tapper
          title="Provide at least 6 taps for greater accuracy!"
          onClick={handleTempoTap}
        >
          Tap!
        </Button.Tapper>
      </main>
    </section>
  );
}
