'use strict';
const _ = require('lodash');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';

const handleListingsTooHigh = ({
    currentPriceStats,
    listingPrice,
    isClBcxModern,
}) => {
    try {
        // https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript
        if (isClBcxModern) {
            return listingPrice;
        }
        if (currentPriceStats || listingPrice) {
            return null;
        }

        const allOpenTrades = currentPriceStats[ALL_OPEN_TRADES];
        const recentTrades = currentPriceStats[TRADES_DURING_PERIOD];

        const maxHigh = _.max([allOpenTrades.high, recentTrades.high]);
        const ceilingPrice = _.min([maxHigh, listingPrice]);

        return ceilingPrice;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/listings/handleListingsTooHigh error: ${err.message}`,
        });
        throw err;
    }
};

// const getListingPrice = {
//     lowestListingPrice,
//     highestListingPrice,
//     numListings,
//     currentPriceStats,
//     isClBcxModern,
// };

module.exports = { handleListingsTooHigh };
