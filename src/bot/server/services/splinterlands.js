'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');
const { sleep } = require('../axios_retry/general');

const activeRentalCardsInfo = async (username) => {
    try {
        //console.log('activeRentalCardsInfo start');
        // limit is 1k https://docs.splinterlands.com/platform/release-notes#2022-01-04

        const url = 'https://api2.splinterlands.com/market/active_rentals';

        const res = await axiosInstance(url, {
            params: {
                owner: username,
            },
        });
        const results = res.data;

        return results;
        // TNT NOTE: my only concern with this endpoint is some sort of limit so potentially need pagination to get all of them, tbd though (and the return from collection filterCollectionArraysForPotentialRentalCards will have all the actual listed ones, so can compare
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/activeRentalCardsInfo error: ${err.message}`,
        });
        throw err;
    }
};

const getCollection = async (username) => {
    try {
        const url = `https://api2.splinterlands.com/cards/collection`;

        const res = await axiosInstance(`${url}/${username}`);

        const data = res.data;
        const collection = data.cards;

        window.api.bot.log({
            message: `/bot/server/services/collection/getCollection`,
        });
        window.api.bot.log({
            message: `User: ${username}`,
        });
        window.api.bot.log({
            message: `Collection: ${collection?.length}`,
        });
        return collection;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/getCollection error: ${err.message}`,
        });
        throw err;
    }
};

const getGroupedRentalsForLevel = async ({ level }) => {
    try {
        //  console.log(`getGroupedRentalsForLevel start`);

        const url = 'https://api2.splinterlands.com/market/for_rent_grouped';

        const res = await axiosInstance(url, {
            params: {
                level,
            },
        });

        const groupedRentalsList = res.data;

        return groupedRentalsList;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/splinterlands/getGroupedRentalsForLevel error: ${err.message}`,
        });
        throw err;
    }
};

const getAllGroupedRentalsByLevel = async () => {
    try {
        //    console.log(`getAllGroupedRentalsByLevel start`);
        const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const rentalObject = {};
        const lengths = [];
        for (const level of levels) {
            const groupedRentalList = await getGroupedRentalsForLevel({
                level,
            });
            rentalObject[level] = groupedRentalList;
            lengths.push(groupedRentalList?.length);
            await sleep(1000);
        }

        window.api.bot.log({
            message: `/bot/server/services/splinterlands/getAllGroupedRentalsByLevel`,
        });
        window.api.bot.log({
            message: `Levels: ${Object.keys(rentalObject)?.length}`,
        });
        window.api.bot.log({
            message: `Level Lengths: ${JSON.stringify(lengths)}`,
        });
        return rentalObject;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/splinterlands/getAllGroupedRentalsByLevel error: ${err.message}`,
        });
        throw err;
    }
};

// https://api2.splinterlands.com/market/for_rent_grouped?level=10&

// sorts groupedRentalList (array of objects) into an object where we can search by card_detail_id, gold, and edition of the card in price data
const convertForRentGroupOutputToSearchableObject = ({
    groupedRentalsList,
}) => {
    try {
        //     console.log(`convertForRentGroupOutputToSearchableObject start`);

        const newSearchableRentList = {};
        groupedRentalsList.forEach((cardData) => {
            const { card_detail_id, gold, edition } = cardData;
            let _gold = 'F';
            if (gold) {
                _gold = 'T';
            } else {
                _gold = 'F';
            }

            const idAndGoldAndEdition = `${card_detail_id}${_gold}${edition}`;

            newSearchableRentList[idAndGoldAndEdition] = cardData;
        });

        return newSearchableRentList;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/splinterlands/convertForRentGroupOutputToSearchableObject error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
    getAllGroupedRentalsByLevel,
    getCollection,
    activeRentalCardsInfo,
};
