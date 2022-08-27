'use strict';

const splinterlandsService = require('./splinterlands');

const activeRentalCardsInfoByRentalTx = ({ activeRentals }) => {
    try {
        //  console.log('activeRentalCardsInfoByRentalTx start');
        // rentalTx is not unique, sellTx is unique, therefor getting rid of the rental_tx
        //  const activeRentalsByRentalTx = {};
        const activeRentalsBySellTrxId = {};

        activeRentals.forEach((rental) => {
            const { sell_trx_id } = rental;
            //const { rental_tx, sell_trx_id } = rental;
            // activeRentalsByRentalTx[rental_tx] = rental;
            activeRentalsBySellTrxId[sell_trx_id] = rental;
        });
        return { activeRentalsBySellTrxId };
        // return { activeRentalsByRentalTx, activeRentalsBySellTrxId };
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
        /*
      02:38:52.668 › [27/08/2022 02:38:52 -04:00] Active Rentals: 19135
02:38:52.668 › [27/08/2022 02:38:52 -04:00] By Rental Tx: 11253
02:38:52.670 › [27/08/2022 02:38:52 -04:00] By Sell Tx: 19135
*/
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
