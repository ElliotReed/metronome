import { Link } from '@tanstack/react-router';

import MeshContainer from '@/components/common/MeshContainer';
import "./header.css";

export default function Header() {
  return (
    <header >
      <div className="header">
        <MeshContainer>
          <nav className="header-grid">
            <Link to="/">
              <div className="header__title-wrapper">
                <h1 className="header__title">Metronome</h1>
              </div>
            </Link>
          </nav>
        </MeshContainer>
      </div>
      <nav className="header-grid">
        <Link to="/tempo-trainer" className="header__button-link">
          Tempo Trainer
        </Link>
        <Link to="/tempo-tapper" className="header__button-link">
          Tempo Tapper
        </Link>
      </nav>
    </header>
  );
}
