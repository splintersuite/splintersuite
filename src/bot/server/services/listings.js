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
        if (!listingPrice) {
            return null;
        }

        if (isClBcxModern) {
            return listingPrice;
        }

        if (!currentPriceStats) {
            return listingPrice;
        }

        const allOpenTrades = currentPriceStats[ALL_OPEN_TRADES];
        const recentTrades = currentPriceStats[TRADES_DURING_PERIOD];

        const maxHigh = _.max([allOpenTrades?.high, recentTrades?.high]);
        const ceilingPrice = _.min([maxHigh, listingPrice]);

        return ceilingPrice;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/listings/handleListingsTooHigh error: ${err.message}`,
        });
        throw err;
    }
};

const getListingPrice = ({
    daysTillEOS,
    lowestListingPrice,
    numListings,
    currentPriceStats,
    isClBcxModern,
}) => {
    try {
        if (!currentPriceStats) {
            return null;
        }
        const openTrades = currentPriceStats[ALL_OPEN_TRADES];
        const tradesDuringPeriod = currentPriceStats[TRADES_DURING_PERIOD];

        const bests = getBests({ tradesDuringPeriod, openTrades });
        if (
            isClBcxModern &&
            ((Number.isFinite(openTrades?.avg) &&
                Number.isFinite(openTrades?.stdDev)) ||
                (isClBcxModern &&
                    Number.isFinite(tradesDuringPeriod?.avg) &&
                    Number.isFinite(tradesDuringPeriod?.stdDev)))
        ) {
            if (daysTillEOS < 11) {
                return _.max([
                    bests.bestMid + 0.25 * openTrades?.stdDev,
                    bests.bestMid + 0.25 * tradesDuringPeriod?.stdDev,
                    lowestListingPrice * 0.99,
                ]);
            } else {
                return _.max([
                    bests.bestMid + 0.25 * openTrades?.stdDev,
                    bests.bestMid + 0.25 * tradesDuringPeriod?.stdDev,
                    lowestListingPrice * 0.99,
                ]);
            }
        }

        if (
            Number.isFinite(tradesDuringPeriod?.volume) &&
            numListings <= 4 &&
            (tradesDuringPeriod?.volume >= 12 ||
                (Number.isFinite(openTrades?.volume) &&
                    openTrades?.volume >= 60 &&
                    tradesDuringPeriod?.volume / openTrades?.volume < 0.2)) // this is so if there hasn't been much volume recently, but there is a lot more volume that happened in past 48 hours than 12, we should anticipate volume will pickup, and therefore dont need price insanely conservatively
        ) {
            // This means there are few cards listed on the market, and volume is sufficient to expect that we will be able to get our stuff rented out.
            if (daysTillEOS < 9) {
                return _.max([
                    bests?.bestMid + 0.25 * openTrades?.stdDev,
                    bests?.bestMid + 0.25 * tradesDuringPeriod?.stdDev,
                    lowestListingPrice * 0.99,
                ]);
            } else {
                return _.max([
                    bests?.bestMid,
                    bests?.bestMid,
                    lowestListingPrice * 0.99,
                ]);
            }
        } else {
            if (daysTillEOS < 11) {
                return _.max([bests?.bestMid, lowestListingPrice * 0.99]);
            } else {
                const bestLows = getBestLows({
                    tradesDuringPeriod,
                    openTrades,
                });
                return _.max([lowestListingPrice * 0.99, bestLows?.lowMid]);
            }
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/listings/getListingPrice error: ${err.message}`,
        });
        throw err;
    }
};

const getBestLows = ({ tradesDuringPeriod, openTrades }) => {
    try {
        const lowAvg =
            Number.isFinite(tradesDuringPeriod?.avg) &&
            Number.isFinite(openTrades?.avg) &&
            tradesDuringPeriod?.avg > openTrades?.avg
                ? openTrades?.avg
                : tradesDuringPeriod?.avg;

        const lowMedian =
            Number.isFinite(tradesDuringPeriod?.median) &&
            Number.isFinite(openTrades?.median) &&
            tradesDuringPeriod?.median > openTrades?.median
                ? openTrades?.median
                : tradesDuringPeriod?.median;

        const lowMid =
            (Number.isFinite(tradesDuringPeriod?.median) ||
                Number.isFinite(openTrades?.median)) &&
            lowAvg > lowMedian
                ? lowMedian
                : lowAvg;

        return { lowMid, lowMedian, lowAvg };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/listings/getBestLows error: ${err.message}`,
        });
        throw err;
    }
};

const getBests = ({ tradesDuringPeriod, openTrades }) => {
    try {
        const bestLow =
            Number.isFinite(tradesDuringPeriod?.low) &&
            tradesDuringPeriod?.low > openTrades?.low
                ? tradesDuringPeriod?.low
                : openTrades?.low;

        const bestHigh =
            Number.isFinite(tradesDuringPeriod?.high) &&
            tradesDuringPeriod?.high > openTrades?.high
                ? tradesDuringPeriod?.high
                : openTrades?.high;

        const bestAvg =
            Number.isFinite(tradesDuringPeriod?.avg) &&
            tradesDuringPeriod?.avg > openTrades?.avg
                ? tradesDuringPeriod?.avg
                : openTrades?.avg;

        const bestMedian =
            Number.isFinite(tradesDuringPeriod?.median) &&
            tradesDuringPeriod?.median > openTrades?.median
                ? tradesDuringPeriod?.median
                : openTrades?.median;

        const bestMid =
            (Number.isFinite(bestAvg) || Number.isFinite(bestMedian)) &&
            bestAvg > bestMedian
                ? bestAvg
                : bestMedian;

        return { bestLow, bestHigh, bestAvg, bestMedian, bestMid };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/listings/getBests error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = { handleListingsTooHigh, getListingPrice };
