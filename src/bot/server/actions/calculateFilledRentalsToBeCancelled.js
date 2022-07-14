'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const {
    getListingPrice,
    priceWithoutMedian,
    getAvg,
} = require('./calculateRentalPriceToList');

const threeDaysTime = 1000 * 60 * 60 * 24 * 3

const calculateCancelActiveRentalPrices = async ({
    collectionObj,
    marketPrices,
}) => {
    try {
        //   console.log('calculateCancelActiveRentalPrices start');

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
                    marketPrices,
                    level,
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

const addMarketIdsForCancelling = ({
    card,
    searchableRentList,
    marketPrices,
    level,
}) => {
    try {
        // console.log('addMarketIdsForCancelling start');
        const { card_detail_id, gold, edition, market_id, buy_price, uid, market_created_date } =
            card;

        console.log('card', card);
        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData = searchableRentList[rentListKey];
        const threshold = 0.3;

        const cancelFloorPrice = (1 + threshold) * parseFloat(buy_price);
        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;
        let listingPrice;
        // console.log('marketPrices[marketKey]', marketPrices[marketKey]);
        // console.log('marketKey', marketKey);
        if (marketPrices[marketKey] != null) {
            listingPrice = getListingPrice({
                card_detail_id,
                lowestListingPrice: parseFloat(currentPriceData.low_price),
                numListings: currentPriceData.qty,
                currentPriceStats: marketPrices[marketKey],
            });
            if (listingPrice === null) {
                listingPrice = priceWithoutMedian({
                    card_detail_id,
                    lowestListingPrice: parseFloat(currentPriceData.low_price),
                    numListings: currentPriceData.qty,
                    currentPriceStats: marketPrices[marketKey],
                });
            }
        } else {
            listingPrice = parseFloat(currentPriceData.low_price);
        }
        const avg = getAvg({ currentPriceStats: marketPrices[marketKey] });
        // console.log('card', card);
        // console.log('buy_price', buy_price);
        // console.log('listingPrice', listingPrice);
        // console.log('cancelFloorPrice', cancelFloorPrice);

        if (currentPriceData == null || currentPriceData.low_price == null) {
            const priceNotFoundForCard = ['N', uid, market_id];
            return priceNotFoundForCard;
            // if i think i can make another 15% by relisting, cancel this
        } else if (cancelFloorPrice < listingPrice && cancelFloorPrice < avg) {
            if (
                new Date().getTime() = new Date(market_created_date).getTime() > threeDaysTime &&
                listingPrice * 0.7 < cancelFloorPrice
            ) {
                const shouldNotCancelRental = [
                    'NC',
                    market_id,
                    buy_price,
                    currentPriceData.low_price,
                ]

                return shouldNotCancelRental;
            }
            // this means that we should cancel this and relist it
            const rentalToCancel = ['C', market_id];

            return rentalToCancel;
        } else {
            const shouldNotCancelRental = [
                'NC',
                market_id,
                buy_price,
                currentPriceData.low_price,
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
