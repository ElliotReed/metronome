import * as React from "react";
import useMetronomeStore from '@/store/useMetronomeStore';

import * as Button from "../common/Button";

import "./tempoTapper.css";

function convertToSeconds(milliseconds: number) {
  return milliseconds / 1000;
}

function wasDelayed(taps: Date[]) {
  const lastTap: any = taps[taps.length - 1];
  const nextToLastTap: any = taps[taps.length - 2]
  const differenceInMilliseconds = lastTap - nextToLastTap;

  return convertToSeconds(differenceInMilliseconds) > 3;
}

export const calculteBeatsPerMinute = (taps: any) => {
  const length = taps.length;
  const totalTime = taps[length - 1] - taps[0];
  const seconds = totalTime / 1000;
  const beat = seconds / length;
  const bpm = Math.floor(60 / beat);

  return bpm;
};

export default function TempoTapper() {
  const { setBpm } = useMetronomeStore();
  const [taps,
    setTaps] = React.useState<Date[]>([]);
  const [tempo,
    setTempo] = React.useState<number | string>("tap button to start");

  const handleTempoTap = () => {
    const TAP_MESSAGE = 'keep tapping';
    const MAX_LENGTH = 6;
    const newTapDate = new Date();
    const updatedTaps: Date[] = [
      ...taps,
      newTapDate
    ];

    // not enough taps to calculate tempo
    if (updatedTaps.length < 2) {
      setTaps(updatedTaps);
      setTempo(TAP_MESSAGE);
      return;
    }

    if (updatedTaps.length > MAX_LENGTH) {
      updatedTaps.shift();
    }

    if (wasDelayed(updatedTaps)) {
      // reset taps to last tap
      setTaps([updatedTaps[updatedTaps.length - 1]]);
      setTempo(TAP_MESSAGE);
      return
    }

    setTaps(updatedTaps);
    const newTempo = calculteBeatsPerMinute(updatedTaps);
    setTempo(newTempo);
  };

  return (
    <div className="tapper">
      <div className="tapper__display">
        <h2 className="tapper__heading">Tempo</h2>
        <p className="tapper__tempo">{tempo}</p>
        <Button.Default
          onClick={() => {
            typeof tempo !== "number"
              ? setBpm(100)
              : setBpm(tempo);
          }}>
          Set BPM
        </Button.Default>
      </div>
      <Button.Tapper
        title="Provide at least 6 newTaps for greater accuracy!"
        onClick={handleTempoTap}>
        Tap!
      </Button.Tapper>
    </div>
  );
}
