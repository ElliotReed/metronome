import { Link } from '@tanstack/react-router';

import MeshContainer from '@/components/common/MeshContainer';
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <MeshContainer>
        <nav className="header-grid">
          <Link to="/">
            <div className="header__title-wrapper">
              <h1 className="header__title">Metronome</h1>
            </div>
          </Link>
          <Link to="/game" className="header__button-link">
            Practice Mode
          </Link>
        </nav>
      </MeshContainer>
    </header>
  );
}
