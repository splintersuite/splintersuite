'use strict';
const {
    filterCollectionArraysForPotentialRentalCards,
} = require('./actions/collection');

const {
    getCurrentSeason,
    getEndOfSeasonSettings,
} = require('./actions/currentSeason');

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
    calculateRelistActiveRentalPrices,
} = require('./actions/relistRentedOutCards');
const { getCardDetailObj } = require('./actions/_helpers');
const { getActiveRentalsByRentalId } = require('./actions/currentRentals');

const splinterlandsService = require('./services/splinterlands');
const _ = require('lodash');

const startRentalBot = async ({
    username,
    settings,
    marketPrices,
    nextBotLoopTime,
}) => {
    try {
        //  console.log(`/bot/server/index/startRentalBot username: ${username}`);
        const season = await getCurrentSeason();
        const endOfSeasonSettings = getEndOfSeasonSettings({
            season,
        });

        const collection = await splinterlandsService.getCollection(username);
        // if there is a card in the collection we don't need
        // grab the card_details endpoint
        const cardDetailObj = await getCardDetailObj();
        const activeRentals = await getActiveRentalsByRentalId(username);
        const groupedRentalListObj =
            await splinterlandsService.getAllGroupedRentalsByLevel();

        const {
            cardsAvailableForRent,
            cardsListedButNotRentedOut,
            cardsBeingRentedOut,
        } = filterCollectionArraysForPotentialRentalCards({
            username,
            collection,
            activeRentalsByRentalId: activeRentals.activeRentalsByRentalTx,
            cardDetailObj,
        });

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
            groupedRentalListObj,
        });

        const { relistingPriceForEachMarketId } = await calculateRelistingPrice(
            {
                collectionObj: collectionByLevelObjListedButNotRentedOut,
                marketPrices,
                groupedRentalListObj,
            }
        );
        const { relistingPriceForActiveMarketId } =
            await calculateRelistActiveRentalPrices({
                collectionObj: collectionByLevelObjBeingRentedOut,
                marketPrices,
                nextBotLoopTime,
                activeRentalsBySellTrxId:
                    activeRentals.activeRentalsBySellTrxId,
                endOfSeasonSettings,
                groupedRentalListObj,
            });

        const listings = fmtToLimitCardsInEachHiveTx(
            rentalArrayWithPriceAndUid
        );

        const relistings = fmtToLimitCardsInEachHiveTx(
            relistingPriceForEachMarketId
        );

        const relistActive = fmtToLimitCardsInEachHiveTx(
            relistingPriceForActiveMarketId
        );

        return {
            listings, // array of arrays that are formated by :[uid, rentalPriceInDec]
            relistings, // [uid, rentalPriceInDec]
            relistActive, // [uid, rentalPriceInDec]
        };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/index/startRentalBot error: ${err.message}`,
        });
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
            message: `/bot/server/index/fmtToLimitCardsInEachHiveTx error: ${err.message}`,
        });
        throw err;
    }
};

export default {
    startRentalBot,
};
