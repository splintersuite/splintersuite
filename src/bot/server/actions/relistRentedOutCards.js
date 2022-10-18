'use strict';

const {
    convertForRentGroupOutputToSearchableObject,
} = require('../services/splinterlands');
const { getLowBCXModernCardsByUid } = require('../services/collection');
const listingsService = require('../services/listings');
const _ = require('lodash');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';

const oneDayTime = 1000 * 60 * 60 * 24 * 1;

const calculateRelistActiveRentalPrices = async ({
    collectionObj,
    marketPrices,
    nextBotLoopTime,
    activeRentalsBySellTrxId,
    endOfSeasonSettings,
    groupedRentalListObj,
    listingDataByMarketKey,
}) => {
    try {
        const relistingPriceForActiveMarketId = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthChangingPrice = [];
        const outOfLoop = [];
        const nullPrice = [];
        const cardCatch = [];

        for (const level of Object.keys(collectionObj)) {
            // should be a max of 10 possible times we can go through this because max lvl is 10

            let lowBcxModerns = {};
            if (level === '1' || level === 1) {
                lowBcxModerns = getLowBCXModernCardsByUid({
                    collection: collectionObj[level],
                });
            }

            // aggregate rental price data for cards of the level
            const groupedRentalsList = groupedRentalListObj[level];

            const searchableRentList =
                convertForRentGroupOutputToSearchableObject({
                    groupedRentalsList,
                });

            for (const card of collectionObj[level]) {
                const relistPriceForMarketId = addActiveMarketIdsForRelisting({
                    card,
                    searchableRentList,
                    marketPrices,
                    level,
                    nextBotLoopTime,
                    rentalTransaction: activeRentalsBySellTrxId[card.market_id],
                    endOfSeasonSettings,
                    isClBcxModern: lowBcxModerns[card.uid] !== undefined,
                    listingDataByMarketKey,
                });

                if (relistPriceForMarketId[0] === 'MD') {
                    // missing data
                    cardsUnableToFindPriceFor.push(card);
                } else if (relistPriceForMarketId[0] === 'N') {
                    cardsNotWorthChangingPrice.push(card);
                } else if (relistPriceForMarketId[0] === 'T') {
                    outOfLoop.push(card);
                } else if (relistPriceForMarketId[0] === 'E') {
                    nullPrice.push(card);
                } else if (relistPriceForMarketId[0] == null) {
                    cardsUnableToFindPriceFor.push(card);
                } else {
                    if (relistPriceForMarketId) {
                        relistingPriceForActiveMarketId.push(
                            relistPriceForMarketId
                        );
                    } else {
                        cardCatch.push(card);
                    }
                }
            }
        }

        window.api.bot.log({
            message: `/bot/server/actions/relistRentedOutCards/calculateRelistActiveRentalPrices`,
        });
        window.api.bot.log({
            message: `Relist: ${relistingPriceForActiveMarketId?.length}`,
        });
        window.api.bot.log({
            message: `Excluded: ${cardsNotWorthChangingPrice?.length}`,
        });
        window.api.bot.log({
            message: `Not in Loop: ${outOfLoop?.length}`,
        });
        window.api.bot.log({
            message: `Unable to price: ${cardsUnableToFindPriceFor?.length}`,
        });
        window.api.bot.log({
            message: `Null Price: ${nullPrice?.length}`,
        });
        window.api.bot.log({
            message: `Catch: ${cardCatch?.length}`,
        });

        return { relistingPriceForActiveMarketId };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/relistRentedOutCards/calculateRelistActiveRentalPrices error: ${err.message}`,
        });
        throw err;
    }
};

const addActiveMarketIdsForRelisting = ({
    card,
    searchableRentList,
    marketPrices,
    level,
    nextBotLoopTime,
    rentalTransaction,
    endOfSeasonSettings,
    isLowBcxModern,
    listingDataByMarketKey,
}) => {
    try {
        // console.log('addActiveMarketIdsForRelistings');
        const {
            card_detail_id,
            gold,
            edition,
            market_id,
            buy_price,
            rental_date,
        } = card;

        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }

        const now = new Date().getTime();
        const rentalDateInMs = new Date(rental_date).getTime();
        if (rentalDateInMs + oneDayTime > now) {
            // this is so we don't cancel a rental that hasn't lasted over 24 hours at least
            const shouldNotRelistRental = ['T'];
            return shouldNotRelistRental;
        }

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData = searchableRentList[rentListKey];

        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;
        let listingPrice;
        if (
            marketPrices[marketKey] == null ||
            _.isEmpty(marketPrices[marketKey]) ||
            !marketPrices
        ) {
            // we should not cancel because we don't have any accurate information due to missing data to reprice this rental right now
            const shouldNotRelistRental = ['MD']; // MD = missing data
            return shouldNotRelistRental;
        }
        if (
            _.isEmpty(currentPriceData) ||
            currentPriceData == null ||
            currentPriceData?.low_price == null ||
            !currentPriceData
        ) {
            // if there aren't any listings currently, then we should get the marketPrices and reprice the same way we aggresively price the lowBcxModern cards
            const openTrades = marketPrices[marketKey][ALL_OPEN_TRADES];
            const allTrades = marketPrices[marketKey][TRADES_DURING_PERIOD];
            const maxHigh = _.max([openTrades.high, allTrades.high]);
            const relistingPrice = [market_id, parseFloat(maxHigh)];
            if (!relistingPrice || !relistingPrice[0] || !relistingPrice[1]) {
                const rentalNotFound = ['E', market_id];
                return rentalNotFound;
            }
            return relistingPrice;
        }
        listingPrice = listingsService.getListingPrice({
            daysTillEOS: endOfSeasonSettings?.daysTillEOS,
            lowestListingPrice: parseFloat(currentPriceData?.low_price),
            numListings: currentPriceData?.qty,
            currentPriceStats: marketPrices[marketKey],
            isClBcxModern: isLowBcxModern,
        });

        listingPrice = listingsService.handleListingsTooHigh({
            currentPriceStats: marketPrices[marketKey],
            listingPrice,
            isClBcxModern: isLowBcxModern,
        });

        const nextRentalPaymentTime = new Date(
            rentalTransaction.next_rental_payment
        ).getTime();

        const lowBcxModernFactor = isLowBcxModern ? 5.0 : 1.0;

        if (!listingPrice) {
            const rentalNotFound = ['E', market_id];
            return rentalNotFound;
        } else if (
            nextBotLoopTime > nextRentalPaymentTime &&
            (listingPrice - buy_price) / listingPrice >
                endOfSeasonSettings?.cancellationThreshold * lowBcxModernFactor
        ) {
            const currentlyListed = listingDataByMarketKey[marketKey];
            if (
                listingPrice < 0.13 ||
                (currentlyListed !== undefined &&
                    currentlyListed?.count > 3 &&
                    currentlyListed?.avg < listingPrice)
            ) {
                // console.log('currentlyListed', currentlyListed);
                // console.log('card here', card);
                const shouldNotRelistRental = ['N'];
                return shouldNotRelistRental;
            } else {
                const rentalRelistingPriceForMarketId = [
                    market_id,
                    parseFloat(listingPrice),
                ];

                if (
                    !rentalRelistingPriceForMarketId ||
                    !rentalRelistingPriceForMarketId[0] ||
                    !rentalRelistingPriceForMarketId[1]
                ) {
                    const rentalNotFound = ['E', market_id];
                    return rentalNotFound;
                }
                return rentalRelistingPriceForMarketId;
            }
        } else {
            const shouldNotRelistRental = ['N'];
            return shouldNotRelistRental;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/relistRentedOutCards/addActiveMarketIdsForRelisting error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    calculateRelistActiveRentalPrices,
};
