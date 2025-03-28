let timerId: ReturnType<typeof setInterval> | null = null;

self.onmessage = function (e: MessageEvent) {
    // Clear any existing interval
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }

    // Handle stop message
    if (e.data === 'stop') {
        return;
    }

    // Start new interval if interval is provided
    if (typeof e.data === 'object' && e.data.interval) {
        timerId = setInterval(() => {
            self.postMessage('tick');
        }, e.data.interval);
    }
};