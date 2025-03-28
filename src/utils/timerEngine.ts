import { getIntervalFromBpm } from "@/utils";

class TimerEngine extends EventTarget {
  private bpm: number;
  private frameId: number | null;
  private startTime: number;
  private elapsedTime: number;

  constructor() {
    super();
    this.bpm = 60;
    this.frameId = null;
    this.startTime = 0;
    this.elapsedTime = 0;

    this.beatTick = this.beatTick.bind(this);
  }

  start(): void {
    this.stop(); // clears frameId in case of restart
    this.frameId = requestAnimationFrame(this.beatTick);
  }

  stop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  updateBPM(bpm: number): void {
    this.bpm = bpm
  }

  private beatTick(timestamp: number): void {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    const timeDelta = timestamp - this.startTime;
    this.elapsedTime += timeDelta;

    if (this.elapsedTime >= getIntervalFromBpm(this.bpm)) {
      const event = new CustomEvent('metronome:tick');
      document.dispatchEvent(event);
      this.elapsedTime = 0;
    }

    this.startTime = timestamp;
    this.frameId = requestAnimationFrame(this.beatTick);
  }
}

export const timerInstance = new TimerEngine();
// Usage example:
// const timer = new TimerEngine(120); // 120 BPM
// timer.start();

// To stop the timer:
// timer.stop();
