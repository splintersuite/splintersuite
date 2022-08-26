'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');
const { sleep } = require('../axios_retry/general');

const getCollection = async (username) => {
    try {
        const url = `https://api2.splinterlands.com/cards/collection`;

        const res = await axiosInstance(`${url}/${username}`);

        const data = res.data;
        const collection = data.cards;

        window.api.bot.log({
            message: `/bot/server/actions/collection/getCollection done for user: ${username}`,
        });
        return collection;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/collection/getCollection error: ${err.message}`,
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
        for (const level of levels) {
            const groupedRentalList = await getGroupedRentalsForLevel({
                level,
            });
            rentalObject[level] = groupedRentalList;
            await sleep(1000);
        }

        window.api.bot.log({
            message: `got all grouped rental listings`,
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
// https://api2.splinterlands.com/market/for_rent_by_card?min_level=3&max_level=4&card_detail_id=353&edition=7&gold=false

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
};
