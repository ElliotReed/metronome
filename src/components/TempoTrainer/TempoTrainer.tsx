import * as React from 'react';

import { useAudioStore } from '@/store/useAudioStore';
import { useTempoTrainerStore } from '@/store/useTempoTrainerStore';
import { timerInstance } from '@/utils/timerEngine';

import * as Button from '@/components/common/Button';
import PageHeading from '../common/PageHeading';

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

const largoStops = metronomeStops.filter(stop => stop >= LARGO_START && stop <= LARGO_END);
const andanteStops = metronomeStops.filter(stop => stop >= ANDANTE_START && stop <= ANDANTE_END);
const moderatoStops = metronomeStops.filter(stop => stop >= MODERATO_START && stop <= MODERATO_END);
const allegroStops = metronomeStops.filter(stop => stop >= ALLEGRO_START && stop <= ALLEGRO_END);
const prestoStops = metronomeStops.filter(stop => stop >= PRESTO_START && stop <= PRESTO_END);

export default function TempoTrainer() {
  const { playDefaultSound } = useAudioStore();
  const { points, incrementPoints, decrementPoints } = useTempoTrainerStore();

  const [trainerSelectedStopIndex, setTrainerSelectedStopIndex] = React.useState<number | undefined>(undefined);
  const [userSelectedStopIndex, setUserSelectedStopIndex] = React.useState<number | undefined>(undefined);

  const [isNewAttempt, setIsNewAttempt] = React.useState(false);

  function handleTrainingStart() {
    setIsNewAttempt(true);
    setUserSelectedStopIndex(undefined);

    const randomMetronomeStopIndex = Math.floor(Math.random() * metronomeStops.length);
    setTrainerSelectedStopIndex(randomMetronomeStopIndex);
    console.log('trainerSelectedStop: ', metronomeStops[randomMetronomeStopIndex]);

    const newBPM = metronomeStops[randomMetronomeStopIndex];
    timerInstance.updateBPM(newBPM);
    timerInstance.start();
  }

  const getSkillLevelString = () => {
    if (points >= 0 && points < 20) {
      return 'Beginner';
    } else if (points >= 20 && points < 40) {
      return 'Intermediate';
    } else if (points >= 40) {
      return 'Advanced';
    } else {
      return 'Unrecognized level';
    }
  }

  const getSkillLevelRange = () => {
    const centerOfRange = 1;
    const beginnerRangeAboveOrBelow = 3;
    const IntermediateRangeAboveOrBelow = 2;
    const advancedRangeAboveOrBelow = 1;

    switch (getSkillLevelString()) {
      case 'Beginner': return beginnerRangeAboveOrBelow + centerOfRange;
      case 'Intermediate': return IntermediateRangeAboveOrBelow + centerOfRange;
      case 'Advanced': return advancedRangeAboveOrBelow + centerOfRange;

      default: return metronomeStops.length
    }
  }

  const handleTempoPick = (selectedMetronomeStopIndex: number | undefined) => {
    console.log('selectedMetronomeStopIndex: ', selectedMetronomeStopIndex);
    timerInstance.stop();
    setIsNewAttempt(false);

    if (selectedMetronomeStopIndex === undefined) return;

    setUserSelectedStopIndex(selectedMetronomeStopIndex);

    // Get the absolute distance from trainingStopSelectionIndex to userSelectedStopIndex
    function getAbsoluteDistanceBetweenMetronomeStops(trainerMetronomeStop: number, userMetronomeStop: number) {
      return Math.abs(userMetronomeStop - trainerMetronomeStop);
    }

    const absoluteDistanceBetweenMetronomeStops = getAbsoluteDistanceBetweenMetronomeStops(trainerSelectedStopIndex || 0, selectedMetronomeStopIndex);

    console.log('absoluteDistanceBetweenMetronomeStops: ', absoluteDistanceBetweenMetronomeStops);

    const skillLevelRange = getSkillLevelRange();
    console.log('skillLevelRange: ', skillLevelRange);

    const accuracy = skillLevelRange - absoluteDistanceBetweenMetronomeStops
    // If the distance is in the skillLevelRange, increment points by taking skillLevelRange - the distance
    if (accuracy > 0) {
      console.log('in range')
      const offsetForZero = 0;
      const newPoints = accuracy + offsetForZero
      incrementPoints(newPoints);
    } else {
      // If the distance is outside of the skillLevelRange, decrecrement point by taking  + distance - skillLevelRange
      console.log('out of range')
      const maximumDecrement = 5
      const amountToDecrement = absoluteDistanceBetweenMetronomeStops - skillLevelRange;
      decrementPoints(amountToDecrement <= maximumDecrement ? amountToDecrement : maximumDecrement);
    }
  };

  const handleTick = () => {
    playDefaultSound();
    console.log('tick');
  }

  // TODO Define the button in Buttons.tsx
  const getTempoStopGroupListItems = (rangeStops: number[]) => {
    return rangeStops.map(stop => (
      <li key={stop}>
        <button
          className={`metronome-stop-button
            ${userSelectedStopIndex
              && trainerSelectedStopIndex === metronomeStops.indexOf(stop) ?
              "trainer-picked"
              : ""}
            ${userSelectedStopIndex === metronomeStops.indexOf(stop) ? "user-picked" : ""}
            `}
          onClick={() => isNewAttempt && handleTempoPick(metronomeStops.indexOf(stop))}
        >{stop}
        </button>
      </li>
    ));
  }

  // TODO 
  const getRangeGroup = (stops: number[], title: string) => {
    return (
      <div className="tempo-range-group">
        <h3 className="tempo-range-title">{title}</h3>
        <ul className="tempo-range-list">
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

      <div className="content-wrapper">
        <div className="status">
          <p className="level">Level: <span>{getSkillLevelString()}</span></p>
          <p className="points">Points: <span>{points}</span></p>
        </div>

        <div className="tempo-range-groups">
          {getRangeGroup(largoStops, 'largo')}
          {getRangeGroup(andanteStops, 'andante')}
          {getRangeGroup(moderatoStops, 'moderato')}
          {getRangeGroup(allegroStops, 'allegro')}
          {getRangeGroup(prestoStops, 'presto')}
        </div>

        <Button.Default
          onClick={handleTrainingStart}>
          Train
        </Button.Default>
      </div>
    </div>
  );
}