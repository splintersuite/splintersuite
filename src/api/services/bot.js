import moment from 'moment';

import store from '../../store';

const start = async () => {
    console.log('BOT: start rentals');
};

const stop = async () => {
    console.log('BOT: stop rentals');
};

const getActive = () => {
    return store.get('bot.active');
};

const setActive = (active) => {
    return store.set('bot.active', active);
};

const getSettings = async () => {
    return store.get('bot.settings');
};

const setSettings = (settings) => {
    return store.set('bot.settings', settings);
};

const getStats = async () => {
    const stats = await store.get('bot.stats');
    // stats.startedAt = moment(stats.startedAt);
    // stats.startedAt = moment(stats.startedAt);
    return stats;
};

const setStats = (stats) => {
    stats.startedAt = moment(stats.startedAt).format();
    return store.set('bot.stats', stats);
};

export default {
    start,
    stop,
    getActive,
    setActive,
    getSettings,
    setSettings,
    getStats,
    setStats,
};
