import store from '../../store';
import axios from '../util/axios';

const setMarketPrices = async ({ marketPrices, timeOfLastFetch }) => {
    return store.set('market.prices', {
        marketPrices,
        fetchTime: timeOfLastFetch,
    });
};

const fetchMarketPrices = async () => {
    try {
        const {
            data: { currentPrices, timeOfLastFetch },
        } = await axios.get(`${process.env.API_URL}/api/market/current_prices`);
        return { currentPrices, timeOfLastFetch };
    } catch (err) {
        console.log(`fetchMarketPrices error: ${err.message}`);
        throw err;
    }
};

const getMarketPrices = async () => {
    try {
        let priceData = store.get('market.prices');

        // is there data? if so is it data from more than 12 hours ago?
        if (
            !priceData?.fetchTime ||
            priceData.fetchTime < new Date().getTime() - 1000 * 60 * 60 * 12 ||
            Object.keys(priceData?.marketPrices).length < 75
        ) {
            const { currentPrices, timeOfLastFetch } =
                await fetchMarketPrices();
            setMarketPrices({ marketPrices: currentPrices, timeOfLastFetch });
            return currentPrices; // used elsewhere as marketPrices
        } else {
            return priceData.marketPrices;
        }
    } catch (err) {
        console.log(`getMarketPrices error: ${err.message}`);
        throw err;
    }
};

export default {
    setMarketPrices,
    fetchMarketPrices,
    getMarketPrices,
};
