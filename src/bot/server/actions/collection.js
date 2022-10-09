'use strict';

const _ = require('lodash');
const { isOnCooldown } = require('./_helpers.js');

const sortCollectionArrayByLevel = ({ collection }) => {
    try {
        //  console.log(`sortArrayByLevel start`);

        const sortedArray = collection.sort((a, b) => a.level - b.level);
        return sortedArray;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/collection/sortArrayByLevel error: ${err.message}`,
        });
        throw err;
    }
};

// this requires a collection that has already had sortCollectionArrayByLevel called on it
const filterCollectionArrayByLevel = ({ collection }) => {
    try {
        //    console.log(`filterCollectionArrayByLevel start`);

        const allCardsForLevel = {};
        const lengthOfCollection = collection.length;
        let numberOfRuns = 0;
        let tempArray = [];
        let lastLevel = 0;
        let firstLoopRun = true;
        collection.forEach((card) => {
            const { level } = card;
            if (level > lastLevel) {
                if (!firstLoopRun) {
                    allCardsForLevel[lastLevel] = tempArray;
                    tempArray = [];
                    lastLevel = level;
                    tempArray.push(card);
                } else {
                    lastLevel = level;
                    tempArray.push(card);
                    firstLoopRun = false;
                }
            } else if ((lastLevel = level)) {
                tempArray.push(card);
            } else {
                window.api.bot.log({
                    message: `somehow the level: ${level} is not > or = to the lastLevel: ${lastLevel}`,
                });
                throw new Error(
                    `the sorting for this collection by level must not be working`
                );
            }
            if (lengthOfCollection - 1 <= numberOfRuns) {
                allCardsForLevel[level] = tempArray;
            }
            numberOfRuns = numberOfRuns + 1;
        });

        return allCardsForLevel;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/collection/filterCollectionArrayByLevel error: ${err.message}`,
        });
        throw err;
    }
};

const filterCollectionArraysForPotentialRentalCards = ({
    username,
    collection,
    activeRentalsBySellTrxId,
    cardDetailObj,
}) => {
    try {
        //  console.log('filterCollectionArraysForPotentialRentalCards start');

        const cardsAvailableForRent = [];

        const cardsOnRentalCooldown = [];

        const cardsBeingRentedOut = [];

        const cardsListedButNotRentedOut = [];

        const cardsAlreadyCancelled = [];

        const cardsNotOwned = [];

        const cardsNotOnActiveRentals = [];

        const uidsOfThoseNotLabeled = [];

        const cardsDelegatedOut = [];

        const gladius = [];

        let ownedCount = 0;

        // need to convert from array of cards into object where key = rental_tx (aka delegation_tx)
        collection.forEach((card) => {
            const cardToBeAdded = card;
            const { rarity, tier } = cardDetailObj[card.card_detail_id];
            cardToBeAdded.rarity = rarity;
            cardToBeAdded.tier = tier;
            if (card.player === username) {
                if (card.edition === 6) {
                    gladius.push(cardToBeAdded);
                } else if (
                    //  card.player === username &&
                    card.delegated_to == null
                ) {
                    if (
                        card.last_used_player === username &&
                        card.market_listing_type == null &&
                        card?.last_used_date &&
                        isOnCooldown(card?.last_used_date)
                    ) {
                        cardsOnRentalCooldown.push(cardToBeAdded);
                    } else if (
                        // card.last_used_date != null &&
                        // isOnCooldown(card.last_used_date) &&
                        card.last_transferred_date != null &&
                        isOnCooldown(card.last_transferred_date)
                    ) {
                        cardsOnRentalCooldown.push(cardToBeAdded);
                    } else if (
                        card.market_listing_type === 'RENT' &&
                        card.market_listing_status === 0 &&
                        card.market_created_date
                    ) {
                        cardsListedButNotRentedOut.push(cardToBeAdded);
                    } else {
                        cardsAvailableForRent.push(cardToBeAdded);
                    }
                } else if (
                    // card.player === username &&
                    card.market_listing_type === 'RENT' &&
                    card.delegated_to != null
                ) {
                    // delegation_tx from here === rental_tx from active_rentals
                    // sell_trx_id === card.market_id from collection
                    const currentRental =
                        activeRentalsBySellTrxId[card.market_id];
                    if (!currentRental) {
                        cardsNotOnActiveRentals.push(cardToBeAdded);
                        // seems to be some sort of delay where this errors because the active rentals endpoint is not updated
                    } else if (
                        currentRental?.cancel_tx == null &&
                        currentRental?.cancel_player == null &&
                        currentRental?.cancel_date == null &&
                        currentRental?.rental_date
                    ) {
                        cardToBeAdded.rental_date = currentRental?.rental_date;
                        cardsBeingRentedOut.push(cardToBeAdded);
                    } else {
                        // this would mean the cancel_tx has a value, and therefore the rental was cancelled.  We don't want to do anything with this right now, could change
                        cardsAlreadyCancelled.push(cardToBeAdded);
                    }
                } else {
                    if (
                        card.delegated_to != null &&
                        card.market_listing_type == null
                    ) {
                        cardsDelegatedOut.push(cardToBeAdded);
                    } else {
                        //uidsOfThoseNotLabeled.push(card?.uid);
                        uidsOfThoseNotLabeled.push(cardToBeAdded);
                    }
                } // other conditions dont matter because these are the only ones available for rentals
                ownedCount = ownedCount + 1;
            } else {
                cardsNotOwned.push(cardToBeAdded);
            }
        });
        window.api.bot.log({
            message: `/bot/server/actions/collection/filterCollectionArraysForPotentialRentalCards`,
        });
        window.api.bot.log({
            message: `Collection: ${collection?.length}`,
        });
        window.api.bot.log({
            message: `Available: ${cardsAvailableForRent?.length}`,
        });
        window.api.bot.log({
            message: `Cancelled: ${cardsAlreadyCancelled?.length}`,
        });
        window.api.bot.log({
            message: `Rented Out: ${cardsBeingRentedOut?.length}`,
        });
        window.api.bot.log({
            message: `Listed: ${cardsListedButNotRentedOut?.length}`,
        });
        window.api.bot.log({
            message: `Owned: ${ownedCount}`,
        });
        window.api.bot.log({
            message: `Delegated: ${cardsDelegatedOut?.length}`,
        });
        window.api.bot.log({
            message: `Not Owned: ${cardsNotOwned?.length}`,
        });
        window.api.bot.log({
            message: `Cooldown: ${cardsOnRentalCooldown?.length}`,
        });
        window.api.bot.log({
            message: `No Active Rental: ${cardsNotOnActiveRentals?.length}`,
        });
        window.api.bot.log({
            message: `Catch: ${uidsOfThoseNotLabeled?.length}`,
        });

        window.api.bot.log({
            message: `Gladius: ${gladius?.length}`,
        });
        window.api.bot.log({
            message: `Checks: 1) ${
                ownedCount + cardsNotOwned?.length === collection?.length
            } 2) ${
                ownedCount ===
                cardsAvailableForRent?.length +
                    cardsOnRentalCooldown?.length +
                    cardsAlreadyCancelled?.length +
                    cardsBeingRentedOut?.length +
                    cardsListedButNotRentedOut?.length +
                    gladius?.length +
                    cardsNotOnActiveRentals?.length +
                    uidsOfThoseNotLabeled?.length +
                    cardsDelegatedOut?.length
            }, sumAll: ${
                cardsAvailableForRent?.length +
                cardsOnRentalCooldown?.length +
                cardsAlreadyCancelled?.length +
                cardsBeingRentedOut?.length +
                cardsListedButNotRentedOut?.length +
                gladius?.length +
                cardsNotOnActiveRentals?.length +
                uidsOfThoseNotLabeled?.length +
                cardsDelegatedOut?.length
            }`,
        });
        return {
            cardsAvailableForRent,
            cardsOnRentalCooldown,
            cardsBeingRentedOut,
            cardsListedButNotRentedOut,
        };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/collection/filterCollectionArraysForPotentialRentalCards error: ${err.message}`,
        });
        throw err;
    }
};

// settings object will be the filters that the user determines to mass rent out their cards with level thresholds
/* settings = {
  "commonNorm": 4,
  "commonGold": 3,
  "rareNorm": 3,
  "rareGold": 2,
  "epicNorm": 3,
  "epicGold": 2,
  "legendaryNorm": 3,
  "legendaryGold": 2
}
*/
const filterCollectionArraysByLevelLimitThresholds = ({
    collection,
    settings,
}) => {
    try {
        // console.log(
        //     `filterCollectionArraysByLevelLimitThresholds with settings: ${settings}`
        // );
        const newArray = [];
        collection.forEach((card) => {
            const { level, rarity, gold } = card;
            let limitLevel;
            switch (rarity) {
                case 1:
                    if (gold) {
                        limitLevel = settings.commonGold;
                    } else {
                        limitLevel = settings.commonNorm;
                    }
                    break;
                case 2:
                    if (gold) {
                        limitLevel = settings.rareGold;
                    } else {
                        limitLevel = settings.rareNorm;
                    }
                    break;
                case 3:
                    if (gold) {
                        limitLevel = settings.epicGold;
                    } else {
                        limitLevel = settings.epicNorm;
                    }
                    break;
                case 4:
                    if (gold) {
                        limitLevel = settings.legendaryGold;
                    } else {
                        limitLevel = settings.legendaryNorm;
                    }
                    break;
                default:
                    throw new Error(
                        `rarity of the card does not make sense, rarity: ${rarity}`
                    );
            }
            if (parseInt(level) >= parseInt(limitLevel)) {
                newArray.push(card);
            }
        });
        return newArray;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/collection/filterCollectionArraysByLevelLimitThresholds, error: ${err.message}`,
        });
        throw err;
    }
};

const getActiveListingsObj = async ({ collection }) => {
    try {
        const activeListingsObj = {};
        const createdList = [];
        collection.forEach((card) => {
            if (
                card?.market_listing_type === 'RENT' &&
                card?.market_listing_status === 0 &&
                card?.delegated_to === null
            ) {
                activeListingsObj[card.uid] = { ...card };
                if (card?.market_created_date) {
                    const createdTime = new Date(
                        card?.market_created_date
                    ).getTime();
                    createdList.push(createdTime);
                }
            }
        });

        const lastCreatedTime = _.min(createdList);
        return { activeListingsObj, lastCreatedTime };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/collection/getActiveListingsObj, error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    filterCollectionArraysForPotentialRentalCards,
    sortCollectionArrayByLevel,
    filterCollectionArraysByLevelLimitThresholds,
    filterCollectionArrayByLevel,
    getActiveListingsObj,
};
