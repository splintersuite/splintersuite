'use strict';

const updateRentalsStore = ({
    rentalDetailsObj,
    activeListingsObj,
    activeRentals,
    // price update object?
}) => {
    try {
        // continue with adding here...
        console.log(`/bot/server/services/rentalDetails/updateRentalStore`);
        console.log(`rentalDetailsObj: ${JSON.stringify(rentalDetailsObj)}`);
        console.log(`activeListingsObj: ${JSON.stringify(activeListingsObj)}`);
        console.log(`activeRentals: ${JSON.stringify(activeRentals)}`);
        const rentDetails = {};
        if (!rentalDetailsObj) {
            const rentalDetObj = {};
            return;
        } else {
            if (activeRentals) {
                const rentalIDs = Object.keys(activeRentals);
                rentalIDs.forEach((rental) => {
                    if (rentalDetailsObj[rental.card_uid] == null) {
                        rentalDetailsObj[rental.card_uid] = { is_rented: true };
                        // last_rental_payment -> needs to be a date
                        // last_price_update -> is a date
                    }
                });
                return;
            } else {
                return;
                // const rentalDetails = activeListingsObj =
            }
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/updateRentalStore error: ${err.message}`,
        });
        throw err;
    }
};

// this is for when the rentalDetailObject is not populated, either because the store got cleared or its the first usage.
// we also need input of the relisting actions, so we can see when we last changed the price for the activeListingsObj
const buildNewRentalDetailsObj = ({ activeRentals, activeListingsObj }) => {
    try {
        const rentalDetailsObj = {};

        for (const rental of Object.keys(activeRentals)) {
        }
        const rentalIDs = Object.keys(activeRentals);

        rentalIDs.forEach((rental) => {});
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/buildNewRentalDetailsObj error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    updateRentalsStore,
};

// is_rented: {
//     type: 'boolean',
// },
// last_rental_payment: {
//     type: 'date',
// },
// last_price_update: {
//     type: 'date',
// },

/*
activeRentals: {"03f88a3bdd4a3b53ecb0097ad4341168bc36bc34-35":{"id":102228745,
"sell_trx_id":"03f88a3bdd4a3b53ecb0097ad4341168bc36bc34-35","seller":"xdww"
,"num_cards":1,"buy_price":"0.100","fee_percent":500,"market_item_id":102228745,"rental_tx":"6fc485f0db688d5065eed83c2c37194ee0163575",
"rental_date":"2022-08-15T17:25:39.000Z","renter":"tyuyt65","status":1,"market_account":"peakmonsters","rental_days":28,
"next_rental_payment":"2022-09-12T17:25:39.000Z","payment_currency":"DEC","payment_amount":"2.800","escrow_currency":"DEC",
"escrow_amount":"2.800","paid_amount":"2.800","cancel_tx":null,"cancel_player":null,"cancel_date":null,"card_id":"C7-400-21XUCZ5ULS",
"card_detail_id":400,"gold":false,"xp":1,"edition":7},

"03f88a3bdd4a3b53ecb0097ad4341168bc36bc34-36":{"id":102228746,"sell_trx_id":"03f88a3bdd4a3b53ecb0097ad4341168bc36bc34-36","seller":"xdww","num_cards":1,"buy_price":"0.100","fee_percent":500,"market_item_id":102228746,"rental_tx":"66a6dce6d697b3ddfc86ff32fc33ca21e17aa36e","rental_date":"2022-08-15T17:25:39.000Z","renter":"ddsfds55","status":1,"market_account":"peakmonsters","rental_days":28,"next_rental_payment":"2022-09-12T17:25:39.000Z","payment_currency":"DEC","payment_amount":"2.800","escrow_currency":"DEC","escrow_amount":"2.800","paid_amount":"2.800","cancel_tx":null,"cancel_player":null,"cancel_date":null,"card_id":"C7-400-TI6JFNG0G0","card_detail_id":400,"gold":false,"xp":1,"edition":7},"03f88a3bdd4a3b53ecb0097ad4341168bc36bc34-38":





activeListingsObj: 
{"C3-351-EZPR8TW4YO":{"player":"xdww","uid":"C3-351-EZPR8TW4YO","card_detail_id":351,"xp":1,"gold":false,"edition":3,
"market_id":"95b8e46d0db5fda18ee0178ddef2f25fa8bc8565-25","buy_price":"0.391","market_listing_type":"RENT","market_listing_status":0,
"market_created_date":"2022-09-04T14:43:30.000Z","last_used_block":67788161,"last_used_player":"hd606",
"last_used_date":"2022-09-10T14:12:43.268Z","last_transferred_block":67586058,"last_transferred_date":"2022-09-03T13:26:51.000Z",
"alpha_xp":null,"delegated_to":null,"delegation_tx":"sm_rental_payments_67788860","skin":null,"delegated_to_display_name":null,
"display_name":null,"lock_days":null,"unlock_date":null,"level":1},


"C3-351-SGUY1XLRGG":

*/
