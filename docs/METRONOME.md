# Metronome Component & Note Tracking - Conceptual Design

## 1. Overview
This document outlines the conceptual design for the metronome component in the frontend. The metronome component consumes a global AudioEngine (provided via React Context) that has loaded the click sounds. It sets the BPM, starts the engine with its time worker, and keeps track of beats by cycling through a collection of measures. Each measure is defined by its own time signature and is filled with Note objects that may represent an active beat (regular or accent) or a rest.

## 2. Global AudioEngine & Metronome Component Interaction

- **Global AudioEngine**:  
  - Provided via a React Context (e.g., `AudioEngineContext`).
  - Manages the AudioContext, gain control, and preloaded click sounds (e.g., `click.wav` and `clickAccent.wav`).
  - Uses a Web Worker to generate precise tick events based on the BPM.
  - Exposes methods to trigger sound playback on each tick.

- **Metronome Component**:  
  - Consumes the AudioEngine from the global provider.
  - Sets the BPM and initiates the timing worker.
  - Tracks the current beat position across measures.
  - Sends the appropriate sound (or rest) to the AudioEngine based on the current note.

## 3. Modeling the Beats: Measures and Notes

### Note Object
- **Definition**: Represents an individual beat within a measure.
- **Properties**:
  - **Type**: Indicates whether the note is a regular click, an accent, or a rest.
  - **Note Value**: Defines the beat value (e.g., quarter note, eighth note, etc.) as determined by the measure’s time signature.
  - **Animation State**: Optionally stores information used for triggering visual animations.

### Measure Collection
- **Definition**: A Measure is a unit of time defined by a time signature (e.g., 4/4, 3/4) containing an ordered array of Note objects.
- **Structure**:
  - Each Measure has its own time signature.
  - It is populated with Note objects corresponding to the beats (or rests) as defined by the signature.
- **Usage**:
  - The metronome maintains a collection (an array) of these measures.
  - On each tick, the metronome cycles through this array (and, within each measure, through its Note objects) to determine the current note.

## 4. Interaction Flow

1. **Initialization**:
   - The Metronome component retrieves the global AudioEngine instance.
   - AudioEngine loads and caches the necessary click sounds.
   - The metronome sets the BPM and initializes its collection of measures based on the desired rhythm.

2. **Starting the Metronome**:
   - The metronome component starts the AudioEngine’s worker timer.
   - The worker emits tick events at precise intervals according to the BPM.

3. **Processing Each Tick**:
   - For each tick event:
     - The Metronome component determines the current measure and the active Note within that measure.
     - If the Note is a rest, no sound is triggered.
     - If the Note is active (regular or accent), the component sends the corresponding command to the AudioEngine to play the appropriate sound.
     - Simultaneously, the component triggers any associated visual animations (e.g., flashing or pulsing) for that Note.

4. **Cycle Through Measures**:
   - The metronome cycles through the array of measures.
   - Once a measure completes, the cycle continues with the next measure (or loops back to the first measure if needed).

## 5. Benefits of This Approach

- **Modularity**:  
  - Separating the audio logic (handled by AudioEngine) from note tracking (managed by Measures and Notes) enables cleaner, more modular code.

- **Scalability**:  
  - Supports complex rhythms by allowing multiple measures with different time signatures.
  - Facilitates the addition of advanced features such as varied note values, rests, and visual feedback.

- **Synchronization**:  
  - The use of a global AudioEngine ensures tight synchronization between the audio playback and the visual representation of beats.

## 6. Summary
- **Global AudioEngine**: Provides precise audio scheduling and playback, emitting tick events via a worker.
- **Metronome Component**: Sets BPM, starts the AudioEngine, and manages the timing by cycling through an array of measures.
- **Measures and Notes**: 
  - Measures are arrays of Note objects defined by their time signature.
  - Each Note (active or rest) determines the sound (or silence) to be played and triggers associated animations.
- **Interaction Flow**:  
  - On each tick, the metronome identifies the current Note, instructs the AudioEngine to play the corresponding sound, and triggers visual updates.

This design ensures that both audio and visual aspects of the metronome remain synchronized and flexible for future enhancements.

# Metronome Pattern Concept: Difficulty Adjustment

## Overview
In this metronome system, the user defines a pattern consisting of notes, where each note can be a **click**, **accent**, or **rest**. The user can modify the difficulty of the pattern by muting a percentage of the **click** and **accent** notes, increasing the silence while maintaining the same pattern structure. The **rest** notes are not affected by the difficulty setting as they are silent by definition.

### Key Concepts:
- **Pattern Definition:** User defines a set of measures and notes (click, accent, rest) that form the metronome pattern.
- **Difficulty Adjustment:** As the difficulty increases, the AudioEngine mutes a percentage of the **click** and **accent** notes while leaving the pattern intact.
- **Tempo Control:** The tempo of the pattern is adjustable, affecting the timing of the notes but not altering the pattern or difficulty.

---

## Pattern Definition
The user defines a metronome pattern with a series of **measures** and **notes**. Each note can have one of the following types:
- **Click:** A standard metronome click sound.
- **Accent:** A louder, accented metronome click sound.
- **Rest:** A silent beat, which does not produce any sound.

### Example Pattern:
- **Measure 1:** [Click, Accent, Rest, Click, Rest, Accent, Click]
- **Measure 2:** [Click, Rest, Click, Accent, Rest, Accent]

This pattern can be repeated continuously as the metronome runs.

---

## Difficulty Adjustment

### Algorithm:
The difficulty level of the metronome can be adjusted, which will result in the muting of a percentage of the **click** and **accent** notes. **Rest** notes are unaffected by the difficulty.

- **Level 1 (Easy):** 10% of the **click** and **accent** notes are muted.
- **Level 2 (Medium):** 20% of the **click** and **accent** notes are muted.
- **Level 3 (Hard):** 30% of the **click** and **accent** notes are muted.
- **Level 4 (Very Hard):** 40% of the **click** and **accent** notes are muted.

### Difficulty Scaling:
- The muting is applied **algorithmically**; based on the difficulty level, the system randomly selects a set percentage of notes (click and accent) to mute.
- **Muting:** A muted note will not produce any sound, but the rhythm and pattern remain unchanged.
  
---

## Tempo Control
The tempo of the pattern can be adjusted independently of the pattern itself. Changing the tempo will affect the timing of the note triggers without modifying the note structure.

- The **AudioEngine** will adjust the timing of note playback according to the **BPM (beats per minute)** setting.
- Tempo can be increased or decreased in real-time while the metronome continues to run, with the pattern remaining constant.

---

## AudioEngine Handling

The **AudioEngine** is responsible for:
1. **Loading Sounds:** Loading click, accent, and other sound assets into memory.
2. **Note Playback:** Triggering the correct sound (click or accent) based on the current note type and difficulty.
3. **Handling Difficulty:** When the difficulty changes, the AudioEngine will mute a percentage of the click and accent notes without altering the pattern.
4. **Tempo Adjustment:** When the tempo changes, the AudioEngine will adjust the timing between note triggers accordingly.

---

## User Interaction Flow

1. **Pattern Definition:**
   - The user creates a pattern with a set of measures and notes.
   - Each note is assigned a click, accent, or rest type.

2. **Start Metronome:**
   - Once the pattern is defined, the user starts the metronome, and the pattern loops continuously.
   - AudioEngine plays the defined sounds based on the note types (click, accent, rest).

3. **Adjust Difficulty:**
   - The user can increase or decrease the difficulty level, which affects the percentage of notes that are muted (click and accent).
   - The muted notes will remain silent, but the pattern structure (click, accent, rest) stays the same.

4. **Adjust Tempo:**
   - The user can adjust the tempo (BPM), which affects the timing between notes but does not alter the pattern or difficulty settings.

---

## Notes
- The **muting algorithm** for difficulty adjustment needs to be carefully designed. It could involve randomly selecting a set of notes to mute based on the difficulty level or muting certain beats on a fixed schedule (e.g., every nth note).
- The **AudioEngine** should be able to dynamically mute notes based on the current difficulty setting while ensuring seamless playback without skipping beats or creating inconsistencies.
- The **pattern** is static in terms of note types but dynamic in terms of how the audio is handled (muted or sounding notes).

---

## Conclusion

- **Pattern stays constant:** The user defines the pattern once, and it remains the same.
- **Difficulty adjusts the audio output:** Increasing difficulty mutes a percentage of the sounding notes (click and accent), creating more silence but keeping the pattern's structure.
- **Tempo is adjustable independently:** The tempo affects timing, but not the note structure or difficulty level.

The system provides an engaging metronome experience with interactive elements and difficulty scaling while preserving rhythm integrity.


