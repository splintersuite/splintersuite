const pause = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const periodToMs = (period) => {
    const msPerHour = 3600000;
    const hours = Math.round(24 / period);
    return hours * msPerHour;
};

export default {
    pause,
    periodToMs,
};
