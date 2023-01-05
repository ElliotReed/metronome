import * as React from "react";

import MeshContainer from "../common/MeshContainer";

import click from "./click.wav";
import clickAccent from "./clickAccent.wav";

import "./staff.css";

const defaultSound = new Audio(click);
const accentSound = new Audio(clickAccent);

export default function Staff({
  beatCount,
  beatsPerMeasure,
  setBeatsPerMeasure,
}) {
  const [beatUnit, setBeatUnit] = React.useState("4");

  const handleBeatUnitClick = (e) => {
    setBeatUnit(e.target.textContent);
  };

  return (
    <section className="Staff">
      <MeshContainer id="staff">
        <StaffImage />
      </MeshContainer>
      <div className="staff__content">
        <aside className="staffContent__aside">
          <BeatsPerMeasure
            beatsPerMeasure={beatsPerMeasure}
            setBeatsPerMeasure={setBeatsPerMeasure}
          />
          <BeatUnits
            beatUnit={beatUnit}
            handleBeatUnitClick={handleBeatUnitClick}
          />
        </aside>
        <main className="staffContent__main">
          <ul className="notes">
            {[...Array(beatsPerMeasure)].map((note, i) => (
              <Note
                key={i}
                id={i + 1}
                beat={beatCount}
                beatUnit={beatUnit}
                defaultSound={defaultSound}
                accentSound={accentSound}
              />
            ))}
          </ul>
        </main>
      </div>
    </section>
  );
}

function Note({ id, beatUnit, beat, defaultSound, accentSound }) {
  const [status, setStatus] = React.useState("default");

  let noteClass = `Note ${status} ${beat === id ? "isPlaying" : ""}`;

  const playSound = () => {
    status === "accent" && accentSound.play();
    status === "default" && defaultSound.play();
    return;
  };

  const handleBeatEvent = (beat) => {
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
    id && (
      <li className={noteClass} onClick={handleStatus}>
        <NoteImage status={status} beatUnit={beatUnit} />
      </li>
    )
  );
}

function NoteImage({ status, beatUnit }) {
  const base = 16;
  const offset = 2;
  const width = base * 2;
  const height = base * 7 + offset + base / 2;
  const color = "currentColor";
  const strokeWidth = base / 3;
  const linecap = "butt";

  const accent = () =>
    [...Array(2)].map((value, index) => {
      const leftX = 0;
      const rightX = width - base / 2;
      const middleY = base / 2;
      return (
        <line
          key={index}
          x1={index === 0 ? leftX : rightX}
          x2={index === 0 ? rightX : leftX}
          y1={index === 0 ? 1 : middleY}
          y2={index === 0 ? middleY : base}
          stroke={color}
          strokeWidth={strokeWidth / 2}
          className="accent"
        />
      );
    });

  const stem = (beatUnit) => {
    const y1 = beatUnit > 2 ? height - base * 3.4 : height - base * 4;

    return (
      <line
        x1={1}
        x2={1}
        y1={y1}
        y2={height}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={linecap}
        className="stem"
      />
    );
  };

  const slashNotehead = () => {
    const y = height / 2 + base / 2;
    const x = 0;
    return (
      <rect
        x={x}
        y={y}
        width={base * 2}
        height={base / 3}
        fill={color}
        transform={`rotate(-45 ${x} ${y})`}
        className="slashNotehead"
      />
    );
  };

  const slashHalfNotehead = () => {
    const x = 1;
    const y = height - base * 4;
    const width = base * 1.5;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={16}
        stroke={color}
        strokeWidth={strokeWidth / 1.5}
        fill="transparent"
        transform={`rotate(-45 ${x} ${y})`}
        className="slashHalfNotehead"
      />
    );
  };

  const rest = () => {
    let restPath;

    const halfRestY1 = 50;
    const halfRestY2 = 58;
    const halfRestX1 = 8;
    const halfRestX2 = 24;

    const halfRestPath = `m ${halfRestX1} ${halfRestY1} L ${halfRestX2} ${halfRestY1} L ${halfRestX2} ${halfRestY2} L ${halfRestX1} ${halfRestY2}  z`;

    const quarterRestPath = `m 23,50 c 0,2.996798 -5.993592,7.491992 -5.993592,13.485742 0,2.247598 4.495195,8.990389 7.49199,12.736543 -1.498413,-0.749198 -2.996795,-1.498415 -5.244394,-1.498415 -4.495192,0 -5.99359,3.745998 -5.99359,5.993593 0,1.498413 1.498413,2.996799 2.247596,4.495194 -4.495195,-2.996797 -7.491991,-5.99359 -7.491991,-8.990388 0,-7.491988 5.117112,-4.869871 8.863107,-6.368271 -3.745995,-3.745995 -7.3647079,-9.365067 -7.3647079,-11.612664 0,-1.498413 4.4951949,-6.742791 5.9935919,-10.488787 v -2.247597 c 0,-2.247597 -1.498414,-5.244394 -2.247596,-7.49199 2.996795,3.745995 9.739586,10.488947 9.739586,11.987345 z`;

    const eightRestPath = `m 12,50 c -1.118072,0.210714 -1.973827,0.982613
  -2.360851,2.049082 -0.08386,0.344023 -0.08386,0.427877 -0.08386,0.898758 0,0.647191 0.04085,0.991213 0.344021,1.502947 0.427878,0.857905 1.326636,1.545949 2.352253,1.797516 1.075068,0.30317 2.872583,0.04301 4.930266,-0.638591 l 0.511732,-0.176313 -2.528562,6.987951 -2.48556,6.97935 c 0,0 0.08386,0.04301 0.219313,0.135458 0.251567,0.16771 0.679444,0.294569 0.982614,0.294569 0.511734,0 1.158925,-0.294569 1.24278,-0.554736 0,-0.08386 1.199777,-4.158367 2.653271,-8.996179 l 2.569416,-8.869321 -0.08386,-0.124708 c -0.208564,-0.260167 -0.636441,-0.344022 -0.898758,-0.135458 -0.08386,0.08386 -0.217164,0.260166 -0.301019,0.387024 -0.387026,0.647192 -1.369639,1.797515 -1.881372,2.225393 -0.470879,0.387026 -0.731046,0.427878 -1.158924,0.260167 -0.387026,-0.210713 -0.513883,-0.427878 -0.77405,-1.586803 -0.251567,-1.150323 -0.552586,-1.672807 -1.199777,-2.100684 -0.597738,-0.384875 -1.369638,-0.511733 -2.049082,-0.335422 z`;

    const sixteenthRestPath = `m 14,50 c -0.83268,0.15723 -1.472832,0.733207
-1.753601,1.528985 -0.06899,0.256703 -0.06899,0.319275 -0.06899,0.670636 0,0.482923 0.03048,0.739625 0.256703,1.121471 0.319274,0.640152 0.98991,1.153558 1.761623,1.341272 0.795779,0.226219 2.072875,0.06257 3.609889,-0.444417 0.224615,-0.09466 0.412329,-0.163648 0.412329,-0.13156 0,0.0369 -1.434333,4.700869 -1.496904,4.862913 -0.163649,0.413933 -0.709142,1.17923 -1.185646,1.660548 -0.444417,0.446021 -0.670636,0.545493 -1.020394,0.38345 -0.288791,-0.157231 -0.38345,-0.320879 -0.577581,-1.185648 -0.162044,-0.638548 -0.287186,-0.98991 -0.543889,-1.240195 -0.670636,-0.739625 -1.824194,-0.834284 -2.714632,-0.256703 -0.420351,0.287186 -0.739625,0.733207 -0.927339,1.216129 -0.06899,0.250286 -0.06899,0.319274 -0.06899,0.669034 0,0.476504 0.0369,0.734811 0.256703,1.116657 0.319274,0.638548 0.98991,1.153558 1.761623,1.341272 0.351362,0.09947 1.246613,0.09947 1.854677,0 0.506988,-0.09466 1.115053,-0.25189 1.723118,-0.446021 0.256703,-0.09305 0.482922,-0.155627 0.482922,-0.125143 0,0 -3.133378,10.197518 -3.19595,10.353144 0,0.03209 0.250286,0.226219 0.506988,0.28879 0.256703,0.101077 0.51501,0.101077 0.771713,0 0.250285,-0.06257 0.506988,-0.219801 0.506988,-0.319274 0.03209,-0.03209 1.310789,-4.856495 2.876675,-10.710923 l 2.846199,-10.641936 -0.06257,-0.09305 c -0.126747,-0.194131 -0.38345,-0.226219 -0.608065,-0.13156 -0.126747,0.06257 -0.126747,0.06257 -0.508592,0.638548 -0.319275,0.513406 -0.770109,1.052482 -1.026812,1.309184 -0.351361,0.288791 -0.539075,0.351362 -0.85996,0.22622 -0.287186,-0.157231 -0.388263,-0.319274 -0.575977,-1.184042 -0.194132,-0.85835 -0.420351,-1.248217 -0.896855,-1.567491 -0.444417,-0.287186 -1.020394,-0.381846 -1.535404,-0.250285 z`;

    switch (beatUnit) {
      case "2":
        restPath = halfRestPath;
        break;
      case "4":
        restPath = quarterRestPath;
        break;
      case "8" || 8:
        restPath = eightRestPath;
        break;
      case "16":
        restPath = sixteenthRestPath;
        break;
      default:
        restPath = quarterRestPath;
    }

    return <path d={restPath} stroke={color} fill={color} />;
  };

  const addFlags = (beatUnit) => {
    let flagPath;

    const eighthFlagPath = `m 1,132 c -2.6140888,0.86567 -2.966912,-1.86302 -2.5503293,-3.73185 0.00594,-5.53729 0.018124,-11.07457 0.028268,-16.61185 4.9829013,-0.22272 10.0685457,-2.25292 13.4088092,-6.02844 3.132283,-3.916918 4.570983,-9.068028 4.470302,-14.041196 -0.327735,-5.200824 -2.849963,-9.89289 -4.529967,-14.72131 0.903899,-0.39334 1.774024,2.67672 2.409855,3.613641 1.820223,4.16573 3.258655,8.549994 3.951763,13.049887 0.639689,5.62853 -1.481484,11.23323 -4.86714,15.663588 -3.443586,4.87003 -8.3549752,8.68364 -10.9610657,14.13313 -1.1697705,2.72271 -1.47479676,5.73721 -1.3604997,8.6744 z`;

    const sixteenthFlagPath = `m 2,125 c 0,-7.77817 0,-15.55632 0,-23.33448 4.399597,-2.520445 8.2475973,-5.652082 11.9269998,-8.855873 3.415936,-3.52808 3.457439,-8.46071 2.123205,-12.652854 -0.600597,-1.625998 -1.715941,-3.180668 -1.657983,-4.929601 2.551591,2.298302 3.225678,5.547399 3.806793,8.530346 0.380764,3.069546 -0.08277,6.172454 -0.958174,9.157779 1.431154,5.223061 1.904429,11.155583 -1.660518,15.882573 -2.762338,4.60226 -8.9135102,7.24387 -10.8037519,12.27803 -1.0496829,1.37667 0.6568098,4.80336 -2.7765709,3.92408 z m 2.0740941,-12.20206 c 5.3273841,-2.09219 9.6818267,-6.03276 11.5771507,-10.69225 0.79173,-2.33356 0.698984,-4.788262 0.545888,-7.185523 -3.02006,5.419423 -9.8577493,8.926173 -11.5470108,14.930893 -0.2841763,0.96798 -0.5053823,1.95044 -0.5760279,2.94688 z`;

    switch (beatUnit) {
      case "8":
        flagPath = eighthFlagPath;
        break;
      case "16":
        flagPath = sixteenthFlagPath;
        break;
      default:
        flagPath = eighthFlagPath;
    }

    return beatUnit > 4 && <path d={flagPath} stroke={color} fill={color} />;
  };

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className="NoteImage"
    >
      {status === "accent" && accent()}
      {status === "mute" && rest()}
      {status !== "mute" && addFlags(beatUnit)}
      {status !== "mute" && stem(beatUnit)}
      {status !== "mute" && beatUnit > 2 && slashNotehead()}
      {status !== "mute" && beatUnit < 4 && slashHalfNotehead()}
    </svg>
  );
}

function BeatsPerMeasure({ beatsPerMeasure, setBeatsPerMeasure }) {
  const [shouldShowBeatEditor, setShouldShowBeatEditor] = React.useState(false);

  const handleBeatsIncrement = (e) => {
    beatsPerMeasure < 16 && setBeatsPerMeasure(beatsPerMeasure + 1);
  };

  const handleBeatsDecrement = (e) => {
    beatsPerMeasure > 1 && setBeatsPerMeasure(beatsPerMeasure - 1);
  };

  const handleShowBeatEditorClick = () => {
    setShouldShowBeatEditor(!shouldShowBeatEditor);
  };

  return (
    <section className="BeatsPerMeasure">
      <OutsideAlerter callback={() => setShouldShowBeatEditor(false)}>
        <MeterElementContainer showState={shouldShowBeatEditor}>
          <CircularBtn
            handleClick={handleBeatsDecrement}
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
            handleClick={handleBeatsIncrement}
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
    </section>
  );
}

function BeatUnits({ beatUnit, handleBeatUnitClick }) {
  const beatUnits = [2, 4, 8, 16];
  const [shouldShowBeatUnitEditor, setShouldShowBeatUnitEditor] =
    React.useState(false);

  const beatUnitEditorClass = shouldShowBeatUnitEditor
    ? "showBeatUnitEditor"
    : "";

  const beatSelectorClass = `beatSelector`;
  const beatUnitClass = `beatSelector__unit ${beatUnitEditorClass}`;

  const beatUnitClickHandler = (e) => {
    handleBeatUnitClick(e);
    setShouldShowBeatUnitEditor(false);
  };

  return (
    <section className="BeatUnits">
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
                  handleClick={(e) => beatUnitClickHandler(e)}
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
    </section>
  );
}

function MeterElementContainer({ children, showState }) {
  const meterElementClass = `MeterElementContainer ${showState ? "show" : ""}`;
  return <main className={meterElementClass}>{children}</main>;
}

function MeterBtn({ children, showState, handleClick }) {
  const meterBtnClass = `MeterBtn ${showState ? "show" : ""}`;

  return (
    <button type="button" onClick={handleClick} className={meterBtnClass}>
      {children}
    </button>
  );
}

function CircularBtn({ children, handleClick, expand }) {
  const circularBtnClass = `CircularBtn ${expand ? "expand" : "contract"}`;
  return (
    <button type="button" onClick={handleClick} className={circularBtnClass}>
      {children}
    </button>
  );
}

function CloseBtn({ handleClick, expand }) {
  const closeBtnClass = `CloseBtn ${expand ? "expand" : "contract"}`;
  return (
    <button type="button" onClick={handleClick} className={closeBtnClass}>
      X
    </button>
  );
}

function StaffImage() {
  const base = 16;
  const stroke = "currentColor";
  const strokeWidth = "2";
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
      {[...Array(numberOfLines)].map((value, index) => {
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

function useOutsideAlerter(ref, callback) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props) {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, props.callback);

  return (
    <div ref={wrapperRef} className="OutsideAlerter">
      {props.children}
    </div>
  );
}