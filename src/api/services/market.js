import store from '../../store';
import axios from '../util/axios';

const setMarketPrices = async (marketPrices) => {
    return store.set('market.prices', marketPrices);
};

const fetchMarketPrices = async () => {
    const { data } = await axios.get(
        `${process.env.API_URL}/market_prices/current`
    );
    return data;
};

const getMarketPrices = async () => {
    let marketPrices = store.get('market.prices');

    // is there data or data from more than 12 hours ago?
    if (
        !marketPrices?.fetch_timestamp ||
        new Date(marketPrices.fetch_timestamp) <
            new Date().getTime() - 1000 * 60 * 60 * 12
    ) {
        marketPrices = await fetchMarketPrices();
        setMarketPrices(marketPrices);
    }
    return marketPrices;
};

export default {
    setMarketPrices,
    fetchMarketPrices,
    getMarketPrices,
};
