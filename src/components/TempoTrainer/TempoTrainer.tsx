import * as React from 'react';

import { useAudioStore } from '@/store/useAudioStore';
import { timerInstance } from '@/utils/timerEngine';

import * as Button from '@/components/common/Button';
import MeshContainer from '@/components/common/MeshContainer';

import metronomeStops from '@/utils/metronomeStops';

import './tempo-trainer.css';

export default function TempoTrainer() {
  const { playDefaultSound } = useAudioStore();

  const [bpm, setBpm] = React.useState(0)
  const [pickedStop, setPickedStop] = React.useState<number | undefined>(undefined)
  const [isWinner, setIsWinner] = React.useState(false);

  function handlePracticeStart() {
    setPickedStop(undefined)
    setIsWinner(false)
    const randomStopIndex = Math.floor(Math.random() * metronomeStops.length)
    const newBPM = metronomeStops[randomStopIndex];
    setBpm(newBPM);
    timerInstance.updateBPM(newBPM);
    timerInstance.start();
  }

  const handleTempoPick = (stop: number | undefined) => {
    timerInstance.stop();
    if (stop === undefined) return;
    const offset = 10;
    setPickedStop(stop);
    if (stop === bpm || (stop >= bpm - offset && stop <= bpm + offset)) {
      setIsWinner(true);
    } else {
      setIsWinner(false);
    }
  };

  const handleTick = () => {
    playDefaultSound();
    console.log('tick');
  }

  React.useEffect(() => {
    document.addEventListener('metronome:tick', handleTick as EventListener);

    return () => {
      document.removeEventListener('metronome:tick', handleTick as EventListener)
    };
  }, [])

  return (
    <div className="practice-mode">
      <Button.Default
        onClick={handlePracticeStart}>
        Play?
      </Button.Default>

      <MeshContainer>
        <p>
          Actual: {pickedStop !== undefined ? bpm : '?'}
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
  );
}