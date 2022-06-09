import util from '../util';
import botService from '../services/bot';

const start = async (event) => {
    botService.start();
    return util.success();
};

const stop = async (event) => {
    botService.stop();
    return util.success();
};

export default {
    start,
    stop,
};
