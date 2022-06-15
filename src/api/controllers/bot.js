import moment from 'moment';

import util from '../util';
import botService from '../services/bot';

const start = async (event) => {
    await botService.setActive(true);
    // await botService.setStats({
    //     startedAt: moment(),
    //     numListed: 0,
    // });

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

export default {
    start,
    stop,
    getActive,
    getSettings,
    updateSettings,
    getStats,
    updateStats,
};
