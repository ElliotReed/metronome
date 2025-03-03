# AudioEngine & Global Provider Planning Document

## 1. Overview
This document outlines the plan to integrate a global AudioEngine into the `metronome_v2` frontend application. The AudioEngine will manage all audio-related tasks—such as loading audio files, controlling gain, and scheduling playback—using the Web Audio API and a Web Worker for precise timing. The global instance will be provided via a React Context to ensure a single source of truth throughout the app.

## 2. Goals
- **Centralized Audio Management:** Maintain a single AudioEngine instance for consistent behavior across the app.
- **Precise Scheduling:** Use the Web Audio API and a worker to accurately schedule metronome ticks.
- **Decoupled UI Components:** Allow components to access audio controls without embedding audio logic.
- **Dynamic Control:** Enable real-time adjustments (BPM, volume, etc.) via a global provider.

## 3. Architecture & Key Components

### AudioEngine Class
- **Responsibilities:**
  - **Initialization:** Create an `AudioContext` and set up gain nodes for overall volume control, as well as separate controls for click sounds.
  - **Audio Resource Management:** Load and decode `click.wav` and `clickAccent.wav` into reusable audio buffers.
  - **Worker Integration:** Instantiate a Web Worker that handles precise timing and sends tick events.
  - **Audio Scheduling:** Use `AudioContext.currentTime` to schedule playback of the appropriate sound (click or accent) upon receiving a worker tick.
  - **Controls:** Provide methods for starting/stopping the metronome, adjusting BPM, and setting gain levels.

### Global Provider Setup
- **React Context:**
  - Create an `AudioEngineContext` using `React.createContext` to hold the global AudioEngine instance.
- **Provider Component:**
  - Implement an `AudioEngineProvider` component that:
    - Instantiates the AudioEngine once (using a state hook or on component mount).
    - Exposes the AudioEngine instance to the rest of the application.
    - Cleans up the AudioEngine (and the worker) on unmount.
- **Consumer Integration:**
  - Components across the app can use `useContext(AudioEngineContext)` to access audio functionality, triggering actions such as starting or stopping the metronome and adjusting settings.

## 4. Implementation Outline

### AudioEngine Class (Conceptual Methods)
- **Constructor:**
  - Initialize the `AudioContext` and gain nodes.
  - Set up properties for audio buffers.
  - Instantiate the Web Worker and bind message handlers.
- **loadAudioFiles():**
  - Fetch and decode `click.wav` and `clickAccent.wav` into audio buffers.
  - Cache these buffers for reuse.
- **startMetronome(bpm, timeSignature):**
  - Configure the Web Worker with the desired BPM and time signature.
  - Begin receiving tick events from the worker.
- **onWorkerTick(event):**
  - Determine which sound (click or accent) to play based on the current beat.
  - Schedule the sound using the AudioContext's precise scheduling.
- **stopMetronome():**
  - Terminate the worker timer and cancel any pending audio events.
- **setGain(level):**
  - Adjust the gain value to control overall volume or individual audio channels.

### Global Provider (Conceptual Setup)
- **AudioEngineContext:**
  ```js
  import { createContext } from 'react';
  export const AudioEngineContext = createContext(null);
