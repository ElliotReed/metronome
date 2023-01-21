import * as React from "react";

import MeterElementContainer from "./MeterElementContainer";
import { CircularBtn, CloseBtn, MeterBtn } from "./StaffButtons";

import OutsideAlerter from "../common/OutsideAlerter/OutsideAlerter";

interface Props {
  beatUnit: number,
  handleBeatUnitClick: (e: React.MouseEvent<HTMLButtonElement>) => any,
}

export default function BeatUnits({ beatUnit, handleBeatUnitClick }: Props) {
  const beatUnits = [2, 4, 8, 16];
  const [shouldShowBeatUnitEditor, setShouldShowBeatUnitEditor] =
    React.useState(false);

  const beatUnitEditorClass = shouldShowBeatUnitEditor
    ? "showBeatUnitEditor"
    : "";

  const beatSelectorClass = `beatSelector`;
  const beatUnitClass = `beatSelector__unit ${beatUnitEditorClass}`;

  const beatUnitClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleBeatUnitClick(e);
    setShouldShowBeatUnitEditor(false);
  };

  return (
    <div className="BeatUnits">
      <OutsideAlerter callback={() => setShouldShowBeatUnitEditor(false)}>
        <MeterElementContainer showState={shouldShowBeatUnitEditor}>
          <MeterBtn
            handleClick={() =>
              setShouldShowBeatUnitEditor(!shouldShowBeatUnitEditor)
            }
            showState={shouldShowBeatUnitEditor}
          >
            {beatUnit}
          </MeterBtn>
          <ul className={beatSelectorClass}>
            {beatUnits.map((unit) => (
              <li key={unit}>
                <CircularBtn
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => beatUnitClickHandler(e)}
                  expand={shouldShowBeatUnitEditor}
                >
                  {unit}
                </CircularBtn>
              </li>
            ))}
          </ul>
          <CloseBtn
            handleClick={() => setShouldShowBeatUnitEditor(false)}
            expand={shouldShowBeatUnitEditor}
          />
        </MeterElementContainer>
      </OutsideAlerter>
    </div>
  );
}