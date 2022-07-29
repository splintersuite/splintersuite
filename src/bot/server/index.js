'use strict';
const {
    getCollection,
    filterCollectionArraysForPotentialRentalCards,
    filterCollectionArraysByGoldYN,
} = require('./actions/collection');

const {
    getCurrentSeason,
    getEndOfSeasonSettings,
} = require('./actions/currentSeason');

const {
    getRentalInfoObjectFromCollection,
} = require('./actions/rentalListInfo');

const {
    calculateRentalPriceToList,
} = require('./actions/calculateRentalPriceToList');

const {
    transformCollectionIntoCollectionByLevelObj,
} = require('./actions/getRentalPricesForGrouped');

const {
    calculateRelistingPrice,
} = require('./actions/calculateRelistingPrice');

const {
    calculateCancelActiveRentalPrices,
} = require('./actions/calculateFilledRentalsToBeCancelled');

const { updateCardDetails } = require('./actions/_helpers');

const { getActiveRentalsByRentalId } = require('./actions/currentRentals');

const _ = require('lodash');

const startRentalBot = async ({
    username,
    settings,
    marketPrices,
    nextBotLoopTime,
}) => {
    try {
        console.log(`startRentalsForAccount username: ${username}`);
        const season = await getCurrentSeason();
        const endOfSeasonSettings = getEndOfSeasonSettings({
            season,
        });

        const collection = await getCollection(username);
        // if there is a card in the collection we don't need
        // grab the card_details endpoint
        await updateCardDetails(collection);

        const activeRentals = await getActiveRentalsByRentalId(username);

        const {
            cardsAvailableForRent,
            cardsListedButNotRentedOut,
            cardsOnRentalCooldown,
            cardsBeingRentedOut,
        } = filterCollectionArraysForPotentialRentalCards({
            username,
            collection,
            activeRentalsByRentalId: activeRentals.activeRentalsByRentalTx,
        });

        // TNT TO DO -> save down the time until off rentalCooldown for each card in cardsOnRentalCooldown, then we will know when our bot should try and list them on the market.
        // WE SHOULD ALSO INCLUDE cardsBeingRentedOut in going through everything imo, cuz we will want to see if they ultimately are worth renting out
        const collectionByLevelObjAvailableForRent =
            transformCollectionIntoCollectionByLevelObj({
                settings,
                collection: cardsAvailableForRent,
            });

        const collectionByLevelObjListedButNotRentedOut =
            transformCollectionIntoCollectionByLevelObj({
                settings,
                collection: cardsListedButNotRentedOut,
            });

        const collectionByLevelObjBeingRentedOut =
            transformCollectionIntoCollectionByLevelObj({
                settings,
                collection: cardsBeingRentedOut,
            });

        // this gives us the output of [uid, rentalPriceInDec] which is needed for initial market listings.
        const rentalArrayWithPriceAndUid = await calculateRentalPriceToList({
            collectionObj: collectionByLevelObjAvailableForRent,
            marketPrices,
        });

        const { relistingPriceForEachMarketId, cardsNotWorthRelisting } =
            await calculateRelistingPrice({
                collectionObj: collectionByLevelObjListedButNotRentedOut,
                marketPrices,
            });

        const { marketIdsForCancellation, cardsNotWorthCancelling } =
            await calculateCancelActiveRentalPrices({
                collectionObj: collectionByLevelObjBeingRentedOut,
                marketPrices,
                activeRentalsBySellTrxId:
                    activeRentals.activeRentalsBySellTrxId,
                nextBotLoopTime,
                endOfSeasonSettings,
            });
        //   throw new Error('checking the listingPrice handleListingsTooHigh');
        // we would also want to make sure that cards already listed are seperated
        const listings = fmtToLimitCardsInEachHiveTx(
            rentalArrayWithPriceAndUid
        );

        const relistings = fmtToLimitCardsInEachHiveTx(
            relistingPriceForEachMarketId
        );

        const cancellations = fmtToLimitCardsInEachHiveTx(
            marketIdsForCancellation
        );

        return {
            listings, // array of arrays that are formated by :[uid, rentalPriceInDec]
            relistings, // [uid, rentalPriceInDec]
            cancellations,
        };
    } catch (err) {
        window.api.bot.log({
            message: err.message,
        });
        console.error(`startRentalsForAccount error: ${err.message}`);
        console.log(err.stack);
        throw err;
    }
};

const fmtToLimitCardsInEachHiveTx = (input) => {
    try {
        const dataLimit = 100;
        let chunks = input;
        if (input.length > dataLimit) {
            chunks = _.chunk(input, dataLimit);
        }

        if (chunks.length === input.length) {
            chunks = [chunks];
        }
        let outputArray = [];
        for (const transChunk of chunks) {
            outputArray.push(transChunk);
        }
        return outputArray;
    } catch (err) {
        window.api.bot.log({
            message: err.message,
        });
        console.error(`fmtToLimitCardsInEachHiveTx error: ${err.message}`);
        throw err;
    }
};

// tnt note: this was what I was doing to find the most precise data before I learned about grouped_by endpoint.
// need to sort them by filteredUserLevelLimits, before going back in more depth. TNT TODO: finisht he more precise algorithmn later
const getPreciseRentalPrices = ({ cardsFilteredByUserLevelLimits }) => {
    try {
        const { normCollection, goldCollection } =
            filterCollectionArraysByGoldYN({
                collection: cardsFilteredByUserLevelLimits,
            });

        const normCardsByDetailId = getRentalInfoObjectFromCollection({
            collection: normCollection,
        });

        const goldCardsByDetailId = getRentalInfoObjectFromCollection({
            collection: goldCollection,
        });
    } catch (err) {
        window.api.bot.log({
            message: err.message,
        });
        console.error(`getPreciseRentalPrices error: ${err.message}`);
        throw err;
    }
};

const settings = {
    commonNorm: 9,
    commonGold: 9,
    rareNorm: 7,
    rareGold: 7,
    epicNorm: 2,
    epicGold: 2,
    legendaryNorm: 2,
    legendaryGold: 2,
};

// startRentalBot({ username: "hackinhukk", settings });
export default {
    startRentalBot,
};
