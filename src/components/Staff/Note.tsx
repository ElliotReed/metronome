import * as React from "react";

import NoteImage from "./NoteImage";

import { useAudioEngine } from '@/context/AudioContext';

interface NoteType {
  id: number,
  beatUnit: number,
  beat: number,
  defaultSound: HTMLAudioElement,
  accentSound: HTMLAudioElement,
}

export default function Note({ id, beatUnit, beat, defaultSound, accentSound }: NoteType) {
  const [status, setStatus] = React.useState("default");
  const audioEngine = useAudioEngine();

  let noteClass = `Note ${status} ${beat === id ? "isPlaying" : ""}`;

  // const playSound = () => {
  //   status === "accent" && accentSound.play();
  //   status === "default" && defaultSound.play();
  // };
  const playSound = () => {
    status === "accent" && audioEngine.playAccentSound();
    status === "default" && audioEngine.playDefaultSound();
  };

  const handleBeatEvent = (beat: number) => {
    if (beat === id) {
      // start animation , animation end to remove
      playSound();
    }
  };

  const handleStatus = () => {
    const newStatus =
      status === "accent"
        ? "mute"
        : status === "default"
          ? "accent"
          : "default";
    setStatus(newStatus);
  };

  React.useEffect(() => {
    handleBeatEvent(beat);
  }, [beat]);

  return (
    id ? (
      <li className={noteClass} onClick={handleStatus}>
        <NoteImage status={status} beatUnit={beatUnit} />
      </li>
    ) : null
  );
}