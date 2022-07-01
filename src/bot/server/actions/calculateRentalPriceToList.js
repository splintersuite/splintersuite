'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const { cardRarity } = require('./cardToRarity');

// this requires the object that has key = level, value [ array of cards with level = key]
const calculateRentalPriceToList = async ({ collectionObj, marketPrices }) => {
    try {
        //  console.log("calculateRentalPriceToList start");
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
                // JBOXXX NOTE:
                // need to add some pricing info here or
                // send ALL of the current data to the frontend and then just lookup
                // rather than sending a bunch of calls
                const rentalPriceForUid =
                    addPriceListInformationForEachCardByUid({
                        card,
                        level,
                        searchableRentList,
                        marketPrices,
                    });
                if (rentalPriceForUid[1] === 'N') {
                    cardsUnableToFindPriceFor.push(rentalPriceForUid);
                } else {
                    rentalPriceForEachCardUid.push(rentalPriceForUid);
                }
            }
        }

        // JBOXXX NOTE: lookup old prices for cardsUnableToFindPriceFor

        // TNT TODO: find new price data for the cards in cardsUnableToFindPriceFor
        return rentalPriceForEachCardUid;
    } catch (err) {
        console.error(`calculateRentalPriceToList error: ${err.message}`);
        throw err;
    }
};

const addPriceListInformationForEachCardByUid = ({
    card,
    level,
    searchableRentList,
    marketPrices,
}) => {
    try {
        //  console.log(`addPriceListInformationForEachCardByUid start`);

        const { card_detail_id, gold, edition, uid } = card;
        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }

        //  const keyString = `${price.card_detail_id}-${price.level}-${price.is_gold}-${price.edition}`;

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const groupedPrices = searchableRentList[rentListKey];

        if (groupedPrices == null || groupedPrices.low_price == null) {
            const rentalNotFoundForCard = [uid, 'N'];

            return rentalNotFoundForCard;
        }

        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;

        if (marketPrices[marketKey] != null) {
            const price = calculateRentalPrice({
                card_detail_id,
                groupedLowPrice: groupedPrices.low_price,
                currentPriceStats: marketPrices[marketKey],
            });
        }
        // TNT TODO: make this more robust obviously

        // JBOXXX NOTE: this is where TNT gets the low price
        // SOME MATH HERE
        const price = groupedPrices.low_price;

        const rentalPriceForUid = [uid, price];

        return rentalPriceForUid;
    } catch (err) {
        console.error(
            `addPriceListInformationForEachCardByUid error: ${err.message}`
        );
        throw err;
    }
};

const calculateRentalPrice = ({
    card_detail_id,
    lowestListing,
    currentPriceStats,
}) => {
    const { avg, low, high, stdDev, median, volume } =
        currentPriceStats[ALL_OPEN_TRADES];
    if (cardRarity[card_detail_id] === 4) {
        // is legie
    }
    if (
        Number.isFinite(avg) &&
        Number.isFinite(stdDev) &&
        Number.isFinite(low) &&
        Number.isFinite(lowestListing) &&
        stdDev > 0
    ) {
        const zScoreOfListing = Math.abs(lowestListing - avg) / stdDev;
        const zScoreOfListingFromLowestTrade =
            Math.abs(lowestListing - low) / stdDev;
        const zScoreOfLowestTrade = Math.abs(low - avg) / stdDev;

        // scenario #1.
        // The lowest trade is actually very far away from the average
        // we probably want to list closer to the average
        // but we should probably be hitting the api for that card's listings for more clarity
        if (zScoreOfLowestTrade > 2 && lowestListing > low) {
            return lowestListing;
        } else if (zScoreOfLowestTrade > 2) {
            // we really should want some more information here about active listings
            // the low trade is far away from the average
            // and the lowest listing is greater than the low trade
            return lowestListing;
        }

        // scenario #2 (the most likely)
        // the lowest offer is 2 standard deviations away from the avg
        // and the low is greater than the lowestlisting
        if (zScoreOfListing > 2 && low > lowestListing) {
            // we probably want to wait before listing
            // alternatively we can list at the lowest trade
            return low;
        }
    }
};

module.exports = {
    calculateRentalPriceToList,
};
