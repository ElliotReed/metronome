import * as React from "react";
import useMetronomeStore from '@/store/useMetronomeStore';

import BeatsPerMeasure from "./BeatsPerMeasure";
import BeatUnits from "./BeatUnits";
import MeshContainer from "../common/MeshContainer";
import Note from "./Note";

import "./staff.css";

interface Props { beatCount: number; }

export default function Staff({
  beatCount,
}: Props) {
  const [beatUnit, setBeatUnit] = React.useState(4);
  const { beatsPerMeasure } = useMetronomeStore();

  const handleBeatUnitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target;
    if (target instanceof Element) {
      setBeatUnit(Number(target.textContent));
    }
  };

  return (
    <div className="Staff">
      <MeshContainer>
        <StaffImage />
      </MeshContainer>
      <div className="staff__content">
        <aside className="staffContent__aside">
          <BeatsPerMeasure />
          <BeatUnits
            beatUnit={beatUnit}
            handleBeatUnitClick={handleBeatUnitClick}
          />
        </aside>
        <div className="staffContent__main">
          <ul className="notes">
            {[...Array(beatsPerMeasure)].map((_, i) => (
              <Note
                key={i}
                id={i + 1}
                beat={beatCount}
                beatUnit={beatUnit}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StaffImage() {
  const base = 16;
  const stroke = "currentColor";
  const strokeWidth = 2;
  const x1 = "0";
  const x2 = "100%";
  const y1 = "1";
  const height = base;
  const numberOfLines = 5;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height={height * (numberOfLines - 1) + strokeWidth / 2}
      preserveAspectRatio="xMaxYMid"
      className="StaffImage"
    >
      {[...Array(numberOfLines)].map((_, index) => {
        const y = index === 0 ? y1 : height * index;
        return (
          <line
            key={index}
            x1={x1}
            x2={x2}
            y1={y}
            y2={y}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </svg>
  );
}
