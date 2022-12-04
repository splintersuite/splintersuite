import store from '../../store';
import axios from '../util/axios';

import moment from 'moment';
import logger from 'electron-log';

const setMarketPrices = async ({ marketPrices, timeOfLastFetch }) => {
    return store.set('market.prices', {
        marketPrices,
        fetchTime: timeOfLastFetch,
    });
};

const fetchMarketPrices = async () => {
    const res = await axios.get(
        `${process.env.API_URL}/api/market/current_prices`
    );

    const currentPrices = res?.data?.currentPrices;
    const timeOfLastFetch = res?.data?.timeOfLastFetch;

    const message = `fetchMarketPrices got prices for ${JSON.stringify(
        Object.keys(res?.data?.currentPrices)?.length
    )} cards`;

    const now = moment().format('DD/MM/YYYY HH:mm:ss Z');
    logger.info(`[${now}] ${message}`);
    return { currentPrices, timeOfLastFetch };
};

const getMarketPrices = async () => {
    let priceData = store.get('market.prices');

    // is there data? if so is it data from more than 12 hours ago?
    if (
        !priceData?.fetchTime ||
        priceData.fetchTime < new Date().getTime() - 1000 * 60 * 60 * 3 ||
        Object.keys(priceData?.marketPrices).length < 75
    ) {
        const { currentPrices, timeOfLastFetch } = await fetchMarketPrices();

        setMarketPrices({ marketPrices: currentPrices, timeOfLastFetch });
        return currentPrices; // used elsewhere as marketPrices
    } else {
        const message = `getMarketPrices got currentPrices from the store, number of prices:  ${JSON.stringify(
            Object.keys(priceData?.marketPrices)?.length
        )}`;
        const now = moment().format('DD/MM/YYYY HH:mm:ss Z');
        logger.info(`[${now}] ${message}`);
        return priceData.marketPrices;
    }
};

export default {
    setMarketPrices,
    fetchMarketPrices,
    getMarketPrices,
};
