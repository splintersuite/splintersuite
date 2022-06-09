import util from '../util';
import botService from '../services/bot';

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

const getSettings = async (event) => {
    const settings = botService.getSettings();
    return util.success({ settings });
};

const updateSettings = async (event, payload) => {
    const settings = botService.setSettings(payload);
    return util.success({ settings });
};

export default {
    start,
    stop,
    getSettings,
    updateSettings,
};
