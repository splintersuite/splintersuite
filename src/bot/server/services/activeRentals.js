'use strict';

const splinterlandsService = require('./splinterlands');

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

        const { activeRentalsByRentalTx, activeRentalsBySellTrxId } =
            activeRentalCardsInfoByRentalTx({
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
            message: `By Rental Tx: ${
                Object.keys(activeRentalsByRentalTx)?.length
            }`,
        });
        window.api.bot.log({
            message: `By Sell Tx: ${
                Object.keys(activeRentalsBySellTrxId)?.length
            }`,
        });
        return { activeRentalsByRentalTx, activeRentalsBySellTrxId };
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
