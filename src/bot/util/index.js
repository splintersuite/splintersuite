import moment from 'moment';

const periodToMs = (period) => {
    const msPerHour = 3600000;
    const hours = Math.round(24 / period);
    return hours * msPerHour;
};

const getHours = (duration) => moment.duration(duration).asHours();

export default {
    periodToMs,
    getHours,
};
