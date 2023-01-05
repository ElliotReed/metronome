import MeshContainer from "../common/MeshContainer";

import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <MeshContainer>
        <div className="header__title-wrapper">
          <h1 className="header__title">Metronome</h1>
        </div>
      </MeshContainer>
    </header>
  );
}
