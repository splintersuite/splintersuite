'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const {
    getListingPrice,
    getAvg,
    handleListingsTooHigh,
} = require('./calculateRentalPriceToList');
const _ = require('lodash');

const threeDaysTime = 1000 * 60 * 60 * 24 * 3;
const oneDayTime = 1000 * 60 * 60 * 24 * 1;

const calculateCancelActiveRentalPrices = async ({
    collectionObj,
    marketPrices,
    nextBotLoopTime,
    activeRentalsBySellTrxId,
    endOfSeasonSettings,
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
                    nextBotLoopTime,
                    rentalTransaction: activeRentalsBySellTrxId[card.market_id],
                    endOfSeasonSettings,
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
        window.api.bot.log({
            message: err.message,
        });
        console.error(`calculateCancelActiveRentalPrices ${err.message}`);
        throw err;
    }
};

const addMarketIdsForCancelling = ({
    card,
    searchableRentList,
    marketPrices,
    level,
    nextBotLoopTime,
    rentalTransaction,
    endOfSeasonSettings,
}) => {
    try {
        // console.log('addMarketIdsForCancelling start');
        const {
            card_detail_id,
            gold,
            edition,
            market_id,
            buy_price,
            uid,
            rental_date,
        } = card;

        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }
        const now = new Date().getTime();
        if (new Date(rental_date).getTime() + oneDayTime > now) {
            console.log(
                `we aren't going to try and cancel this card because it hasn't been listed for even a day yet`
            );
            const shouldNotCancelRental = [
                'NC',
                market_id,
                buy_price,
                'this shouldnt be neccessary jd lol, can only break something',
            ];
            throw new Error('checking this');
            return shouldNotCancelRental;
        }
        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData =
            searchableRentList[rentListKey] !== undefined
                ? searchableRentList[rentListKey]
                : {};

        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;
        let listingPrice;

        if (_.isEmpty(currentPriceData) && marketPrices[marketKey]) {
            currentPriceData.qty = 0;
            currentPriceData.low_price = buy_price;
        }
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
        const nextRentalPaymentTime = new Date(
            rentalTransaction.next_rental_payment
        ).getTime();
        if (currentPriceData == null || currentPriceData.low_price == null) {
            const priceNotFoundForCard = ['N', uid, market_id];
            return priceNotFoundForCard;
            // if i think i can make another 15% by relisting, cancel this
            // make sure i don't have more time...
            // make sure i don't cancel anything renting out above the average
            // if the listing price is greater than buy price * threshold
            // basically if i can fetch a much better price than i'm getting. i'll cancel
        } else if (
            nextBotLoopTime > nextRentalPaymentTime &&
            (listingPrice - buy_price) / listingPrice >
                endOfSeasonSettings.cancellationThreshold
        ) {
            if (
                new Date().getTime() - new Date(rental_date).getTime() >
                    threeDaysTime &&
                endOfSeasonSettings.cancellationThreshold >
                    (0.7 * (listingPrice - buy_price)) / listingPrice
            ) {
                const shouldNotCancelRental = [
                    'NC',
                    market_id,
                    buy_price,
                    currentPriceData.low_price,
                ];

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
        window.api.bot.log({
            message: err.message,
        });
        console.error(`addMarketIdsForCancelling error: ${err.message}`);
        console.log('err.stack', err.stack);
        throw err;
    }
};

module.exports = {
    calculateCancelActiveRentalPrices,
};
