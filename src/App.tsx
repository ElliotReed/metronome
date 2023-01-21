import Header from "./components/Header/Header";
import Metronome from "./components/Metronome";

import "./App.css";

export default function App() {
  return (
    <>
      <Header />
      <main className="main scrollbar">
        <Metronome />
      </main>
    </>
  );
}
