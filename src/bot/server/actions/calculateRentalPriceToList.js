'use strict';
const _ = require('lodash');
const { cardRarity } = require('./cardRarity');
const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';

// this requires the object that has key = level, value [ array of cards with level = key]
const calculateRentalPriceToList = async ({ collectionObj, marketPrices }) => {
    try {
        const rentalPriceForEachCardUid = [];
        const cardsUnableToFindPriceFor = [];

        // sorts through the collectionObj that has key = level, value = [array of cards that's level = key]
        for (const level in collectionObj) {
            // should be a max of 10 possible times we can go through this because max lvl is 10

            // aggregate rental price data for cards of the level
            const groupedRentalsList = await getGroupedRentalsForLevel({
                level,
            });

            const searchableRentList =
                convertForRentGroupOutputToSearchableObject({
                    groupedRentalsList,
                });

            for (const card of collectionObj[level]) {
                const rentalPriceForUid =
                    addPriceListInformationForEachCardByUid({
                        card,
                        searchableRentList,
                        level,
                        marketPrices,
                    });
                if (rentalPriceForUid[1] === 'N') {
                    cardsUnableToFindPriceFor.push(rentalPriceForUid);
                } else {
                    rentalPriceForEachCardUid.push(rentalPriceForUid);
                }
            }
        }
        // TNT TODO: find new price data for the cards in cardsUnableToFindPriceFor
        return rentalPriceForEachCardUid;
    } catch (err) {
        window.api.bot.log({
            message: err.message,
        });
        console.error(`calculateRentalPriceToList error: ${err.message}`);
        throw err;
    }
};

const addPriceListInformationForEachCardByUid = ({
    card,
    searchableRentList,
    level,
    marketPrices,
}) => {
    try {
        const { card_detail_id, gold, edition, uid } = card;
        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData = searchableRentList[rentListKey];

        if (
            currentPriceData == null ||
            currentPriceData.low_price == null ||
            _.isEmpty(currentPriceData)
        ) {
            if (marketPrices[marketKey] != null) {
                const openTrades = marketPrices[marketKey][ALL_OPEN_TRADES];
                const allTrades = marketPrices[marketKey][TRADES_DURING_PERIOD];
                const maxHigh = _.max([openTrades.high, allTrades.high]);
                const rentalPrice = [uid, parseFloat(maxHigh)];
                return rentalPrice;
            } else {
                const rentalNotFoundForCard = [uid, 'N'];
                return rentalNotFoundForCard;
            }
        }
        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;

        // JBOXXX NOTE: this is where TNT gets the low price
        // SOME MATH HERE
        let listingPrice;
        if (marketPrices[marketKey] != null) {
            listingPrice = getListingPrice({
                card_detail_id,
                lowestListingPrice: parseFloat(currentPriceData.low_price),
                numListings: currentPriceData.qty,
                currentPriceStats: marketPrices[marketKey],
            });
            listingPrice = handleListingsTooHigh({
                currentPriceStats: marketPrices[marketKey],
                listingPrice,
            });
        } else {
            listingPrice = parseFloat(currentPriceData.low_price);
        }

        const rentalPriceForUid = [
            uid,
            parseFloat(currentPriceData.low_price) > listingPrice
                ? currentPriceData.low_price
                : `${listingPrice}`,
        ];

        return rentalPriceForUid;
    } catch (err) {
        window.api.bot.log({
            message: err.message,
        });
        console.error(
            `addPriceListInformationForEachCardByUid error: ${err.message}`
        );
        throw err;
    }
};

const handleListingsTooHigh = ({ currentPriceStats, listingPrice }) => {
    console.log(`'handleListingsTooHigh start`);
    if (currentPriceStats === undefined) {
        return null;
    }

    const { avg, stdDev, high } = currentPriceStats[ALL_OPEN_TRADES];
    const {
        avg: recentAvg,
        stdDev: recentStdDev,
        high: recentHigh,
    } = currentPriceStats[TRADES_DURING_PERIOD];

    const maxHigh = _.max([recentHigh, high]);
    if (Number.isFinite(maxHigh) && listingPrice > maxHigh) {
        const twoStdAboveMean =
            Number.isFinite(avg) && Number.isFinite(stdDev)
                ? avg + stdDev * 2
                : NaN;
        if (
            Number.isFinite(twoStdAboveMean) &&
            listingPrice > twoStdAboveMean
        ) {
            return _.max([twoStdAboveMean, recentAvg + recentStdDev * 2]);
        } else {
            return maxHigh;
        }
    } else {
        return listingPrice;
    }
};

const getListingPrice = ({
    card_detail_id,
    lowestListingPrice,
    numListings,
    currentPriceStats,
}) => {
    if (currentPriceStats === undefined) {
        return null;
    }
    const { avg, low, stdDev, volume, median, high } =
        currentPriceStats[ALL_OPEN_TRADES];
    const {
        avg: recentAvg,
        stdDev: recentStdDev,
        median: recentMedian,
        low: recentLow,
        high: recentHigh,
    } = currentPriceStats[TRADES_DURING_PERIOD];

    const bestLow =
        Number.isFinite(recentLow) && recentLow > low ? recentLow : low;

    // handling for uncommon legies like Epona, id = 297
    if (numListings < 5) {
        // if max only 3 are listed
        // tames idea implemented below... find a reasonable price to list
        return _.max([
            _.max([avg + stdDev, recentAvg + recentStdDev]),
            lowestListingPrice,
            bestLow,
        ]);
    }

    // handling for super high listings that are HIGHER than the max high
    // no point in listing here...
    const maxHigh = _.max([recentHigh, high]);
    if (Number.isFinite(maxHigh) && lowestListingPrice > maxHigh) {
        const twoStdAboveMean =
            Number.isFinite(avg) && Number.isFinite(stdDev)
                ? avg + stdDev * 2
                : NaN;
        if (
            Number.isFinite(twoStdAboveMean) &&
            lowestListingPrice > twoStdAboveMean
        ) {
            return _.max([twoStdAboveMean, recentAvg + recentStdDev * 2]);
        } else {
            return maxHigh;
        }
    }

    if (
        Number.isFinite(volume) &&
        volume > 3 &&
        numListings > 5 &&
        (Number.isFinite(median) || Number.isFinite(recentMedian)) &&
        Number.isFinite(lowestListingPrice)
    ) {
        if (lowestListingPrice < _.max([median, recentMedian])) {
            // if the median is higher than the lowest listing
            // return the median
            return _.max([recentMedian, median]);
        } else if (Number.isFinite(avg) && Number.isFinite(stdDev)) {
            // if average and standard deviation are defined
            // and the lowestListing is higher than the medians
            return _.max([lowestListingPrice, avg + stdDev]);
        } else {
            // no average and no standard deviation
            return _.max([lowestListingPrice, recentMedian, median]);
        }
    }

    // call priceWithoutMedian afterwards... basically chooses the low carefully
    return priceWithoutMedian({
        card_detail_id,
        lowestListingPrice,
        numListings,
        currentPriceStats,
    });
};

const priceWithoutMedian = ({
    card_detail_id,
    lowestListingPrice,
    numListings,
    currentPriceStats,
}) => {
    if (currentPriceStats === undefined) {
        return lowestListingPrice;
    }
    const { avg, low, stdDev, volume } = currentPriceStats[ALL_OPEN_TRADES];
    const { low: recentLow } = currentPriceStats[TRADES_DURING_PERIOD];

    // handle for recent prices being higher than before
    const bestLow =
        Number.isFinite(recentLow) && recentLow > low ? recentLow : low;

    // handling for uncommon legies like Epona, id = 297
    if (cardRarity[card_detail_id] === 4 && numListings < 4) {
        // is legie and at max only 3 are listed
        // tames idea implemented below... find a reasonable price to list
        return _.max([avg - stdDev, lowestListingPrice, bestLow]);
    }

    // general logic
    // this is bare bones logic that should ideally not hinder returns and fetch better prices
    if (
        Number.isFinite(avg) &&
        Number.isFinite(stdDev) &&
        Number.isFinite(bestLow) &&
        Number.isFinite(lowestListingPrice) &&
        stdDev > 0 &&
        volume >= 10 // should really be using 25 here to assume normal distribution
    ) {
        const zScoreOfListing = Math.abs(lowestListingPrice - avg) / stdDev;
        const zScoreOfLowestTrade = Math.abs(bestLow - avg) / stdDev;

        if (zScoreOfLowestTrade > 1.5 && lowestListingPrice > bestLow) {
            // scenario #1.
            // The lowest trade is actually very far away from the average
            // we probably want to list closer to the average
            // but we should probably be hitting the api for that card's listings for more clarity
            return lowestListingPrice;
        }

        // scenario #2 (the most likely)
        // the lowest offer is 2 standard deviations away from the avg
        // and the low is greater than the lowestlisting
        // handle for listings at like 0.1
        if (zScoreOfListing > 1.5 && bestLow >= lowestListingPrice) {
            // we probably want to wait before listing
            // alternatively we can list at the recent lowest trade
            return bestLow;
        }
    }
    // final catch all
    if (lowestListingPrice > bestLow) {
        return lowestListingPrice;
    } else {
        return bestLow;
    }
};

const getAvg = ({ currentPriceStats }) => {
    const { avg } = currentPriceStats[ALL_OPEN_TRADES];
    const { avg: recentAvg } = currentPriceStats[TRADES_DURING_PERIOD];

    // handle for recent prices being higher than before
    if (Number.isFinite(avg) && Number.isFinite(recentAvg)) {
        return avg > recentAvg ? avg : recentAvg;
    } else if (Number.isFinite(avg)) {
        return avg;
    } else if (Number.isFinite(recentAvg)) {
        return recentAvg;
    }
    return null;
};

module.exports = {
    calculateRentalPriceToList,
    getListingPrice,
    getAvg,
    handleListingsTooHigh,
};
