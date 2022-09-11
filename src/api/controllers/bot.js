import moment from 'moment';
import logg from 'electron-log';

import util from '../util';
import botService from '../services/bot';

const start = async (event) => {
    await botService.setActive(true);

    botService.start();
    return util.success();
};

const stop = async (event) => {
    botService.setActive(false);
    botService.stop();

    return util.success();
};

const getActive = async (event) => {
    const active = await botService.getActive();
    return util.success({ active });
};

const getSettings = async (event) => {
    const settings = await botService.getSettings();
    return util.success({ settings });
};

const updateSettings = async (event, payload) => {
    const { settings } = payload;

    botService.setSettings(settings);

    return util.success();
};

const getStats = async (event) => {
    const stats = await botService.getStats();
    return util.success({ stats });
};

const updateStats = async (event, payload) => {
    const { stats } = payload;

    botService.setStats(stats);

    return util.success();
};

const getLoading = async (event) => {
    const isLoading = await botService.getLoading();
    return util.success({ isLoading });
};

const updateLoading = async (event, payload) => {
    const { isLoading } = payload;

    botService.setLoading(isLoading);

    return util.success();
};

const getRentalDetails = async (event) => {
    const rentalDetails = await botService.getRentalDetails();
    return util.success({ rentalDetails });
};

const updateRentalDetails = async (event, payload) => {
    const { rentalDetails } = payload;
    botService.setRentalDetails(rentalDetails);

    return util.success();
};

const log = (event, payload) => {
    const { message } = payload;
    const now = moment().format('DD/MM/YYYY HH:mm:ss Z');
    logg.info(`[${now}] ${message}`);
};

export default {
    start,
    stop,
    getActive,
    getSettings,
    updateSettings,
    getStats,
    updateStats,
    getLoading,
    updateLoading,
    getRentalDetails,
    updateRentalDetails,
    log,
};
