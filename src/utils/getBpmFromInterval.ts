function getIntervalFromBpm(bpm: number): number {
  return Math.floor((60 / bpm) * 1000);
}

export default getIntervalFromBpm