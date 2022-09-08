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

        // if (
        //     isClBcxModern &&
        //     ((Number.isFinite(openTrades?.avg) &&
        //         Number.isFinite(openTrades?.stdDev)) ||
        //         (Number.isFinite(tradesDuringPeriod?.avg) &&
        //             Number.isFinite(tradesDuringPeriod?.stdDev)))
        // ) {

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
                    _.max([
                        openTrades?.avg + 2 * openTrades?.stdDev,
                        tradesDuringPeriod?.avg +
                            2 * tradesDuringPeriod?.stdDev,
                    ]),
                    _.max([
                        openTrades?.median + 2 * openTrades?.stdDev,
                        tradesDuringPeriod?.median +
                            2 * tradesDuringPeriod?.stdDev,
                    ]),
                    lowestListingPrice,
                ]);
            } else {
                return _.max([
                    _.max([
                        openTrades?.avg + 1.75 * openTrades?.stdDev,
                        tradesDuringPeriod?.avg +
                            1.75 * tradesDuringPeriod?.stdDev,
                    ]),
                    _.max([
                        openTrades?.median + 1.75 * openTrades?.stdDev,
                        tradesDuringPeriod?.median +
                            1.75 * tradesDuringPeriod?.stdDev,
                    ]),
                    lowestListingPrice,
                ]);
            }
        }

        const bestHigh =
            Number.isFinite(tradesDuringPeriod?.high) &&
            tradesDuringPeriod?.high > openTrades?.high
                ? tradesDuringPeriod?.high
                : openTrades?.high;

        if (numListings <= 4) {
            // there are 6 or less listings currently for the card
            if (openTrades?.volume >= numListings) {
                if (daysTillEOS < 11) {
                    return _.max([
                        _.max([
                            openTrades?.avg + openTrades?.stdDev * 1.5,
                            tradesDuringPeriod?.avg +
                                1.5 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            openTrades?.median + 1.5 * openTrades?.stdDev,
                            tradesDuringPeriod?.median +
                                1.5 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            bestHigh - openTrades?.stdDev,
                            bestHigh - tradesDuringPeriod?.stdDev,
                        ]),
                        lowestListingPrice,
                    ]);
                } else {
                    return _.max([
                        _.max([
                            openTrades?.avg + openTrades?.stdDev * 1,
                            tradesDuringPeriod?.avg +
                                1 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            openTrades?.median + 1 * openTrades?.stdDev,
                            tradesDuringPeriod?.median +
                                1 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            bestHigh - 1.5 * openTrades?.stdDev,
                            bestHigh - 1.5 * tradesDuringPeriod?.stdDev,
                        ]),
                        lowestListingPrice,
                    ]);
                }
            } else {
                if (daysTillEOS < 11) {
                    return _.max([
                        _.max([
                            openTrades?.avg + openTrades?.stdDev * 0.75,
                            tradesDuringPeriod?.avg +
                                0.75 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            openTrades?.median + 0.75 * openTrades?.stdDev,
                            tradesDuringPeriod?.median +
                                0.75 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            bestHigh - 1.75 * openTrades?.stdDev,
                            bestHigh - 1.75 * tradesDuringPeriod?.stdDev,
                        ]),
                        lowestListingPrice,
                    ]);
                } else {
                    return _.max([
                        _.max([
                            openTrades?.avg + openTrades?.stdDev * 0.25,
                            tradesDuringPeriod?.avg +
                                0.25 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            openTrades?.median + 0.25 * openTrades?.stdDev,
                            tradesDuringPeriod?.median +
                                0.25 * tradesDuringPeriod?.stdDev,
                        ]),
                        _.max([
                            bestHigh - 2 * openTrades?.stdDev,
                            bestHigh - 2 * tradesDuringPeriod?.stdDev,
                        ]),
                        lowestListingPrice,
                    ]);
                }
            }
        }

        if (Number.isFinite(daysTillEOS) && daysTillEOS < 11) {
            return _.max([
                openTrades?.avg + openTrades?.stdDev,
                tradesDuringPeriod?.avg + tradesDuringPeriod?.stdDev,
                openTrades?.median + openTrades?.stdDev,
                tradesDuringPeriod?.median + tradesDuringPeriod?.stdDev,
                lowestListingPrice,
            ]);
        } else {
            return _.max([
                openTrades?.avg,
                tradesDuringPeriod?.avg,
                openTrades?.median,
                tradesDuringPeriod?.median,
                lowestListingPrice,
            ]);
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/listings/getListingPrice error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = { handleListingsTooHigh, getListingPrice };
