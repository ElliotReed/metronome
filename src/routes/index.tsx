import { createFileRoute } from '@tanstack/react-router'

import Metronome from '@/components/Metronome';

export const Route = createFileRoute('/')({
  component: Metronome,
})