import "./App.css";
import Header from "./components/Header/Header";
import Metronome from "./components/Metronome";

export default function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Metronome />
      </main>
    </>
  );
}
