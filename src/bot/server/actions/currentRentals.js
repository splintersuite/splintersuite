'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');

// TNT overall note: this is a function we can use to essentially cross reference/validate cards that we find in the collection that we classify as being rented out

// https://discord.com/channels/447924793048825866/567729128900526120/882406218344316968
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
        console.error(`activeRentalCardsInfo error: ${err.message}`);
        throw err;
    }
};

const activeRentalCardsInfoByRentalTx = ({ activeRentals }) => {
    try {
        console.log('activeRentalCardsInfoByRentalTx start');

        const newActiveRentals = {};

        activeRentals.forEach((rental) => {
            const { rental_tx } = rental;
            newActiveRentals[rental_tx] = rental;
        });

        return newActiveRentals;
    } catch (err) {
        console.error(`activeRentalCardsInfoByRentalTx error: ${err.message}`);
        throw err;
    }
};

const getActiveRentalsByRentalId = async (username) => {
    try {
        console.log('getActiveRentalsByRentalId start');

        const activeRentals = await activeRentalCardsInfo(username);

        const newActiveRentals = activeRentalCardsInfoByRentalTx({
            activeRentals,
        });

        return newActiveRentals;
    } catch (err) {
        console.error(`getActiveRentalsByRentalId error: ${err.message}`);
        throw err;
    }
};

module.exports = {
    getActiveRentalsByRentalId,
};
