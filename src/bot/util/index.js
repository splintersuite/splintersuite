import moment from 'moment';

const periodToMs = (period) => {
    const msPerHour = 3600000;
    const hours = Math.round(24 / period);
    return hours * msPerHour;
};

// assuming we are running NOW
const getNextRunTime = (period) => {
    const msPerHour = 3600000;
    const hours = Math.round(24 / period);
    return new Date().getTime() + hours * msPerHour;
};

const getHours = (duration) => moment.duration(duration).asHours();

export default {
    periodToMs,
    getHours,
    getNextRunTime,
};
