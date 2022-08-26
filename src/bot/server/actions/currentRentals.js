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
        window.api.bot.log({
            message: `/bot/server/actions/currentRentals/activeRentalCardsInfo error: ${err.message}`,
        });
        throw err;
    }
};

const activeRentalCardsInfoByRentalTx = ({ activeRentals }) => {
    try {
        //  console.log('activeRentalCardsInfoByRentalTx start');

        const activeRentalsByRentalTx = {};
        const activeRentalsBySellTrxId = {};

        activeRentals.forEach((rental) => {
            const { rental_tx, sell_trx_id } = rental;
            activeRentalsByRentalTx[rental_tx] = rental;
            activeRentalsBySellTrxId[sell_trx_id] = rental;
        });

        return { activeRentalsByRentalTx, activeRentalsBySellTrxId };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/currentRentals/activeRentalCardsInfoByRentalTx error: ${err.message}`,
        });
        throw err;
    }
};

const getActiveRentalsByRentalId = async (username) => {
    try {
        //sByRentalId start');

        const activeRentals = await activeRentalCardsInfo(username);

        const { activeRentalsByRentalTx, activeRentalsBySellTrxId } =
            activeRentalCardsInfoByRentalTx({
                activeRentals,
            });

        return { activeRentalsByRentalTx, activeRentalsBySellTrxId };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/currentRentals/getActiveRentalsByRentalId error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getActiveRentalsByRentalId,
};
