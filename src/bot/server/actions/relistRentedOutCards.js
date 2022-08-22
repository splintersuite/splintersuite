'use strict';

const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const { getLowBCXModernCardsByUid } = require('../services/collection');
const {
    getListingPrice,
    handleListingsTooHigh,
} = require('./calculateRentalPriceToList');
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
}) => {
    try {
        const relistingPriceForActiveMarketId = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthChangingPrice = [];

        for (const level in collectionObj) {
            // should be a max of 10 possible times we can go through this because max lvl is 10

            let lowBcxModerns = {};
            if (level === '1' || level === 1) {
                lowBcxModerns = getLowBCXModernCardsByUid({
                    collection: collectionObj[level],
                });
            }

            // aggregate rental price data for cards of the level
            const groupedRentalsList = await getGroupedRentalsForLevel({
                level,
            });

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
                });
                if (relistPriceForMarketId[0] === 'MD') {
                    // missing data
                    cardsUnableToFindPriceFor.push(card);
                } else if (relistPriceForMarketId[0] === 'N') {
                    cardsNotWorthChangingPrice.push(card);
                } else if (relistPriceForMarketId[0] == null) {
                    cardsUnableToFindPriceFor.push(card);
                } else {
                    relistingPriceForActiveMarketId.push(
                        relistPriceForMarketId
                    );
                }
            }
        }

        return { relistingPriceForActiveMarketId, cardsNotWorthChangingPrice };
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
}) => {
    try {
        console.log('addActiveMarketIdsForRelistings');

        const {
            card_detail_id,
            gold,
            edition,
            market_id,
            buy_price,
            rental_date,
            rarity,
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
            const shouldNotRelistRental = ['N'];
            return shouldNotRelistRental;
        }

        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData =
            searchableRentList[rentListKey] !== undefined
                ? searchableRentList[rentListKey]
                : {};

        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;
        let listingPrice;
        if (
            marketPrices[marketKey] == null ||
            _.isEmpty(marketPrices[marketKey])
        ) {
            // we should not cancel because we don't have any accurate information due to missing data to reprice this rental right now
            const shouldNotRelistRental = ['MD']; // MD = missing data
            return shouldNotRelistRental;
        }
        if (
            _.isEmpty(currentPriceData) ||
            currentPriceData == null ||
            currentPriceData?.low_price == null
        ) {
            // if there aren't any listings currently, then we should get the marketPrices and reprice the same way we aggresively price the lowBcxModern cards
            const openTrades = marketPrices[marketKey][ALL_OPEN_TRADES];
            const allTrades = marketPrices[marketKey][TRADES_DURING_PERIOD];
            const maxHigh = _.max([openTrades.high, allTrades.high]);
            const relistingPrice = [market_id, parseFloat(maxHigh)];
            return relistingPrice;
        }

        listingPrice = getListingPrice({
            card_detail_id,
            rarity,
            lowestListingPrice: parseFloat(currentPriceData.low_price),
            numListings: currentPriceData.qty,
            currentPriceStats: marketPrices[marketKey],
            isClBcxModern: isLowBcxModern,
        });
        listingPrice = handleListingsTooHigh({
            currentPriceStats: marketPrices[marketKey],
            listingPrice,
            isClBcxModern: isLowBcxModern,
        });

        const nextRentalPaymentTime = new Date(
            rentalTransaction.next_rental_payment
        ).getTime();

        const lowBcxModernFactor = isLowBcxModern ? 5.0 : 1.0;

        if (
            nextBotLoopTime > nextRentalPaymentTime &&
            (listingPrice - buy_price) / listingPrice >
                endOfSeasonSettings?.cancellationThreshold * lowBcxModernFactor
        ) {
            if (listingPrice < 0.2) {
                const shouldNotRelistRental = ['N'];
                return shouldNotRelistRental;
            } else {
                const rentalRelistingPriceForMarketId = [
                    market_id,
                    parseFloat(currentPriceData?.low_price) > listingPrice
                        ? currentPriceData.low_price
                        : `${listingPrice}`,
                ];
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
