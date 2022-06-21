import moment from 'moment';
import log from 'electron-log';

export const wrap = (fn, name) => {
    return async (event, payload) => {
        const now = moment().format('DD/MM/YYYY HH:mm:ss Z');
        try {
            log.info(`[${now}] ${name}`);
            return await fn(event, payload);
        } catch (error) {
            log.error(`[${now}] `, error);
        }
    };
};

export default wrap;
