'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');

const { sortCollectionArrayByDetailId } = require('./collection');

// https://api2.splinterlands.com/market/for_rent_by_card?card_detail_id=5&gold=false&edition=0

// gives back the active rentals for that specific card

const getAllRentalsForCard = async ({ card_detail_id, gold, edition }) => {
    try {
        // console.log(
        //     `getAllRentalsForCard start with card_detail_id ${card_detail_id}, gold: ${gold}, edition: ${edition}`
        // );
        const url = 'https://api2.splinterlands.com/market/for_rent_by_card';
        const res = await axiosInstance(url, {
            params: {
                card_detail_id,
                gold,
                edition,
            },
        });

        const rentals = res.data;

        if (rentals.length === 0) {
            console.warn(
                'this means there are no active rentals listed for the card at any bcx being rented out'
            );
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/rentalListInfo/getAllRentalsForCard error: ${err.message}`,
        });
        throw err;
    }
};

const getGroupedRentalsForLevel = async ({ level }) => {
    try {
        // console.log(`getGroupedRentalsForLevel start`);

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
            message: `/bot/server/actions/rentalListInfo/getGroupedRentalsForLevel error: ${err.message}`,
        });
        throw err;
    }
};

// https://api2.splinterlands.com/market/for_rent_grouped?level=10&
// https://api2.splinterlands.com/market/for_rent_by_card?min_level=3&max_level=4&card_detail_id=353&edition=7&gold=false

// this actually does work, so doesn't seem like we will need calculateCardLevel.js

// the collection input needs to be sorted by card_detail_id or it does not work
const getRentalInfoObjectFromCollection = ({ collection }) => {
    try {
        //  console.log(`getRentalInfoObjectFromCollection start`);

        const sortedCollectionByDetailId = sortCollectionArrayByDetailId({
            collection,
        });

        const rentalInfo = filterRentalInfoObjectFromCollectionbyDetailId({
            collection: sortedCollectionByDetailId,
        });

        return rentalInfo;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/rentalListInfo/getRentalInfoObjectFromCollection error: ${err.message}`,
        });
        throw err;
    }
};

const filterRentalInfoObjectFromCollectionbyDetailId = ({ collection }) => {
    try {
        // console.log(`filterRentalInfoObjectFromCollectionbyDetailId start`);
        const allCardsForDetailId = {};
        const lengthOfCollection = collection.length;
        let numberOfRuns = 0;
        let tempArray = [];
        let lastDetailId = 0;
        let firstLoopRun = true;
        collection.forEach((card) => {
            const { card_detail_id } = card;
            if (card_detail_id > lastDetailId) {
                if (!firstLoopRun) {
                    allCardsForDetailId[lastDetailId] = tempArray;
                    tempArray = [];
                    lastDetailId = card_detail_id;
                    tempArray.push(card);
                } else {
                    lastDetailId = card_detail_id;
                    tempArray.push(card);
                    firstLoopRun = false;
                }
            } else if ((card_detail_id = lastDetailId)) {
                tempArray.push(card);
            } else {
                window.api.bot.log({
                    message: `somehow the card_detail_id is not > or = to the lastDetailId: ${lastDetailId}`,
                });
                throw new Error(
                    `the sorting for this collection must not be working`
                );
            }
            if (lengthOfCollection < numberOfRuns) {
                allCardsForDetailId[level] = tempArray;
            }
            numberOfRuns = numberOfRuns + 1;
        });

        return allCardsForDetailId;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/rentalListInfo/filterRentalInfoObjectFromCollectionbyDetailId error: ${err.message}`,
        });
        throw err;
    }
};

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
            message: `/bot/server/actions/rentalListInfo/convertForRentGroupOutputToSearchableObject error: ${err.message}`,
        });
        throw err;
    }
};
module.exports = {
    getRentalInfoObjectFromCollection,
    getGroupedRentalsForLevel,
    convertForRentGroupOutputToSearchableObject,
};
