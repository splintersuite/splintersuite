'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');
const { findCardDetails, isOnCooldown } = require('./_helpers.js');
const { getActiveRentalsByRentalId } = require('./currentRentals');

const getCollection = async (username) => {
    try {
        const url = `https://api2.splinterlands.com/cards/collection`;

        const res = await axiosInstance(`${url}/${username}`);

        const data = res.data;

        const collection = data.cards;
        return collection;
    } catch (err) {
        console.error(`getCollection error: ${err.message}`);
        throw err;
    }
};

const sortCollectionArrayByLevel = ({ collection }) => {
    try {
        //  console.log(`sortArrayByLevel start`);

        const sortedArray = collection.sort((a, b) => a.level - b.level);
        return sortedArray;
    } catch (err) {
        console.error(`sortArrayByLevel error: ${err.message}`);
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
                console.error(
                    `somehow the level: ${level} is not > or = to the lastLevel: ${lastLevel}`
                );
                throw new Error(
                    `the sorting for this collection by level must not be working`
                );
            }
            if (lengthOfCollection - 1 <= numberOfRuns) {
                console.log(
                    'we have iterated through the entire collection array at this point'
                );
                allCardsForLevel[level] = tempArray;
            }
            numberOfRuns = numberOfRuns + 1;
        });

        return allCardsForLevel;
    } catch (err) {
        console.error(`filterCollectionArrayByLevel error: ${err.message}`);
        throw err;
    }
};

const filterCollectionArraysForPotentialRentalCards = ({
    username,
    collection,
    activeRentalsByRentalId,
}) => {
    try {
        //  console.log('filterCollectionArraysForPotentialRentalCards start');

        const cardsAvailableForRent = [];

        const cardsOnRentalCooldown = [];

        const cardsBeingRentedOut = [];

        const cardsListedButNotRentedOut = [];

        const cardsAlreadyCancelled = [];

        // need to convert from array of cards into object where key = rental_tx (aka delegation_tx)
        collection.forEach((card) => {
            const cardToBeAdded = card;
            const { rarity, tier } = findCardDetails(card.card_detail_id);
            cardToBeAdded.rarity = rarity;
            cardToBeAdded.tier = tier;
            if (card.player === username && card.delegated_to == null) {
                if (
                    card.last_used_player === username &&
                    card.market_listing_type == null &&
                    card.last_used_date != null &&
                    isOnCooldown(card.last_used_date)
                ) {
                    console.log(
                        'card is on cooldown, can rent once its off CD'
                    );
                    cardsOnRentalCooldown.push(cardToBeAdded);
                } else if (
                    card.last_used_date != null &&
                    isOnCooldown(card.last_used_date) &&
                    card.last_transferred_date != null &&
                    isOnCooldown(card.last_transferred_date)
                ) {
                    console.log(
                        'card was on cooldown before, was then transferred to this account with the cooldown active, and is still on cooldown'
                    );
                    cardsOnRentalCooldown.push(cardToBeAdded);
                } else if (
                    card.market_listing_type === 'RENT' &&
                    card.market_listing_status === 0
                ) {
                    cardsListedButNotRentedOut.push(cardToBeAdded);
                } else {
                    /*console.log(
            "card is not on cooldown, listed for rent, or delegated to anyone, and owned by the player. Can rent it out"
          );*/
                    cardsAvailableForRent.push(cardToBeAdded);
                }
            } else if (
                card.player === username &&
                card.market_listing_type === 'RENT' &&
                card.delegated_to != null
            ) {
                // delegation_tx from here === rental_tx from active_rentals
                const currentRental =
                    activeRentalsByRentalId[card.delegation_tx];
                if (currentRental.cancel_tx == null) {
                    cardsBeingRentedOut.push(cardToBeAdded);
                } else {
                    // this would mean the cancel_tx has a value, and therefore the rental was cancelled.  We don't want to do anything with this right now, could change
                    cardsAlreadyCancelled.push(cardToBeAdded);
                }
            } // other conditions dont matter because these are the only ones available for rentals
        });
        // console.log('filterCollectionArraysForPotentialRentalCards done');
        return {
            cardsAvailableForRent,
            cardsOnRentalCooldown,
            cardsBeingRentedOut,
            cardsListedButNotRentedOut,
        };
    } catch (err) {
        console.error(
            `filterCollectionArraysForPotentialRentalCards error: ${err.message}`
        );
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
        // console.log(`settings`);
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
                    throw new Error(`this should not happen`);
                    console.error(
                        `card does not have a rarity that either exists or is outside of the integer range 1-4.  Card_detail_id is ${card.card_detail_id}, cardUid is: ${card.uid}, Value of rarity is ${rarity}`
                    );
            }
            if (parseInt(level) >= parseInt(limitLevel)) {
                newArray.push(card);
            } else {
                //  console.log(`this card is being excluded`);
            }
        });
        return newArray;
    } catch (err) {
        console.error(
            `filterCollectionArraysByLevelLimitThresholds, error: ${err.message}`
        );
        throw err;
    }
};

// TNT NOTE; actually using this in the more precise data function (which is very much under development rn)
const filterCollectionArraysByGoldYN = ({ collection }) => {
    try {
        //   console.log(`filterCollectionArraysByGoldYN start`);

        const normCollection = [];
        const goldCollection = [];

        collection.forEach((card) => {
            const { gold } = card;
            if (gold) {
                goldCollection.push(card);
            } else {
                normCollection.push(card);
            }
        });

        return { normCollection, goldCollection };
    } catch (err) {
        console.error(`filterCollectionArraysByGoldYN error: ${err.message}`);
        throw err;
    }
};

module.exports = {
    getCollection,
    filterCollectionArraysForPotentialRentalCards,
    sortCollectionArrayByLevel,
    filterCollectionArraysByLevelLimitThresholds,
    filterCollectionArraysByGoldYN,
    filterCollectionArrayByLevel,
};

// EVERYTHING BELOW is currently unused but was being used when I only knew the more reliable endpoint, rather than aggregate one we use right now.  Will likely be useful as we make it more robust

// TNT NOTE: unused in current algo
const sortCollectionArrayByDetailId = ({ collection }) => {
    try {
        //console.log(`sortCollectionArrayByDetailId start`);
        const sortedArray = collection.sort(
            (a, b) => a.card_detail_id - b.card_detail_id
        );

        return sortedArray;
    } catch (err) {
        console.error(`sortCollectionArrayByDetailId error: ${err.message}`);
        throw err;
    }
};

// TNT NOTE: Unused but may be useful later
const filterCollectionArraysByRarity = ({ collection }) => {
    try {
        // console.log(`filterCollectionArraysByRarity start`);
        const commons = [];
        const rares = [];
        const epics = [];
        const legendaries = [];

        collection.forEach((card) => {
            const { rarity } = card;
            switch (rarity) {
                case 1:
                    commons.push(card);
                    break;
                case 2:
                    rares.push(card);
                    break;
                case 3:
                    epics.push(card);
                    break;
                case 4:
                    legendaries.push(card);
                    break;
                default:
                    console.error(
                        `card does not have a rarity that either exists or is outside of the integer range 1-4.  Card_detail_id is ${card.card_detail_id}, cardUid is: ${card.uid}, Value of rarity is ${rarity}`
                    );
            }
        });

        return {
            commons,
            rares,
            epics,
            legendaries,
        };
    } catch (err) {
        console.error(`filterCollectionArraysByRarity error: ${err.message}`);
        throw err;
    }
};

const filterCollectionArrayByUid = ({ collection }) => {
    try {
        //   console.log('filterCollectionArrayToObject start');
        const newCollection = {};
        collection.forEach((card) => {
            const { uid } = card;
            newCollection[uid] = card;
        });

        return newCollection;
    } catch (err) {
        console.error(`filterCollectionArrayToObject`);
        throw err;
    }
};

// TNT NOTE: I think this could get used in the more precise data part
const filterCollectionRarityArraysByGold = ({ collection }) => {
    try {
        //   console.log(`filterCollectionRarityArraysByGold start`);

        const normalCards = [];
        const goldCards = [];
        collection.forEach((card) => {
            const { gold } = card;
            if (gold) {
                goldCards.push(card);
            } else {
                normalCards.push(card);
            }
        });

        return { normalCards, goldCards };
    } catch (err) {
        console.error(
            `filterCollectionRarityArraysByGold error: ${err.message}`
        );
        throw err;
    }
};
