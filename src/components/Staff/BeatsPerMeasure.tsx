import * as React from "react";

import MeterElementContainer from "./MeterElementContainer";
import { CircularBtn, MeterBtn, CloseBtn } from "./StaffButtons";

import OutsideAlerter from "../common/OutsideAlerter/OutsideAlerter";
import { useMetronomeStore } from '@/store';

interface Props {
  beatsPerMeasure: number;
  setBeatsPerMeasure: React.Dispatch<React.SetStateAction<number>>;
}

export default function BeatsPerMeasure() {
  const [shouldShowBeatEditor, setShouldShowBeatEditor] = React.useState(false);
  const { beatsPerMeasure, setBeatsPerMeasure } = useMetronomeStore();
  const handleBeatsIncrement = () => {
    const newBeatsPerMeasure = beatsPerMeasure + 1;
    beatsPerMeasure < 16 && setBeatsPerMeasure(newBeatsPerMeasure);
  };

  const handleBeatsDecrement = () => {
    const newBeatsPerMeasure = beatsPerMeasure - 1;
    beatsPerMeasure > 1 && setBeatsPerMeasure(newBeatsPerMeasure);
  };

  const handleShowBeatEditorClick = () => {
    setShouldShowBeatEditor(!shouldShowBeatEditor);
  };

  return (
    <div className="BeatsPerMeasure">
      <OutsideAlerter callback={() => setShouldShowBeatEditor(false)}>
        <MeterElementContainer showState={shouldShowBeatEditor}>
          <CircularBtn
            onClick={handleBeatsDecrement}
            expand={shouldShowBeatEditor}
          >
            -
          </CircularBtn>
          <MeterBtn
            handleClick={handleShowBeatEditorClick}
            showState={shouldShowBeatEditor}
          >
            {beatsPerMeasure}
          </MeterBtn>

          <CircularBtn
            onClick={handleBeatsIncrement}
            expand={shouldShowBeatEditor}
          >
            +
          </CircularBtn>
          <CloseBtn
            handleClick={() => setShouldShowBeatEditor(false)}
            expand={shouldShowBeatEditor}
          />
        </MeterElementContainer>
      </OutsideAlerter>
    </div>
  );
}