import * as React from 'react';

import { useAudioStore } from '@/store/useAudioStore';
import { useTempoTrainerStore } from '@/store/useTempoTrainerStore';
import { timerInstance } from '@/utils/timerEngine';

import * as Button from '@/components/common/Button';
import MeshContainer from '@/components/common/MeshContainer';

import metronomeStops from '@/utils/metronomeStops';

import './tempo-trainer.css';
import PageHeading from '../common/PageHeading';

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

const largoStops = metronomeStops.filter(stop => stop >= LARGO_START && stop <= LARGO_END);
const andanteStops = metronomeStops.filter(stop => stop >= ANDANTE_START && stop <= ANDANTE_END);
const moderatoStops = metronomeStops.filter(stop => stop >= MODERATO_START && stop <= MODERATO_END);
const allegroStops = metronomeStops.filter(stop => stop >= ALLEGRO_START && stop <= ALLEGRO_END);
const prestoStops = metronomeStops.filter(stop => stop >= PRESTO_START && stop <= PRESTO_END);

export default function TempoTrainer() {
  const { playDefaultSound } = useAudioStore();
  const { wins, incrementWins, losses, incrementLosses, getLevelString } = useTempoTrainerStore();

  const [bpm, setBpm] = React.useState(0)
  const [pickedStop, setPickedStop] = React.useState<number | undefined>(undefined)
  const [isWinner, setIsWinner] = React.useState(false);
  const [isNewAttempt, setIsNewAttempt] = React.useState(false);

  function handleTrainingStart() {
    setIsNewAttempt(true);
    setPickedStop(undefined);
    setIsWinner(false);
    const randomStopIndex = Math.floor(Math.random() * metronomeStops.length);
    const newBPM = metronomeStops[randomStopIndex];
    setBpm(newBPM);
    timerInstance.updateBPM(newBPM);
    timerInstance.start();
  }

  const handleTempoPick = (stop: number | undefined) => {
    timerInstance.stop();
    setIsNewAttempt(false);
    if (stop === undefined) return;
    const offset = 10;
    setPickedStop(stop);
    if (stop === bpm || (stop >= bpm - offset && stop <= bpm + offset)) {
      setIsWinner(true);
      incrementWins();
    } else {
      setIsWinner(false);
      incrementLosses();
    }
  };

  const handleTick = () => {
    playDefaultSound();
    console.log('tick');
  }

  // TODO Define the button in Buttons.tsx
  const getTempoStopGroupListItems = (metronomeStops: number[]) => {
    return metronomeStops.map(stop => (
      <li key={stop}>
        <button
          className="metronome-stop-button"
          onClick={() => isNewAttempt && handleTempoPick(stop)}
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
    <div className="tempo-trainer main-layout-grid">
      <PageHeading>Tempo Trainer</PageHeading>

      <div className="info-box user">
        <dl className="level">
          <dt>Level:</dt>
          <dd>{getLevelString()}</dd>
        </dl>

        <dl className="score">
          <dt>Wins:</dt>
          <dd>{wins}</dd>
          <dt>Losses:</dt>
          <dd>{losses}</dd>
        </dl>
      </div>

      <div className="info-box status">
        <dl className="answers">
          <dt>Actual:</dt>
          <dd>{pickedStop !== undefined ? bpm : '?'}</dd>
          <dt>Picked:</dt>
          <dd>{pickedStop ?? '?'}</dd>
        </dl>

        <p className="message">
          {pickedStop == undefined && '?        '}
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
        onClick={handleTrainingStart}>
        Play?
      </Button.Default>
    </div>
  );
}