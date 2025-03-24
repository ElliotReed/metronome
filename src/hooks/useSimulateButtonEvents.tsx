import { useRef } from "react";

export const useSimulateButtonEvents = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const simulatePointerDown = () => {
        const button = buttonRef.current;
        if (!button) return;

        button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    };

    const simulatePointerUp = () => {
        const button = buttonRef.current;
        if (!button) return;

        button.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    };

    const simulateClick = () => {
        const button = buttonRef.current;
        if (!button) return;

        // Apply active styles manually
        simulatePointerDown();

        // Ensure the button's actual click event fires
        button.click();

        // Remove active state after a short delay
        setTimeout(() => simulatePointerUp(), 150);
    };

    return { buttonRef, simulateClick, simulatePointerDown, simulatePointerUp };
};
