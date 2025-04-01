# `TempoTrainer` Component

The `TempoTrainer` component is a React component that provides a gamified experience for users to train their sense of tempo. It allows users to match a randomly selected tempo (BPM) and gain or lose points based on their accuracy.

---

## Tempos

### Tempo Markings

Using the number values from standardized set.

#### Metronome Stops

  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 142, 148, 152, 160, 168, 176, 184, 192, 200, 208

### Tempo Ranges

Using a generalized set of markings, leaving out the minor variations.

Used for gouping in the interface and difficulty level

#### Apprentice (Revised)

- **Largo** – slowly (40–72 BPM)
- **Andante** – at a walking pace (76–104 BPM)
- **Moderato** – moderately (108–116 BPM)
- **Allegro** – fast, quickly and bright (120–176 BPM) 
- **Presto** – very quickly (184–208 BPM)

#### Apprentice

- **Largo** – slowly (40–63 BPM)
- **Adagio** – slow and stately (66–72 BPM)
- **Andante** – at a walking pace (76–104 BPM)
- **Moderato** – moderately (108–116 BPM)
- **Allegro** – fast, quickly and bright (120–152 BPM) 
- **Vivace** – lively and fast (160–176 BPM)
- **Presto** – very quickly (184–208 BPM)

[Wikipedia](https://simple.wikipedia.org/wiki/Tempo)
Basic tempo markings

From slowest to fastest:

- **Larghissimo** – extremely slow (24 BPM and under)
- **Grave** – slow and solemn (25–45 BPM)
- **Lento** – very slow (40–60 BPM)
- **Largo** – slowly (45–60 BPM)
- **Larghetto** – quite broadly (60–69 BPM)
- **Adagio** – slow and stately (66–76 BPM)
- **Adagietto** – quite slow (72–76 BPM)
- **Andante** – at a walking pace (76–108 BPM)
- **Andantino** – quite faster than andante (but some cases it means a bit slower than andante) (80–108 BPM)
- **Moderato** – moderately (98–112 BPM)
- **Allegretto** – by the mid-19th century, moderately fast (102–110 BPM)
- **Allegro** – fast, quickly and bright (120–156 BPM) (**molto allegro** is slightly faster than allegro, but always in its range; 124-156 BPM).
- **Vivace** – lively and fast (156–176 BPM)
- **Vivacissimo** – very fast and lively (172–176 BPM)
- **Allegrissimo** – very fast (172–176 BPM)
- **Presto** – very quickly (168–200 BPM)
- **Prestissimo** – extremely fast, even faster than presto (200 BPM and over)

## Features

- **Random Tempo Selection**: The trainer selects a random tempo from predefined ranges.
- **User Interaction**: Users can select a tempo to match the trainer's tempo.
- **Point System**: Points are awarded or deducted based on the user's accuracy.
- **Skill Levels**: Users progress through skill levels (Beginner, Intermediate, Advanced, Professional) based on their points.
- **Audio Feedback**: Plays a sound on each tick of the metronome.
- **Keyboard Interaction**: Supports spacebar key press to simulate button clicks.

---

## Props

This component does not accept any props. It relies on hooks and state management for its functionality.

---

## State and Hooks

### Local State
- `trainerSelectedStopIndex`: The index of the randomly selected tempo by the trainer.
- `userSelectedStopIndex`: The index of the tempo selected by the user.
- `isNewAttempt`: A boolean indicating whether the user is in a new training attempt.
- `pointDifference`: A string showing the difference in points after a user's selection.

### Hooks
- `useAudioStore`: Provides audio-related functionality such as playing sounds and resuming the audio context.
- `useTempoTrainerStore`: Manages the user's points and provides methods to increment or decrement points.
- `useSimulateButtonEvents`: Simulates button clicks for keyboard interaction.
- `useKeyPress`: Handles key press events.
- `useTimer`: Manages the metronome timer.

---

## Functions

### `handleTrainingStart`
Starts a new training session by:
1. Resuming the audio context.
2. Setting up a new attempt.
3. Selecting a random tempo for the trainer.
4. Starting the timer with the selected tempo.

### `handleTempoPick`
Handles the user's tempo selection:
1. Stops the timer.
2. Calculates the accuracy of the user's selection compared to the trainer's tempo.
3. Updates the user's points based on the accuracy.

### `handleTick`
Plays the default sound on each tick of the metronome.

### `getTempoStopGroupListItems`
Generates a list of tempo stop buttons for a given range of tempos.

### `getRangeGroup`
Creates a group of tempo stops with a title.

### `getSkillLevelString`
Determines the user's skill level based on their points.

### `getSkillLevelRange`
Calculates the range of acceptable accuracy for the user's skill level.

### `getAbsoluteDistanceBetweenMetronomeStops`
Calculates the absolute difference between the trainer's tempo and the user's selected tempo.

---

## Effects

### `React.useEffect(() => timer.subscribe(handleTick), [])`
Subscribes to the timer to play a sound on each tick.

### `React.useEffect(() => keyPress('Space', simulateClick), [keyPress])`
Handles the spacebar key press to simulate button clicks.

---

## Rendered Output

### Layout
- **Heading**: Displays the title "Tempo Trainer".
- **Status Section**:
  - Displays the user's skill level.
  - Displays the user's points and the point difference after a selection.
- **Tempo Ranges**:
  - Groups of tempo stops categorized by tempo ranges (e.g., Largo, Andante, Moderato, Allegro, Presto).
- **Train Button**:
  - Starts a new training session.

---

## Example Usage

The `TempoTrainer` component is self-contained and does not require props. It can be used directly in a parent component:

```tsx
import TempoTrainer from '@/components/TempoTrainer/TempoTrainer';

function App() {
  return (
    <div>
      <TempoTrainer />
    </div>
  );
}
```

---

## Dependencies

- **Hooks**:
  - `useAudioStore`
  - `useTempoTrainerStore`
  - `useSimulateButtonEvents`
  - `useKeyPress`
  - `useTimer`
- **Utilities**:
  - `metronomeStops` (an array of predefined tempo stops).
- **Components**:
  - `Button`
  - `NoTranslate`
  - `PageHeading`

---

## CSS Classes

- `.tempo-trainer`: Main container for the component.
- `.tempo-trainer-content`: Wrapper for the content.
- `.status`: Displays the user's skill level and points.
- `.tempo-range-group`: Groups of tempo stops.
- `.tempo-range-title`: Title for each tempo range group.
- `.tempo-range-list`: List of tempo stop buttons.
- `.trainer-picked`: Highlights the trainer's selected tempo.
- `.user-picked`: Highlights the user's selected tempo.
- `.point-difference`: Displays the point difference after a selection.

---

## Notes

- The component uses predefined tempo ranges (`Largo`, `Andante`, `Moderato`, `Allegro`, `Presto`) to categorize tempos.
- The point system is designed to encourage accuracy and penalize large deviations.
- The component integrates with the `useTimer` hook to manage the metronome functionality.

---

## Future Improvements

- Add animations for tempo selection feedback.
- Provide visual indicators for the trainer's tempo during the training session.
- Allow customization of tempo ranges and point system through props or configuration.

---

## Conclusion

The `TempoTrainer` component is a feature-rich tool for practicing tempo recognition and accuracy. It combines audio feedback, a point-based system, and skill progression to create an engaging user experience.