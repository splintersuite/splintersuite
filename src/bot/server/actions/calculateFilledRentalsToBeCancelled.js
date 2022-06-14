'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');

const calculateCancelActiveRentalPrices = async ({ collectionObj }) => {
    try {
        console.log('calculateCancelActiveRentalPrices start');

        const marketIdsForCancellation = [];
        const unableToFindPriceFor = []; // TNT NOTE: I think this means we should cancel tbh cuz we want to relist a lot higher imo, although need to delve into this more
        const cardsNotWorthCancelling = [];

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
                const cancelPriceForMarketId = addMarketIdsForCancelling({
                    card,
                    searchableRentList,
                });
                if (cancelPriceForMarketId[0] === 'N') {
                    unableToFindPriceFor.push(card);
                } else if (cancelPriceForMarketId[0] === 'C') {
                    marketIdsForCancellation.push(cancelPriceForMarketId[1]);
                } else {
                    cardsNotWorthCancelling.push([
                        card,
                        { low_price: cancelPriceForMarketId[3] },
                    ]);
                }
            }
        }
        // TNT TODO: find new price data for the cards in cardsUnableToFindPriceFor
        return { marketIdsForCancellation, cardsNotWorthCancelling };
    } catch (err) {
        console.error(`calculateCancelActiveRentalPrices ${err.message}`);
        throw err;
    }
};

const addMarketIdsForCancelling = ({ card, searchableRentList }) => {
    try {
        console.log('addMarketIdsForCancelling start');
        const { card_detail_id, gold, edition, market_id, buy_price, uid } =
            card;
        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const priceData = searchableRentList[rentListKey];
        const threshold = 0.3;

        const cancelFloorPrice = (1 + threshold) * buy_price;

        if (priceData == null || priceData.low_price == null) {
            const priceNotFoundForCard = ['N', uid, market_id];
            return priceNotFoundForCard;
        } else if (priceData.low_price > cancelFloorPrice) {
            // this means that we should cancel this and relist it
            const rentalToCancel = ['C', market_id];

            return rentalToCancel;
        } else {
            const shouldNotCancelRental = [
                'NC',
                market_id,
                buy_price,
                priceData.low_price,
            ];

            return shouldNotCancelRental;
        }
    } catch (err) {
        console.error(`addMarketIdsForCancelling error: ${err.message}`);
        throw err;
    }
};

module.exports = {
    calculateCancelActiveRentalPrices,
};
