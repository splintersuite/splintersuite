'use strict';
const _ = require('lodash');
const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('../services/splinterlands');
const { getLowBCXModernCardsByUid } = require('../services/collection');
const {
    getListingPrice,
    handleListingsTooHigh,
} = require('./calculateRentalPriceToList');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';

const calculateRelistingPrice = async ({
    collectionObj,
    marketPrices,
    groupedRentalListObj,
}) => {
    try {
        const relistingPriceForEachMarketId = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthRelisting = [];

        for (const level in collectionObj) {
            // should be a max of 10 possible times we can go through this because max lvl is 10
            let clBcxModerns = {};
            if (level === '1') {
                clBcxModerns = getLowBCXModernCardsByUid({
                    collection: collectionObj[level],
                });
            }
            // aggregate rental price data for cards of the level
            const groupedRentalsList = groupedRentalListObj[level];
            // const groupedRentalsList = await getGroupedRentalsForLevel({
            //     level,
            // });

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
                        isClBcxModern: clBcxModerns[card.uid] !== undefined,
                    });
                if (rentalPriceForMarketId[0] === 'N') {
                    cardsUnableToFindPriceFor.push(rentalPriceForMarketId);
                } else if (rentalPriceForMarketId[0] === 'C') {
                    cardsNotWorthRelisting.push(rentalPriceForMarketId);
                } else {
                    if (parseFloat(rentalPriceForMarketId[1]) < 0.2) {
                        // rental is less than 0.2 dec, not worth listing for 0.1 dec
                        cardsNotWorthRelisting.push(rentalPriceForMarketId);
                    } else {
                        relistingPriceForEachMarketId.push(
                            rentalPriceForMarketId
                        );
                    }
                }
            }
        }
        return { relistingPriceForEachMarketId, cardsNotWorthRelisting };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/calculateRelistingPrice/calculateRelistingPrice error: ${err.message}`,
        });
        throw err;
    }
};

const addPriceRelistInformationForEachCardByMarketId = ({
    card,
    searchableRentList,
    level,
    marketPrices,
    isClBcxModern,
}) => {
    try {
        const {
            card_detail_id,
            gold,
            edition,
            market_id,
            buy_price,
            rarity,
            uid,
        } = card;

        let _gold = 'F';
        if (gold) {
            _gold = 'T';
        } else {
            _gold = 'F';
        }
        const rentListKey = `${card_detail_id}${_gold}${edition}`;
        const currentPriceData = searchableRentList[rentListKey];

        const marketKey = `${card_detail_id}-${level}-${gold}-${edition}`;

        if (
            marketPrices[marketKey] == null ||
            _.isEmpty(marketPrices[marketKey])
        ) {
            // we should not cancel because we don't have any accurate information due to missing data to reprice this rental right now
            const shouldNotRelistRental = ['N'];
            return shouldNotRelistRental;
        }
        let listingPrice;
        if (marketPrices[marketKey] != null) {
            listingPrice = getListingPrice({
                card_detail_id,
                rarity,
                lowestListingPrice: parseFloat(currentPriceData.low_price),
                numListings: currentPriceData.qty,
                currentPriceStats: marketPrices[marketKey],
                isClBcxModern,
            });
            listingPrice = handleListingsTooHigh({
                currentPriceStats: marketPrices[marketKey],
                listingPrice,
                isClBcxModern,
            });
        } else {
            listingPrice = parseFloat(currentPriceData.low_price);
        }

        const lowBcxModernFactor = isClBcxModern ? 2.0 : 1.0;
        if (
            currentPriceData == null ||
            currentPriceData.low_price == null ||
            _.isEmpty(currentPriceData)
        ) {
            if (marketPrices[marketKey] != null) {
                const openTrades = marketPrices[marketKey][ALL_OPEN_TRADES];
                const allTrades = marketPrices[marketKey][TRADES_DURING_PERIOD];
                const maxHigh = _.max([openTrades.high, allTrades.high]);
                const relistingPrice = [market_id, parseFloat(maxHigh)];
                return relistingPrice;
            } else {
                const rentalNotFoundForCard = ['N', uid, market_id];
                return rentalNotFoundForCard;
            }
        } else if (
            listingPrice < buy_price &&
            (buy_price - listingPrice) / buy_price > 0.3 * lowBcxModernFactor
        ) {
            // the current listing (buy_price) is 30% more than what we would list it as today
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
        window.api.bot.log({
            message: `/bot/server/actions/calculateRelistingPrice/addPriceRelistInformationForEachCardByUid error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    calculateRelistingPrice,
};
