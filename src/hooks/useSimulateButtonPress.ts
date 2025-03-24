// Necessary to add the active styles, which otherwise don't get applied when programatically clicking the  button.
import { useRef } from "react";

export const useSimulateButtonPress = (duration = 150) => {
    const simulatedButtonRef = useRef<HTMLButtonElement>(null);

    const simulateButtonPress = () => {
        const button = simulatedButtonRef.current;
        if (!button) return;

        // Add a temporary class that mimics :active
        //  Apply this in the css paired ith the elements :active selector
        button.classList.add("simulate-active");

        // Trigger the actual click
        button.click();

        // Remove the class after duration
        setTimeout(() => {
            button.classList.remove("simulate-active");
        }, duration);
    };

    return { simulatedButtonRef, simulateButtonPress };
};
