import util from '../util';
import botService from '../services/bot';
import hiveService from '../services/hive';

const start = async (event) => {
    botService.setActive(true);
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

export default {
    start,
    stop,
    getActive,
    getSettings,
    updateSettings,
};
