import moment from 'moment';

const periodToMs = (period) => {
    const msPerHour = 3600000;
    const hours = Math.round(24 / period);
    return hours * msPerHour;
};

// assuming we are running NOW
const getNextRunTime = (durationInMS) => {
    console.log(
        'new Date().getTime() + durationInMS',
        new Date().getTime() + durationInMS
    );
    return new Date().getTime() + durationInMS;
};

const getHours = (duration) => moment.duration(duration).asHours();

export default {
    periodToMs,
    getHours,
    getNextRunTime,
};
