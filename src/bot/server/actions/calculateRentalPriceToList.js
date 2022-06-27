'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');

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

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const groupedPrices = searchableRentList[rentListKey];

        const goldHandle = _gold === 'T';
        const marketKey = `${card_detail_id}-${level}=${goldHandle}`;
        if (groupedPrices == null || groupedPrices.low_price == null) {
            const rentalNotFoundForCard = [uid, 'N'];

            return rentalNotFoundForCard;
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

module.exports = {
    calculateRentalPriceToList,
};
