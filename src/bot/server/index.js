'use strict';
const {
    getCollection,
    filterCollectionArraysForPotentialRentalCards,
    filterCollectionArraysByGoldYN,
} = require('./actions/collection');
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

const { getActiveRentalsByRentalId } = require('./actions/currentRentals');

const {
    filterCollectionByRentalListings,
    filterRentalListingsByNewPostedTransactions,
} = require('./actions/updateRentalListings');
const { axiosPostInstance } = require('./requests/axiosPostInstance');
const _ = require('lodash');

const startRentalBot = async ({ username, settings, marketPrices }) => {
    try {
        console.log(`startRentalsForAccount username: ${username}`);

        const collection = await getCollection(username);
        const activeRentalsByRentalId = await getActiveRentalsByRentalId(
            username
        );
        const {
            cardsAvailableForRent,
            cardsListedButNotRentedOut,
            cardsOnRentalCooldown,
            cardsBeingRentedOut,
        } = filterCollectionArraysForPotentialRentalCards({
            username,
            collection,
            activeRentalsByRentalId,
        });

        // TNT TO DO -> save down the time until off rentalCooldown for each card in cardsOnRentalCooldown, then we will know when our bot should try and list them on the market.
        // WE SHOULD ALSO INCLUDE cardsBeingRentedOut in going through everything imo, cuz we will want to see if they ultimately are worth renting out
        const collectionByLevelObjAvailableForRent =
            transformCollectionIntoCollectionByLevelObj({
                settings,
                collection: cardsAvailableForRent,
            });

        const collectionByLevelObjLstedButNotRentedOut =
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

        console.log('rentalArrayWithPriceAndUid', rentalArrayWithPriceAndUid);

        const { relistingPriceForEachMarketId, cardsNotWorthRelisting } =
            await calculateRelistingPrice({
                collectionObj: collectionByLevelObjLstedButNotRentedOut,
            });

        const { marketIdsForCancellation, cardsNotWorthCancelling } =
            await calculateCancelActiveRentalPrices({
                collectionObj: collectionByLevelObjBeingRentedOut,
            });
        // console.log(rentalArrayWithPriceAndUid);
        // console.log(relistingPriceForEachMarketId);
        // console.log(marketIdsForCancellation);
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
        // throw new Error('checking listings');
        return {
            listings, // array of arrays that are formated by :[uid, rentalPriceInDec]
            relistings, // [uid, rentalPriceInDec]
            cancellations,
        };
    } catch (err) {
        console.error(`startRentalsForAccount error: ${err.message}`);
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
        console.error(`fmtToLimitCardsInEachHiveTx error: ${err.message}`);
        throw err;
    }
};

const updatedRentalListingsToSend = async ({
    username,
    users_id,
    listings,
    relistings,
}) => {
    try {
        console.log('updatedRentalListingsToSend start');
        // listings and relistings both arrays of arrays that have [uid, priceInDec]

        const { cardsListedButNotRentedOut, searchableRentListByUid } =
            await filterCollectionByRentalListings({ username });

        const fmtedListings = formatListingGroups({ listings });
        const fmtedRelistings = formatListingGroups({ listings: relistings });

        const rentalListings = filterRentalListingsByNewPostedTransactions({
            users_id,
            listings: fmtedListings,
            relistings: fmtedRelistings,
            searchableRentalListings: searchableRentListByUid,
        });

        return { rentalListings };
    } catch (err) {
        console.error(`updatedRentalListingsToSend error: ${err.message}`);
        throw err;
    }
};

const formatListingGroups = ({ listings }) => {
    try {
        console.log(`formatListingGroups start`);
        const fmtedListing = [];

        for (const listingGroup of listings) {
            fmtedListing.push(...listingGroup);
        }

        return fmtedListing;
    } catch (err) {
        console.error(`formatListingGroups error: ${err.message}`);
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
        console.error(`getPreciseRentalPrices error: ${err.message}`);
        throw err;
    }
};

const updateRentalListings = async ({ rentalListings }) => {
    try {
        // console.log(`updateRentalListings start`);
        const res = await axiosPostInstance(
            `${process.env.API_URL}/api/rentalListings/newrentallistings`,
            { rentalListings }
        );
        return res;
    } catch (err) {
        console.error(`updateRentalListings error: ${err.message}`);
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
    updatedRentalListingsToSend,
    updateRentalListings,
};
