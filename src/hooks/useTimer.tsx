import { useEffect, useRef, useCallback } from 'react';
import { getIntervalFromBpm } from '@/utils';

export const useTimer = () => {
    const workerRef = useRef<Worker | null>(null);
    const listenersRef = useRef<(() => void)[]>([]);

    // startedRef prevents the timer from automatically starting on page load
    // It acts as a manual control flag to determine if the timer has been explicitly started
    // Without this, updates to BPM would immediately start the timer in useEffect
    const startedRef = useRef(false);

    useEffect(() => {
        workerRef.current = new Worker(new URL('@/workers/timerWorker.ts', import.meta.url), { type: 'module' });

        const handleTick = () => {
            listenersRef.current.forEach((listener) => listener());
        };

        workerRef.current.onmessage = handleTick;

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
            listenersRef.current = [];
            startedRef.current = false;
        };
    }, []);

    const start = useCallback((bpm: number) => {
        if (workerRef.current) {
            workerRef.current.postMessage({ interval: getIntervalFromBpm(bpm) });
            startedRef.current = true;
        }
    }, []);

    const stop = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.postMessage('stop');
            startedRef.current = false;
        }
    }, []);

    const update = useCallback((bpm: number) => {
        if (startedRef.current && workerRef.current) {
            workerRef.current.postMessage({ interval: getIntervalFromBpm(bpm) });
        }
    }, []);

    const subscribe = useCallback((callback: () => void) => {
        listenersRef.current.push(callback);
        return () => {
            listenersRef.current = listenersRef.current.filter((listener) => listener !== callback);
        };
    }, []);

    return { start, stop, update, subscribe };
};