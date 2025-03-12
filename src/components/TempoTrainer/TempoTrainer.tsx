import * as React from 'react';

import { useAudioStore } from '@/store/useAudioStore';
import { timerInstance } from '@/utils/timerEngine';

import * as Button from '@/components/common/Button';
import MeshContainer from '@/components/common/MeshContainer';

import metronomeStops from '@/utils/metronomeStops';

import './tempo-trainer.css';

const LARGO_START = 40;
const LARGO_END = 72;
const ANDANTE_START = 76;
const ANDANTE_END = 96;
const MODERATO_START = 100;
const MODERATO_END = 116;
const ALLEGRO_START = 120;
const ALLEGRO_END = 160;
const PRESTO_START = 168;
const PRESTO_END = 208;

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


  const largoStops = metronomeStops.filter(stop => stop >= LARGO_START && stop <= LARGO_END);
  const andanteStops = metronomeStops.filter(stop => stop >= ANDANTE_START && stop <= ANDANTE_END);
  const moderatoStops = metronomeStops.filter(stop => stop >= MODERATO_START && stop <= MODERATO_END);
  const allegroStops = metronomeStops.filter(stop => stop >= ALLEGRO_START && stop <= ALLEGRO_END);
  const prestoStops = metronomeStops.filter(stop => stop >= PRESTO_START && stop <= PRESTO_END);

  // TODO Define the button in Buttons.tsx
  const getTempoStopGroupListItems = (metronomeStops: number[]) => {
    return metronomeStops.map(stop => (
      <li key={stop}>
        <button
          className="metronome-stop-button"
          onClick={() => handleTempoPick(stop)}
        >{stop}
        </button>
      </li>
    ));
  }

  const getRangeGroup = (stops: number[], title: string) => {
    return (
      <div className="range-group">
        <h3>{title}</h3>
        <ul className="choices">
          {getTempoStopGroupListItems(stops)}
        </ul>
      </div>
    )
  }

  React.useEffect(() => {
    document.addEventListener('metronome:tick', handleTick as EventListener);

    return () => {
      document.removeEventListener('metronome:tick', handleTick as EventListener)
    };
  }, [])

  return (
    <div className="tempo-trainer">
      <div className="status">
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
      </div>
      <MeshContainer>
        {getRangeGroup(largoStops, 'largo')}
        {getRangeGroup(andanteStops, 'andante')}
        {getRangeGroup(moderatoStops, 'moderato')}
        {getRangeGroup(allegroStops, 'allegro')}
        {getRangeGroup(prestoStops, 'presto')}
      </MeshContainer>
      <Button.Default
        onClick={handlePracticeStart}>
        Play?
      </Button.Default>
    </div>
  );
}