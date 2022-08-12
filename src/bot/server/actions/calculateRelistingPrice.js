'use strict';
const _ = require('lodash');
const {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
} = require('./rentalListInfo');
const { getLowBCXCLCardsByUid } = require('../services/collection');
const {
    getListingPrice,
    handleListingsTooHigh,
} = require('./calculateRentalPriceToList');

const calculateRelistingPrice = async ({ collectionObj, marketPrices }) => {
    try {
        const relistingPriceForEachMarketId = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthRelisting = [];

        for (const level in collectionObj) {
            // should be a max of 10 possible times we can go through this because max lvl is 10
            let clBcxCommons = {};
            if (level === 1) {
                clBcxCommons = getLowBCXCLCardsByUid({
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
                const rentalPriceForMarketId =
                    addPriceRelistInformationForEachCardByMarketId({
                        card,
                        searchableRentList,
                        level,
                        marketPrices,
                        isClBcxCommon: clBcxCommons[card.uid] !== undefined,
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
    isClBcxCommon,
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
        let listingPrice;
        if (marketPrices[marketKey] != null) {
            listingPrice = getListingPrice({
                card_detail_id,
                rarity,
                lowestListingPrice: parseFloat(currentPriceData.low_price),
                numListings: currentPriceData.qty,
                currentPriceStats: marketPrices[marketKey],
                isClBcxCommon,
            });
            listingPrice = handleListingsTooHigh({
                currentPriceStats: marketPrices[marketKey],
                listingPrice,
                isClBcxCommon,
            });
        } else {
            listingPrice = parseFloat(currentPriceData.low_price);
        }

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
        window.api.bot.log({
            message: `/bot/server/actions/calculateRelistingPrice/addPriceRelistInformationForEachCardByUid error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    calculateRelistingPrice,
};
