'use strict';
const datesUtil = require('../../util/dates');
const hive = require('./hive');

const updateRentalsStore = async ({
    username,
    rentalDetailsObj,
    activeListingsObj,
    activeRentals,
    // price update object?
}) => {
    try {
        // continue with adding here...
        console.log(`/bot/server/services/rentalDetails/updateRentalStore`);
        // console.log(`rentalDetailsObj: ${JSON.stringify(rentalDetailsObj)}`);
        // console.log(`activeListingsObj: ${JSON.stringify(activeListingsObj)}`);
        // console.log(`activeRentals: ${JSON.stringify(activeRentals)}`);

        const hiveRelistings = await hive.getPostedSuiteRelistings({
            username,
        });
        console.log(`hiveRelistings: ${JSON.stringify(hiveRelistings)}`);

        if (!rentalDetailsObj) {
            const rentalDetails = buildNewRentalDetailsObj({
                activeRentals,
                activeListingsObj,
                hiveRelistings,
            });
            // console.log(
            //     `rentalDetails after we build new one: ${JSON.stringify(
            //         rentalDetails
            //     )}`
            // );
            await window.api.bot.updateRentalDetails({ rentalDetails });
            return;
        } else {
            window.api.bot.log({
                message: `/bot/server/services/rentalDetails/updateRentalStore found a rentalDetailsObj of :${JSON.stringify(
                    rentalDetailsObj
                )}`,
            });
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
const buildNewRentalDetailsObj = ({
    activeRentals,
    activeListingsObj,
    hiveRelistings,
}) => {
    try {
        const rentalDetailsObj = {};
        console.log(
            `/bot/server/services/rentalDetails/buildNewRentalDetailsObj start`
        );

        for (const [tx_id, rental] of Object.entries(activeRentals)) {
            if (rentalDetailsObj[rental.card_id] == null) {
                // console.log(
                //     `/bot/server/services/rentalDetails/buildNewRentalDetailsObj rental: ${JSON.stringify(
                //         rental
                //     )}, Object.keys(activeRentals): ${JSON.stringify(
                //         Object.keys(activeRentals)
                //     )}`
                // );
                const { next_rental_payment, buy_price } = rental;
                console.log(
                    `/bot/server/services/rentalDetails/buildNewRentalDetailsObj next_rental_payment : ${next_rental_payment}, buy_price: ${buy_price}, rental: ${JSON.stringify(
                        rental
                    )}`
                );
                const _next_rental_payment = new Date(next_rental_payment);
                const oneDayBefore = datesUtil.getNumDaysAgo({
                    numberOfDaysAgo: 1,
                    date: _next_rental_payment,
                });
                if (
                    oneDayBefore ||
                    oneDayBefore?.daysAgo ||
                    oneDayBefore?.msDaysAgo
                ) {
                    const last_rental_payment = oneDayBefore.daysAgo;
                    const last_rental_payment_time = oneDayBefore.msDaysAgo;

                    rentalDetailsObj[rental.card_id] = {
                        is_rented: true,
                        last_rental_payment,
                        last_rental_payment_time,
                        last_price_update: null,
                        buy_price,
                    };
                } else {
                    console.log(
                        `/bot/server/services/rentalDetails/buildNewRentalDetailsObj issue with oneDayBefore: ${JSON.stringify(
                            oneDayBefore
                        )}`
                    );
                }
            } else {
                window.api.bot.log({
                    message: `/bot/server/services/rentalDetails/buildNewRentalDetailsObj rentalDetailsObj[rental.card_uid] wasnt empty: ${JSON.stringify(
                        rentalDetailsObj[rental.card_uid]
                    )}`,
                });
                throw new Error(
                    `/bot/server/services/rentalDetails/buildNewRentalDetailsObj rentalDetailsObj[rental.card_uid] wasnt empty: ${JSON.stringify(
                        rentalDetailsObj[rental.card_uid]
                    )}`
                );
            }
        }

        for (const listing of Object.keys(activeListingsObj)) {
            if (rentalDetailsObj[listing.uid] == null) {
                const { market_created_date, buy_price } = listing;
                rentalDetailsObj[listing.uid] = {
                    is_rented: false,
                    last_rental_payment: null,
                    last_rental_payment_time: null,
                    last_price_update: market_created_date,
                    buy_price,
                };
            }
        }

        if (hiveRelistings && Object.keys(hiveRelistings)?.length > 1) {
            return rentalDetailsObj;
        } else {
            console.log(`we don't have hiveRelistings!`);
            return rentalDetailsObj;
        }
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
// price: {
// type: 'number'
// }

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
