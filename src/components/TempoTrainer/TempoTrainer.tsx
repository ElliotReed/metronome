import * as React from 'react';
import classnames from 'classnames';

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

function getSkillLevelString(points: number) {
  const BEGINNER_START_POINTS = 0;
  const BEGINNER_END_POINTS = 19;
  const INTERMEDIATE_START_POINTS = 20;
  const INTERMEDIATE_END_POINTS = 39;
  const ADVANCED_START_POINTS = 40;
  const ADVANCED_END_POINTS = 59;
  const PROFESSIONAL_START_POINTS = 60;
  const PROFESSIONAL_END_POINTS = Infinity;

  if (points >= BEGINNER_START_POINTS && points <= BEGINNER_END_POINTS) {
    return 'Beginner';
  } else if (points >= INTERMEDIATE_START_POINTS && points <= INTERMEDIATE_END_POINTS) {
    return 'Intermediate';
  } else if (points >= ADVANCED_START_POINTS && points <= ADVANCED_END_POINTS) {
    return 'Advanced';
  } else if (points >= PROFESSIONAL_START_POINTS && points <= PROFESSIONAL_END_POINTS) {
    return 'Professional';
  } else {
    return 'Unrecognized level';
  }
}

function getSkillLevelRange(points: number) {
  const centerOfRange = 1;
  const beginnerRangeAboveOrBelow = 3;
  const IntermediateRangeAboveOrBelow = 2;
  const advancedRangeAboveOrBelow = 1;
  const professionalRangeAboveOrBelow = advancedRangeAboveOrBelow;

  switch (getSkillLevelString(points)) {
    case 'Beginner': return beginnerRangeAboveOrBelow + centerOfRange;
    case 'Intermediate': return IntermediateRangeAboveOrBelow + centerOfRange;
    case 'Advanced': return advancedRangeAboveOrBelow + centerOfRange;
    case 'Professional': return professionalRangeAboveOrBelow + centerOfRange;
    default: return metronomeStops.length
  }
}

function getAbsoluteDistanceBetweenMetronomeStops(trainerMetronomeStop: number, userMetronomeStop: number) {
  return Math.abs(userMetronomeStop - trainerMetronomeStop);
}

export default function TempoTrainer() {
  const { playDefaultSound } = useAudioStore();
  const { points, incrementPoints, decrementPoints } = useTempoTrainerStore();

  const [trainerSelectedStopIndex, setTrainerSelectedStopIndex] = React.useState<number | undefined>(undefined);
  const [userSelectedStopIndex, setUserSelectedStopIndex] = React.useState<number | undefined>(undefined);

  const [isNewAttempt, setIsNewAttempt] = React.useState(false);
  const [pointDifference, setPointDifference] = React.useState("");

  const handleTrainingStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Bug fix for sometimes submitting
    setIsNewAttempt(true);
    setUserSelectedStopIndex(undefined);

    const randomMetronomeStopIndex =
      Math.floor(Math.random() * metronomeStops.length);

    setTrainerSelectedStopIndex(randomMetronomeStopIndex);
    // console.log('trainerSelectedStop: ', metronomeStops[randomMetronomeStopIndex]);

    const newBPM = metronomeStops[randomMetronomeStopIndex];
    timerInstance.updateBPM(newBPM);
    timerInstance.start();
  }

  const handleTempoPick = (selectedMetronomeStopIndex: number | undefined) => {
    if (selectedMetronomeStopIndex === undefined) return;

    timerInstance.stop();
    setIsNewAttempt(false);
    setUserSelectedStopIndex(selectedMetronomeStopIndex);

    const absoluteDistanceBetweenMetronomeStops = getAbsoluteDistanceBetweenMetronomeStops(trainerSelectedStopIndex || 0, selectedMetronomeStopIndex);
    const skillLevelRange = getSkillLevelRange(points);
    const accuracy = skillLevelRange - absoluteDistanceBetweenMetronomeStops

    if (accuracy >= 0) {
      // If the distance is in the skillLevelRange, increment points by taking skillLevelRange - the distance
      const newPoints = accuracy;
      setPointDifference(`+${newPoints}`);
      incrementPoints(newPoints);
    } else {
      // If the distance is outside of the skillLevelRange, decrecrement point by taking  + distance - skillLevelRange
      const maximumDecrement = 5
      const amountToDecrement = absoluteDistanceBetweenMetronomeStops - skillLevelRange;
      const normalizedDecrement = amountToDecrement <= maximumDecrement ? amountToDecrement : maximumDecrement
      const newPoints = points - normalizedDecrement > 0 ? normalizedDecrement : 0;
      setPointDifference(`-${newPoints}`);
      decrementPoints(newPoints);
    }
  };

  const handleTick = () => {
    playDefaultSound();
  }

  // TODO Define the button in Buttons.tsx
  const getTempoStopGroupListItems = (rangeStops: number[]) => {
    return rangeStops.map(stop => (
      <li key={stop}>
        <button
          type="button"
          className={classnames("metronome-stop-button", {
            "trainer-picked": userSelectedStopIndex
              && trainerSelectedStopIndex === metronomeStops.indexOf(stop),
            "user-picked": userSelectedStopIndex === metronomeStops.indexOf(stop)
          })}
          onClick={() => isNewAttempt &&
            handleTempoPick(metronomeStops.indexOf(stop))}
        >
          {stop}
          <span className="point-difference-floater">{pointDifference}</span>
        </button>
      </li>
    ));
  }

  function getRangeGroup(stops: number[], title: string) {
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
    <div className="tempo-trainer">
      <PageHeading>Tempo Trainer</PageHeading>

      <div className="tempo-trainer-content">
        <div className="status">
          <p className="level">Level: <span>{getSkillLevelString(points)}</span></p>
          <p className="points">
            Points: <span>{points}</span>
            {pointDifference != "" &&
              <span className="point-difference">({pointDifference})</span>}
          </p>
        </div>

        <div className="tempo-trainer-range-groups">
          {getRangeGroup(largoStops, 'largo')}
          {getRangeGroup(andanteStops, 'andante')}
          {getRangeGroup(moderatoStops, 'moderato')}
          {getRangeGroup(allegroStops, 'allegro')}
          {getRangeGroup(prestoStops, 'presto')}
        </div>

        <Button.Default
          // Passing event to prevent default, bug fix
          onClick={(e) => handleTrainingStart(e)}>
          Train
        </Button.Default>
      </div>
    </div>
  );
}