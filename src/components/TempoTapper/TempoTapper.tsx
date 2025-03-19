import * as React from "react";
import { useNavigate } from '@tanstack/react-router';

import useMetronomeStore from '@/store/useMetronomeStore';

import * as Button from "../common/Button";
import PageHeading from '../common/PageHeading';

import "./tempo-tapper.css";

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
  const navigate = useNavigate();
  const { setBpm } = useMetronomeStore();
  const [taps, setTaps] = React.useState<Date[]>([]);
  const [tempo, setTempo] = React.useState<number | undefined>(undefined);

  const handleTempoTap = () => {
    const MAX_LENGTH = 6;
    const newTapDate = new Date();
    const updatedTaps: Date[] = [
      ...taps,
      newTapDate
    ];

    // not enough taps to calculate tempo
    if (updatedTaps.length < 2) {
      setTaps(updatedTaps);
      return;
    }

    if (updatedTaps.length > MAX_LENGTH) {
      updatedTaps.shift();
    }

    if (wasDelayed(updatedTaps)) {
      // reset taps to last tap
      setTaps([updatedTaps[updatedTaps.length - 1]]);
      return
    }

    setTaps(updatedTaps);
    const newTempo = calculteBeatsPerMinute(updatedTaps);
    setTempo(newTempo);
  };

  const handleSetTempoInMetronome = () => {
    if (typeof tempo !== "number") return;
    setBpm(tempo);
    navigate({ to: '/' });
  }

  return (
    <div className="tempo-tapper">
      <PageHeading>Tempo Tapper</PageHeading>

      <div
        className="tempo-tapper-content-container main-layout-grid__centered main-layout-grid"
      >

        <div className="tempo-tapper__tempo-and-message-container">

          {
            tempo ? <TempoDisplay tempo={tempo} />
              : <TempoTapperMessage taps={taps} />
          }
        </div>

        <Button.Tapper
          title="Provide at least 6 newTaps for greater accuracy!"
          onClick={handleTempoTap}>
          Tap!
        </Button.Tapper>

        <Button.Default
          onClick={handleSetTempoInMetronome}>
          Set Tempo In Metronome
        </Button.Default>
      </div>
    </div>
  );
}

function TempoTapperMessage({ taps }: { taps: Date[] }) {
  let message = "";

  if (taps.length === 0) {
    message = "Tap to start";
  }
  if (taps.length > 0 && taps.length < 2) {
    message = "Keep tapping...";
  }

  return (
    <p className="tempo-tapper__message">{message}</p>
  );
}

const TempoDisplay = ({ tempo }: { tempo: number | undefined }) => (
  <p className="tempo-display">
    <span className='tempo-display__label'>Tempo: </span>
    <span className='tempo-display__value'>{tempo}</span>
  </p>
);
