import { createFileRoute } from '@tanstack/react-router'

import { useTimerPage } from '@/components/TimerTestPage';

export const Route = createFileRoute('/timer')({
    component: useTimerPage,
})


