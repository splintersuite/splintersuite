import moment from 'moment';
import fs from 'fs';
import store from '../../store';

const start = async () => {};

const stop = async () => {};

const getActive = () => {
    return store.get('bot.active');
};

const setActive = (active) => {
    return store.set('bot.active', active);
};

const getSettings = () => {
    return store.get('bot.settings');
};

const setSettings = (settings) => {
    return store.set('bot.settings', settings);
};

const getStats = () => {
    return store.get('bot.stats');
};

const setStats = (stats) => {
    stats.startedAt = moment(stats.startedAt).format();
    return store.set('bot.stats', stats);
};

const getRentalDetails = () => {
    console.log('/src/api/services/getRentalDetails');
    return store.get('bot.getRentalDetails');
};

const setRentalDetails = (rentalDetails) => {
    return store.set('bot.setRentalDetails', rentalDetails);
};

const getLoading = () => {
    return store.get('bot.isLoading');
};

const setLoading = (isLoading) => {
    return store.set('bot.isLoading', isLoading);
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
    getLoading,
    setLoading,
    getRentalDetails,
    setRentalDetails,
};
