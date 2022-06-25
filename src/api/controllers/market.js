import util from '../util';
import marketService from '../services/market';

const getMarketPrices = async () => {
    const marketPrices = await marketService.getMarketPrices();

    return util.success({ marketPrices });
};

export default { getMarketPrices };
