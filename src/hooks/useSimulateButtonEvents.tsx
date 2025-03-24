import { useRef } from "react";

export const useSimulateButtonEvents = () => {
    const buttonSimulatedRef = useRef<HTMLButtonElement>(null);

    const simulatePointerDown = () => {
        const button = buttonSimulatedRef.current;
        if (!button) return;
        button.focus();
        button.classList.add("simulate-active");
        button.dispatchEvent(
            new PointerEvent("pointerdown", { bubbles: true })
        );
    };

    const simulatePointerUp = () => {
        const button = buttonSimulatedRef.current;
        if (!button) return;
        button.classList.remove("simulate-active");
        button.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    };

    const simulateClick = () => {
        const button = buttonSimulatedRef.current;
        if (!button) return;

        // Apply active styles manually
        simulatePointerDown();

        // Ensure the button's actual click event fires
        button.click();

        // Remove active state after a short delay
        setTimeout(() => simulatePointerUp(), 150);
    };

    return { buttonSimulatedRef, simulateClick, simulatePointerDown, simulatePointerUp };
};
