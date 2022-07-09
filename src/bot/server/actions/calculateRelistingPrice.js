'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const {
    getListingPrice,
    priceWithoutMedian,
} = require('./calculateRentalPriceToList');

const calculateRelistingPrice = async ({ collectionObj, marketPrices }) => {
    try {
        // console.log('calculateRelistingPrice start');

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
        //   console.log(`addPriceRelistInformationForEachCardByUid start`);
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

        if (currentPriceData == null || currentPriceData.low_price == null) {
            const rentalNotFoundForCard = ['N', uid, market_id];
            return rentalNotFoundForCard;
        } else if (currentPriceData.low_price >= buy_price) {
            // current low is greater than the buy_price, technically impossible for greater than
            // because we would be the low...
            const doNotChangeThePrice = [
                'C',
                uid,
                market_id,
                buy_price,
                currentPriceData.low_price,
            ];
            return doNotChangeThePrice;
        } else {
            // current lowest listings is less than than the buy price
            // we were listed at the median, we could relist a bit lower...
            const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;
            let price;
            // console.log('marketPrices[marketKey]', marketPrices[marketKey]);
            // console.log('marketKey', marketKey);
            if (marketPrices[marketKey] != null) {
                console.log('marketPrices[marketKey]', marketPrices[marketKey]);
                price = getListingPrice({
                    card_detail_id,
                    lowestListingPrice: parseFloat(currentPriceData.low_price),
                    numListings: currentPriceData.qty,
                    currentPriceStats: marketPrices[marketKey],
                });
                if (price === null) {
                    price = priceWithoutMedian({
                        card_detail_id,
                        lowestListingPrice: parseFloat(
                            currentPriceData.low_price
                        ),
                        numListings: currentPriceData.qty,
                        currentPriceStats: marketPrices[marketKey],
                    });
                }
                console.log('price here', price);
            } else {
                price = parseFloat(currentPriceData.low_price);
            }

            // const price = parseFloat(currentPriceData.low_price);

            if (price < 1) {
                const doNotChangeThePrice = [
                    'C',
                    uid,
                    market_id,
                    buy_price,
                    currentPriceData.low_price,
                ];
                return doNotChangeThePrice;
            }

            console.log('card', card);
            console.log('currentPriceData', currentPriceData);
            console.log(
                'currentPriceData.low_price',
                currentPriceData.low_price
            );
            console.log('marketKey', marketKey);
            console.log('price', price);

            const rentalRelistingPriceForMarketId = [market_id, `${price}`];
            console.log(
                'rentalRelistingPriceForMarketId',
                rentalRelistingPriceForMarketId
            );
            // const rentalRelistingPriceForMarketId = [uid, `${price}`];
            return rentalRelistingPriceForMarketId;
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
