# Metronome V2 - Planning Document

## 1. Project Overview
**Project Name:** Metronome V2  
**Purpose:** A web-based metronome with a tempo training game.  
**Primary Technologies:** React (Vite), @tanstack/router, Web Audio API  
**Target Audience:** Musicians, music students, and rhythm enthusiasts.

---

## 2. Goals & Core Features

### Metronome Page
#### Essential Features
- ✅ Start/stop metronome functionality.
- ✅ Adjustable BPM (slider & input).
- ✅ Time signature selection.
- ✅ Visual beat indication (e.g., beat markers or animation).
- ✅ Toggle metronome sound on/off.

#### Future Enhancements
- ⬜ Custom rhythms & subdivisions.
- ⬜ Presets for common tempos (e.g., 60 BPM, 120 BPM).
- ⬜ Tap tempo detection.

### Tempo Trainer Page
#### Essential Features
- ✅ Play a random tempo.
- ✅ User guesses the BPM by input or slider.
- ✅ Feedback: "Correct" or "Off by X BPM".
- ✅ Score tracking (number of correct guesses, accuracy).

#### Future Enhancements
- ⬜ Difficulty levels (e.g., easy, medium, hard).
- ⬜ Streak & accuracy tracking.
- ⬜ Leaderboard (optional for competitive features).

---

## 3. User Experience & Design

- **Simple, intuitive UI** – The interface should be clean and straightforward, with minimal clutter. Focus on the key functionality, with clear and easily accessible controls.
  
- **Mobile-friendly** – The design should be responsive and optimized for mobile devices, ensuring a seamless experience on smartphones and tablets.
  
- **Smooth interactions** – Ensure that interactions (e.g., adjusting the BPM, starting/stopping the metronome) feel fast and responsive. No page reloads.

- **Accessible controls** – The app should support keyboard shortcuts, screen reader capabilities, and simple gestures for mobile devices.

---

## 4. Technical Considerations

### Routing
- **@tanstack/router** will be used for fast, client-side navigation between the pages (Metronome and Tempo Trainer) without full page reloads.

### State Management
- **Local State** will be used for managing metronome settings (BPM, time signature, etc.) and game state (score, guesses). Depending on complexity, this might evolve to use Context API or a state management library like Zustand.

### Audio Handling
- The **Web Audio API** will be leveraged to generate accurate sound for the metronome, ensuring minimal latency.

### Performance
- Animations and audio feedback should be optimized for minimal performance overhead, especially on mobile devices. Focus will be on smooth transitions, and optimized rendering cycles.

---

## 5. Next Steps

- [ ] Refine UX/UI wireframes: Visualize layout and interactions (consider tools like Figma or Sketch).
- [ ] Define API interactions (if backend API is involved, document endpoints or data flow).
- [ ] Document detailed component structure: Outline components in the app (e.g., `Metronome`, `TempoTrainer`, `BPMSlider`).
- [ ] Set up testing strategy: Choose frameworks and write initial test cases (React Testing Library, Cypress for E2E).

---

## 6. Additional Notes
- Consider accessibility requirements (contrast, font sizes, screen reader compatibility).
- Explore potential for community features like user-generated challenges or tutorials in future iterations.

# AudioEngine & Visual Synchronization - Conceptual Design

## 1. Overview
This document outlines the conceptual design for integrating a global AudioEngine with the visual layer of the application. The design separates the responsibilities between audio timing/playback and the visual representation of beats using Note and Measure classes.

## 2. Global AudioEngine Consumption
- **Global AudioEngine Instance:**  
  A single instance of the AudioEngine is created and provided via a React Context provider, ensuring a consistent source of audio timing and playback across the app.

- **Event-Driven Communication:**  
  The AudioEngine:
  - Loads audio assets (e.g., `click.wav` and `clickAccent.wav`).
  - Schedules precise playback using the Web Audio API.
  - Emits beat/tick events (with details such as the current beat index) based on BPM and time signature.
  
- **Provider Setup:**  
  The global provider (e.g., `AudioEngineProvider`) makes the AudioEngine accessible to all components. Components subscribe to the beat events, allowing them to react and update the UI accordingly.

## 3. Note & Measure Structure for Visuals

### Note Objects
- **Purpose:**  
  Each Note represents an individual beat within a measure.
- **Properties:**
  - **Type:** Indicates whether the note is a regular click, an accent, or muted.
  - **Animation State:** Contains data on how the note should animate (e.g., flash, pulse) when activated.
  - **Timing Position:** Its position in the measure (e.g., 1st beat, 2nd beat).

### Measure Class
- **Purpose:**  
  Organizes a sequence of Note objects into a complete measure.
- **Responsibilities:**
  - **Containment:** Holds an array of Note objects representing a single measure.
  - **Beat Logic:** Determines which Note to activate based on the current beat index received from the AudioEngine.
  - **Multiple Measures:** Allows for multiple measures, each managing its own sequence of notes independently.

## 4. Interaction Flow
1. **Audio Tick Event:**  
   - The AudioEngine emits a tick event, including the current beat index.

2. **Processing in the UI:**  
   - A dedicated controller or component subscribes to these tick events.
   - Based on the current beat index, it identifies the active Measure and retrieves the corresponding Note.

3. **Triggering Audio & Visual Actions:**  
   - **Audio Playback:**  
     The AudioEngine uses the Note’s type (regular, accent, or muted) to determine which audio buffer to play.
   - **Visual Animation:**  
     The corresponding Note component in the UI triggers its animation (e.g., a flash or pulse) to visually represent the beat.

4. **Synchronized Experience:**  
   - The separation ensures that audio playback (handled by AudioEngine) and visual feedback (managed by Note and Measure classes) remain in sync, providing a cohesive user experience.

## 5. Summary
- **Global AudioEngine:**  
  Manages all audio timing and playback, emitting precise beat events via a worker.

- **React Context Provider:**  
  Exposes the AudioEngine to the entire app, enabling consistent audio control.

- **Note Objects:**  
  Represent individual beats with properties to control sound type and animations.

- **Measure Class:**  
  Organizes these notes into measures, determining which note should be activated on each beat.

- **Event-Driven UI:**  
  UI components listen to AudioEngine tick events to update both audio playback and visual animations, ensuring a synchronized and responsive metronome experience.