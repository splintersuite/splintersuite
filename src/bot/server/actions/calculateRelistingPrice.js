'use strict';
const _ = require('lodash');
const {
    convertForRentGroupOutputToSearchableObject,
} = require('../services/splinterlands');
const { getLowBCXModernCardsByUid } = require('../services/collection');
const listingsService = require('../services/listings');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';

const calculateRelistingPrice = async ({
    collectionObj,
    marketPrices,
    groupedRentalListObj,
    endOfSeasonSettings,
}) => {
    try {
        const relistingPriceForEachMarketId = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthRelisting = [];
        const nullPrice = [];
        const cardCatch = [];
        const rentalDetailsObj = window.api.rentaldetails.getRentalDetails();
        const minRentalSetting = 0.11;

        for (const level of Object.keys(collectionObj)) {
            // should be a max of 10 possible times we can go through this because max lvl is 10
            let clBcxModerns = {};
            if (level === '1') {
                clBcxModerns = getLowBCXModernCardsByUid({
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
                const rentalPriceForMarketId =
                    addPriceRelistInformationForEachCardByMarketId({
                        card,
                        searchableRentList,
                        level,
                        marketPrices,
                        isClBcxModern: clBcxModerns[card.uid] !== undefined,
                        endOfSeasonSettings,
                    });
                if (rentalPriceForMarketId[0] === 'N') {
                    cardsUnableToFindPriceFor.push(rentalPriceForMarketId);
                } else if (rentalPriceForMarketId[0] === 'C') {
                    cardsNotWorthRelisting.push(rentalPriceForMarketId);
                } else if (rentalPriceForMarketId[0] === 'E') {
                    nullPrice.push(rentalPriceForMarketId);
                } else {
                    if (
                        parseFloat(rentalPriceForMarketId[1]) < minRentalSetting
                    ) {
                        // rental is less than 0.2 dec, not worth listing for 0.1 dec
                        cardsNotWorthRelisting.push(rentalPriceForMarketId);
                    } else {
                        if (rentalPriceForMarketId) {
                            relistingPriceForEachMarketId.push(
                                rentalPriceForMarketId
                            );
                        } else {
                            cardCatch.push(card);
                        }
                    }
                }
            }
        }
        window.api.bot.log({
            message: `/bot/server/actions/calculateRelistingPrice/calculateRelistingPrice`,
        });
        window.api.bot.log({
            message: `Relists: ${relistingPriceForEachMarketId?.length}`,
        });
        window.api.bot.log({
            message: `Excluded: ${cardsNotWorthRelisting?.length}`,
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
        return { relistingPriceForEachMarketId };
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
    endOfSeasonSettings,
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

        if (
            marketPrices[marketKey] == null ||
            _.isEmpty(marketPrices[marketKey] || !marketPrices)
        ) {
            // we should not cancel because we don't have any accurate information due to missing data to reprice this rental right now
            const shouldNotRelistRental = ['N'];
            return shouldNotRelistRental;
        }
        if (
            currentPriceData == null ||
            currentPriceData?.low_price == null ||
            _.isEmpty(currentPriceData) ||
            !currentPriceData
        ) {
            // this means there aren't any currently listed cards on the market
            if (marketPrices[marketKey] != null) {
                const openTrades = marketPrices[marketKey][ALL_OPEN_TRADES];
                const allTrades = marketPrices[marketKey][TRADES_DURING_PERIOD];
                const maxHigh = _.max([openTrades?.high, allTrades?.high]);
                const relistingPrice = [market_id, parseFloat(maxHigh)];
                if (
                    !relistingPrice ||
                    !relistingPrice[0] ||
                    !relistingPrice[1]
                ) {
                    const rentalNotFoundForCard = ['E', uid, market_id];
                    return rentalNotFoundForCard;
                }
                return relistingPrice;
            } else {
                const rentalNotFoundForCard = ['N', uid, market_id];
                return rentalNotFoundForCard;
            }
        }

        let listingPrice;
        if (marketPrices[marketKey] != null) {
            listingPrice = listingsService.getListingPrice({
                daysTillEOS: endOfSeasonSettings?.daysTillEOS,
                lowestListingPrice: parseFloat(currentPriceData?.low_price),
                numListings: currentPriceData.qty,
                currentPriceStats: marketPrices[marketKey],
                isClBcxModern,
            });

            listingPrice = listingsService.handleListingsTooHigh({
                currentPriceStats: marketPrices[marketKey],
                listingPrice,
                isClBcxModern,
            });
        } else {
            const rentalNotFoundForCard = ['N', uid, market_id];
            return rentalNotFoundForCard;
        }

        if (!listingPrice) {
            const rentalNotFoundForCard = ['E', uid, market_id];
            return rentalNotFoundForCard;
        } else if (
            listingPrice < buy_price
            // &&
            // (buy_price - listingPrice) / buy_price > 0.15 * lowBcxModernFactor
        ) {
            // the current listing (buy_price) is 15% more than what we would list it as today
            // relist lower
            // TNT NOTE: this buy_price - listingPrice < 0.2, we should let the 0.2 value be set by a user setting imo
            if (listingPrice < 0.11 || buy_price - listingPrice < 0.2) {
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
                parseFloat(listingPrice),
            ];

            if (
                !rentalRelistingPriceForMarketId ||
                !rentalRelistingPriceForMarketId[0] ||
                !rentalRelistingPriceForMarketId[1]
            ) {
                const rentalNotFoundForCard = ['E', uid, market_id];
                return rentalNotFoundForCard;
            }

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
