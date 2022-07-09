import store from '../../store';
import axios from '../util/axios';

const setMarketPrices = async (marketPrices) => {
    return store.set('market.prices', {
        marketPrices,
        fetch_timestamp: new Date(),
    });
};

const fetchMarketPrices = async () => {
    const { data } = await axios.get(
        `${process.env.API_URL}/api/market/current_prices`
    );
    return data;
};

const getMarketPrices = async () => {
    let priceData = store.get('market.prices');

    // is there data? is so is it data from more than 12 hours ago?
    if (
        !priceData?.fetch_timestamp ||
        new Date(priceData.fetch_timestamp).getTime() <
            new Date().getTime() - 1000 * 60 * 60 * 12 ||
        Object.keys(priceData?.marketPrices).length < 75
    ) {
        const marketPrices = await fetchMarketPrices();
        setMarketPrices(marketPrices);
        return marketPrices;
    } else {
        return priceData.marketPrices;
    }
};

export default {
    setMarketPrices,
    fetchMarketPrices,
    getMarketPrices,
};
