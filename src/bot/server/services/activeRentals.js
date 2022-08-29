'use strict';

const splinterlandsService = require('./splinterlands');

const activeRentalCardsInfoByRentalTx = ({ activeRentals }) => {
    try {
        //  console.log('activeRentalCardsInfoByRentalTx start');
        // rentalTx is not unique, sellTx is unique
        const activeRentalsBySellTrxId = {};

        activeRentals.forEach((rental) => {
            const { sell_trx_id } = rental;
            activeRentalsBySellTrxId[sell_trx_id] = rental;
        });

        return { activeRentalsBySellTrxId };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/activeRentals/activeRentalCardsInfoByRentalTx error: ${err.message}`,
        });
        throw err;
    }
};

const getActiveRentalsByRentalId = async (username) => {
    try {
        //sByRentalId start');

        const activeRentals = await splinterlandsService.activeRentalCardsInfo(
            username
        );

        const { activeRentalsBySellTrxId } = activeRentalCardsInfoByRentalTx({
            activeRentals,
        });

        window.api.bot.log({
            message: `/bot/server/services/activeRentals/getActiveRentalsByRentalId`,
        });
        window.api.bot.log({
            message: `User: ${username}`,
        });
        window.api.bot.log({
            message: `Active Rentals: ${activeRentals?.length}`,
        });
        window.api.bot.log({
            message: `By Sell Tx: ${
                Object.keys(activeRentalsBySellTrxId)?.length
            }`,
        });
        window.api.bot.log({
            message: `Check: ${
                Object.keys(activeRentalsBySellTrxId)?.length ===
                activeRentals?.length
            }`,
        });
        return { activeRentalsBySellTrxId };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/activeRentals/getActiveRentalsByRentalId error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getActiveRentalsByRentalId,
};
