'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const { getListingPrice } = require('./calculateRentalPriceToList');

const calculateRelistingPrice = async ({ collectionObj, marketPrices }) => {
    try {
        const relistingPriceForEachMarketId = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthRelisting = [];

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
                const rentalPriceForMarketId =
                    addPriceRelistInformationForEachCardByMarketId({
                        card,
                        searchableRentList,
                        level,
                        marketPrices,
                    });
                if (rentalPriceForMarketId[0] === 'N') {
                    cardsUnableToFindPriceFor.push(rentalPriceForMarketId);
                } else if (rentalPriceForMarketId[0] === 'C') {
                    cardsNotWorthRelisting.push(rentalPriceForMarketId);
                } else {
                    relistingPriceForEachMarketId.push(rentalPriceForMarketId);
                }
            }
        }
        // TNT TODO: find new price data for the cards in cardsUnableToFindPriceFor
        return { relistingPriceForEachMarketId, cardsNotWorthRelisting };
    } catch (err) {
        console.error(`calculateRelistingPrice error: ${err.message}`);
        throw err;
    }
};

const addPriceRelistInformationForEachCardByMarketId = ({
    card,
    searchableRentList,
    level,
    marketPrices,
}) => {
    try {
        const { card_detail_id, gold, edition, market_id, buy_price, uid } =
            card;

        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }
        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData = searchableRentList[rentListKey];

        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;
        let listingPrice;
        if (marketPrices[marketKey] != null) {
            listingPrice = getListingPrice({
                card_detail_id,
                lowestListingPrice: parseFloat(currentPriceData.low_price),
                numListings: currentPriceData.qty,
                currentPriceStats: marketPrices[marketKey],
            });
        } else {
            listingPrice = parseFloat(currentPriceData.low_price);
        }

        if (currentPriceData == null || currentPriceData.low_price == null) {
            const rentalNotFoundForCard = ['N', uid, market_id];
            return rentalNotFoundForCard;
        } else if (
            listingPrice < buy_price &&
            (buy_price - listingPrice) / buy_price > 0.3
        ) {
            // the current listing (buy_price) is 20% more than what we would list it as today
            // relist lower
            if (listingPrice < 0.2) {
                const doNotChangeThePrice = [
                    'C',
                    uid,
                    market_id,
                    buy_price,
                    currentPriceData.low_price,
                ];

                return doNotChangeThePrice;
            }

            const rentalRelistingPriceForMarketId = [
                market_id,
                parseFloat(currentPriceData.low_price) > listingPrice
                    ? currentPriceData.low_price
                    : `${listingPrice}`,
            ];

            return rentalRelistingPriceForMarketId;
        } else {
            const doNotChangeThePrice = [
                'C',
                uid,
                market_id,
                buy_price,
                currentPriceData.low_price,
            ];
            return doNotChangeThePrice;
        }
    } catch (err) {
        console.error(
            `addPriceRelistInformationForEachCardByUid error: ${err.message}`
        );
        throw err;
    }
};

module.exports = {
    calculateRelistingPrice,
};
