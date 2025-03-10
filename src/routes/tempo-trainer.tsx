import TempoTrainer from '@/components/TempoTrainer'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tempo-trainer')({
  component: TempoTrainer,
})


