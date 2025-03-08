import * as React from "react";

import { useAudioStore } from "@/store/useAudioStore";

import NoteImage from "./NoteImage";

interface NoteType {
  id: number,
  beatUnit: number,
  beat: number,
}

export default function Note({ id, beatUnit, beat }: NoteType) {
  const [status, setStatus] = React.useState("default");
  const { playAccentSound, playDefaultSound } = useAudioStore();

  let noteClass = `Note ${status} ${beat === id ? "isPlaying" : ""}`;

  const playSound = () => {
    status === "accent" && playAccentSound();
    status === "default" && playDefaultSound();
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