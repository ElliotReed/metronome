import { createFileRoute } from '@tanstack/react-router'

import TempoTapper from '@/components/TempoTapper'

export const Route = createFileRoute('/tempo-tapper')({
    component: TempoTapper,
})

