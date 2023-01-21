import * as React from "react";

interface MeterBtnProps {
  showState: boolean,
  handleClick: () => void,
}

function MeterBtn({ children, showState, handleClick }: React.PropsWithChildren<MeterBtnProps>) {
  const meterBtnClass = `MeterBtn ${showState ? "show" : ""}`;

  return (
    <button type="button" onClick={handleClick} className={meterBtnClass}>
      {children}
    </button>
  );
}

interface CircularButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  expand: boolean,
}
function CircularBtn({ children, onClick, expand }: React.PropsWithChildren<CircularButtonProps>) {
  const circularBtnClass = `CircularBtn ${expand ? "expand" : "contract"}`;
  return (
    <button type="button" onClick={onClick} className={circularBtnClass}>
      {children}
    </button>
  );
}

interface CloseBtnProps {
  handleClick: () => void,
  expand: boolean,
}

function CloseBtn({ handleClick, expand }: CloseBtnProps) {
  const closeBtnClass = `CloseBtn ${expand ? "expand" : "contract"}`;
  return (
    <button type="button" onClick={handleClick} className={closeBtnClass}>
      X
    </button>
  );
}

export {
  CloseBtn,
  MeterBtn,
  CircularBtn,
}