import * as React from 'react';

import { useAudioStore } from '@/store';

import { useTimer } from '@/hooks';

import Button from '@/components/common/Button';
import { PageHeading } from '@/components/common';


export const useTimerPage = () => {
    const {
        playDefaultSound,
        scheduleAudioEvents,
        setSchedulerBpm,
        resetScheduler
    } = useAudioStore();
    const timer = useTimer();
    const [bpm, setBpm] = React.useState(120);

    const handleStop = () => {
        timer.stop();
        resetScheduler();
    }

    const handleStart = () => {
        timer.start(bpm);
        setSchedulerBpm(bpm);
    }

    const [tickCount, setTickCount] = React.useState(0);
    const handleTick = () => {
        console.log('fired');
        setTickCount((prevCount) => prevCount + 1);
        scheduleAudioEvents(playDefaultSound);
    }

    React.useEffect(() => {
        timer.subscribe(handleTick);
    }, []);

    React.useEffect(() => {
        timer.update(bpm);
        setSchedulerBpm(bpm);
    }, [bpm]);

    return (
        <div>
            <PageHeading>Timer</PageHeading>
            <Button.Default
                onClick={handleStart}
            >
                Start
            </Button.Default>
            <Button.Default
                onClick={handleStop}
            >
                Stop
            </Button.Default>
            <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
            />
            <p>Tick Count: {tickCount}</p>
        </div>
    )
}