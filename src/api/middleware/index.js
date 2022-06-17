import moment from 'moment';
import logger from 'electron-timber';

export const wrap = (fn, name) => {
    return async (event, payload) => {
        const now = moment().format('DD/MM/YYYY HH:mm:ss Z');
        try {
            logger.log(`[${now}] ${name}`);
            return await fn(event, payload);
        } catch (error) {
            logger.error(`[${now}] `, error);
        }
    };
};

export default wrap;
