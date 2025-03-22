import { useEffect, useRef } from 'react';

type KeyPressFunction = (keys: string[] | string, handler: (event: KeyboardEvent) => void) => void;

export function useKeyPress(): KeyPressFunction {
    const keyHandlers = useRef(new Map<string, (event: KeyboardEvent) => void>());

    const registerKeyPress: KeyPressFunction = (keys, handler) => {
        const keyArray = Array.isArray(keys) ? keys : [keys]; // ✅ Ensure array format
        keyArray.forEach((key) => keyHandlers.current.set(key, handler));
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore Spacebar if a button is focused
            if (event.code === "Space" && document.activeElement instanceof HTMLButtonElement) {
                return; // Prevent double execution
            }
            const handler = keyHandlers.current.get(event.code);
            if (handler) handler(event);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return registerKeyPress; // ✅ Correct return
}
