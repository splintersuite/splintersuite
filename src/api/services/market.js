import store from '../../store';
import axios from '../util/axios';

const setMarketPrices = async ({ marketPrices, timeOfLastFetch }) => {
    return store.set('market.prices', {
        marketPrices,
        fetchTime: timeOfLastFetch,
    });
};

const fetchMarketPrices = async () => {
    const {
        data: { currentPrices, timeOfLastFetch },
    } = await axios.get(`${process.env.API_URL}/api/market/current_prices`);
    return { currentPrices, timeOfLastFetch };
};

const getMarketPrices = async () => {
    let priceData = store.get('market.prices');

    // is there data? if so is it data from more than 12 hours ago?
    if (
        !priceData?.fetchTime ||
        priceData.fetchTime < new Date().getTime() - 1000 * 60 * 60 * 12 ||
        Object.keys(priceData?.marketPrices).length < 75
    ) {
        const { currentPrices, timeOfLastFetch } = await fetchMarketPrices();
        setMarketPrices({ marketPrices: currentPrices, timeOfLastFetch });
        return currentPrices; // used elsewhere as marketPrices
    } else {
        return priceData.marketPrices;
    }
};

export default {
    setMarketPrices,
    fetchMarketPrices,
    getMarketPrices,
};
