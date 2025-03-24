import { useEffect, useRef } from 'react';

type KeyPressFunction = (keys: string[] | string, handler: (event: KeyboardEvent) => void, eventType?: 'keydown' | 'keyup') => void;

export function useKeyPress(): KeyPressFunction {
    const keyDownHandlers = useRef(new Map<string, (event: KeyboardEvent) => void>());
    const keyUpHandlers = useRef(new Map<string, (event: KeyboardEvent) => void>());

    const registerKeyPress: KeyPressFunction = (keys, handler, eventType = 'keydown') => {
        const keyArray = Array.isArray(keys) ? keys : [keys];
        const handlers = eventType === 'keydown' ? keyDownHandlers : keyUpHandlers;
        keyArray.forEach((key) => handlers.current.set(key, handler));
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Tab') {
                // Don't prevent the default behavior for the Tab key
                return; // Let tabbing proceed naturally
            }
            event.preventDefault();
            const handler = keyDownHandlers.current.get(event.code);
            if (handler) handler(event);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Tab') {
                // Don't prevent the default behavior for the Tab key
                return; // Let tabbing proceed naturally
            }
            event.preventDefault();
            const handler = keyUpHandlers.current.get(event.code);
            if (handler) handler(event);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return registerKeyPress;
}
