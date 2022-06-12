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

const startRentalBot = async ({ username, settings }) => {
    try {
        console.log(`startRentalsForAccount username: ${username}`);

        const collection = await getCollection(username);

        const {
            cardsAvailableForRent,
            cardsListedButNotRentedOut,
            cardsOnRentalCooldown,
            cardsBeingRentedOut,
        } = filterCollectionArraysForPotentialRentalCards({
            username,
            collection,
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

        // this gives us the output of [uid, rentalPriceInDec] which is needed for initial market listings.
        const rentalArrayWithPriceAndUid = await calculateRentalPriceToList({
            collectionObj: collectionByLevelObjAvailableForRent,
        });

        // TNT TODO: debug why this aspect isnt working
        const { relistingPriceForEachMarketId, cardsNotWorthRelisting } =
            await calculateRelistingPrice({
                collection: collectionByLevelObjLstedButNotRentedOut,
            });

        console.log('relistingPriceForEachMarketId: ');
        console.log(relistingPriceForEachMarketId);

        console.log('cardsNotWorthRelisting: ');
        console.log(cardsNotWorthRelisting);

        console.log(rentalArrayWithPriceAndUid);
        // we would also want to make sure that cards already listed are seperated
        return rentalArrayWithPriceAndUid;
    } catch (err) {
        console.error(`startRentalsForAccount error: ${err.message}`);
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
