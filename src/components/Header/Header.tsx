import { Link } from '@tanstack/react-router';

import { MeshContainer, NoTranslate } from '../common';

import "./header.css";

// The div wrapper is neccesary because the apps grid has one spot for the header
export default function Header() {
  return (
    <div className="header">
      <header className="logo-header">
        <MeshContainer>
          <Link to="/">
            <span className="logo">Cool Metronome</span>
          </Link>
        </MeshContainer>
      </header>

      <header className="apps-header">
        <nav>
          <Link to="/">
            Metronome
          </Link>
          <Link to="/tempo-tapper">
            <NoTranslate>Tempo</NoTranslate>{" "}Tapper
          </Link>
          <Link to="/tempo-trainer">
            <NoTranslate>Tempo</NoTranslate>{" "}Trainer
          </Link>
        </nav>
      </header>
    </div>
  );
}
