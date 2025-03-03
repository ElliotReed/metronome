let timerId: ReturnType<typeof setInterval> | null = null;
let interval = 100;

onmessage = function (e) {
    if (e.data === 'start') {
        if (timerId !== null) {
            clearInterval(timerId);
        }

        timerId = setInterval(function () {
            postMessage('tick');
        }, interval);
    }

    if (e.data.interval) {
        interval = e.data.interval;

        if (timerId !== null) {
            clearInterval(timerId);
        }

        timerId = setInterval(function () {
            postMessage('tick');
        }, interval);
    }

    if (e.data === 'stop') {
        clearInterval(timerId!);
        timerId = null;
    }
}
