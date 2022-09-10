'use strict';
const _ = require('lodash');
const {
    convertForRentGroupOutputToSearchableObject,
} = require('../services/splinterlands');
const { getLowBCXModernCardsByUid } = require('../services/collection');
const listingsService = require('../services/listings');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';

// this requires the object that has key = level, value [ array of cards with level = key]
const calculateRentalPriceToList = async ({
    collectionObj,
    marketPrices,
    groupedRentalListObj,
    endOfSeasonSettings,
}) => {
    try {
        const rentalPriceForEachCardUid = [];
        const cardsUnableToFindPriceFor = [];
        const cardsNotWorthListing = [];
        const nullPrice = [];
        const cardCatch = [];

        const minRentalSetting = 0.11;

        // sorts through the collectionObj that has key = level, value = [array of cards that's level = key]
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
                const rentalPriceForUid =
                    addPriceListInformationForEachCardByUid({
                        card,
                        searchableRentList,
                        level,
                        marketPrices,
                        isClBcxModern: clBcxModerns[card.uid] !== undefined,
                        endOfSeasonSettings,
                    });
                if (rentalPriceForUid[1] === 'N') {
                    cardsUnableToFindPriceFor.push(rentalPriceForUid);
                } else if (rentalPriceForUid[1] === 'E') {
                    nullPrice.push(rentalPriceForUid);
                } else {
                    if (parseFloat(rentalPriceForUid[1]) < minRentalSetting) {
                        cardsNotWorthListing.push(rentalPriceForUid);
                    } else {
                        if (rentalPriceForUid) {
                            rentalPriceForEachCardUid.push(rentalPriceForUid);
                        } else {
                            cardCatch.push(card);
                        }
                    }
                }
            }
        }
        window.api.bot.log({
            message: `/bot/server/actions/calculateRentalPriceToList/calculateRentalPriceToList`,
        });
        window.api.bot.log({
            message: `Rentals: ${rentalPriceForEachCardUid?.length}`,
        });
        window.api.bot.log({
            message: `Excluded: ${cardsNotWorthListing?.length}`,
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
        return rentalPriceForEachCardUid;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/calculateRentalPriceToList/calculateRentalPriceToList error: ${err.message}, err.stack: ${err.stack}`,
        });
        throw err;
    }
};

const addPriceListInformationForEachCardByUid = ({
    card,
    searchableRentList,
    level,
    marketPrices,
    isClBcxModern,
    endOfSeasonSettings,
}) => {
    try {
        const { card_detail_id, gold, edition, uid } = card;
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
            currentPriceData == null ||
            currentPriceData?.low_price == null ||
            _.isEmpty(currentPriceData) ||
            !currentPriceData
        ) {
            // there are currently no listings on the market for this card
            if (marketPrices[marketKey] != null) {
                const openTrades = marketPrices[marketKey][ALL_OPEN_TRADES];
                const allTrades = marketPrices[marketKey][TRADES_DURING_PERIOD];
                const maxHigh = _.max([openTrades.high, allTrades.high]);
                const rentalPrice = [uid, parseFloat(maxHigh)];
                if (!rentalPrice || !rentalPrice[0] || !rentalPrice[1]) {
                    const rentalNotFound = [uid, 'E'];
                    return rentalNotFound;
                }
                return rentalPrice;
            } else {
                const rentalNotFoundForCard = [uid, 'N'];
                return rentalNotFoundForCard;
            }
        }

        let listingPrice;
        if (marketPrices[marketKey] != null) {
            listingPrice = listingsService.getListingPrice({
                daysTillEOS: endOfSeasonSettings?.daysTillEOS,
                lowestListingPrice: parseFloat(currentPriceData?.low_price),
                numListings: currentPriceData?.qty,
                currentPriceStats: marketPrices[marketKey],
                isClBcxModern,
            });
            // window.api.bot.log({
            //     message: `/bot/server/actions/calculateRentalPriceToList/addPriceListInformationForEachCardByUid before handleListingsTooHigh listingPrice; ${listingPrice}, parseFloat: ${parseFloat(
            //         listingPrice
            //     )}, parseFloat('${listingPrice}'): ${parseFloat(
            //         `${listingPrice}`
            //     )}`,
            // });
            listingPrice = listingsService.handleListingsTooHigh({
                currentPriceStats: marketPrices[marketKey],
                listingPrice,
                isClBcxModern,
            });
            // window.api.bot.log({
            //     message: `/bot/server/actions/calculateRentalPriceToList/addPriceListInformationForEachCardByUid after handleListingsTooHigh listingPrice; ${listingPrice}, parseFloat: ${parseFloat(
            //         listingPrice
            //     )}, parseFloat('${listingPrice}'): ${parseFloat(
            //         `${listingPrice}`
            //     )}`,
            // });
            if (!listingPrice) {
                window.api.bot.log({
                    message: `/bot/server/actions/calculateRentalPriceToList/addPriceListInformationForEachCardByUid listingPrice; ${listingPrice}, parseFloat: ${parseFloat(
                        listingPrice
                    )}, parseFloat('${listingPrice}'): ${parseFloat(
                        `${listingPrice}`
                    )}`,
                });
                const rentalNotFound = [uid, 'E'];
                return rentalNotFound;
            }
        } else {
            const rentalNotFoundForCard = [uid, 'N'];
            return rentalNotFoundForCard;
        }

        const rentalPriceForUid = [uid, parseFloat(listingPrice)];

        if (
            !rentalPriceForUid ||
            !rentalPriceForUid[0] ||
            !rentalPriceForUid[1]
        ) {
            const rentalNotFound = [uid, 'E'];
            return rentalNotFound;
        }

        return rentalPriceForUid;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/calculateRentalPriceToList/addPriceListInformationForEachCardByUid error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    calculateRentalPriceToList,
};
