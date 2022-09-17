'use strict';

const datesUtil = require('../../util/dates');
const hive = require('./hive');

const updateRentalsStore = async ({
    username,
    rentalDetailsObj,
    activeListingsObj,
    lastCreatedTime,
    activeRentals,
    // price update object?
}) => {
    try {
        // continue with adding here...
        console.log(`/bot/server/services/rentalDetails/updateRentalStore`);

        const activeListingsHiveObj = await addInHiveData({
            username,
            activeListingsObj,
            lastCreatedTime,
            activeRentals,
        });
        throw new Error('checking');
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

const addInHiveData = async ({
    username,
    activeListingsObj,
    lastCreatedTime,
    activeRentals,
}) => {
    try {
        console.log(`addInHiveData start`);
        const { relist, cancel } = await hive.getPostedSuiteRelistings({
            username,
            lastCreatedTime,
        });
        console.log(`relist: ${JSON.stringify(relist)}`);
        console.log(`cancel: ${JSON.stringify(cancel)}`);

        const newActiveListingsObj = addInHiveRelistingData({
            activeListingsObj,
            hiveRelistings: relist,
        });
        console.log(`activeListingsObj: ${JSON.stringify(activeListingsObj)}`);
        console.log(
            `newActiveListingsObj: ${JSON.stringify(newActiveListingsObj)}`
        );
        throw new Error(`checking addInHiveData hiveRelistings`);

        // TNT TODO: make addInHiveActiveRentalsData with the cancel part of postedSuiteRelistings
        return { newActiveListingsObj };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/addInHiveRelistingData error: ${err.message}`,
        });
        throw err;
    }
};

const addInHiveRelistingData = ({ activeListingsObj, hiveRelistings }) => {
    try {
        const newActiveListingsObj = JSON.parse(
            JSON.stringify(activeListingsObj)
        );

        let numOfChanges = 0;
        let noMatch = 0;
        for (const [uid, listing] of Object.entries(activeListingsObj)) {
            const { market_id } = listing;
            const listing_created_time = new Date(
                listing?.market_created_date
            )?.getTime();
            const newInfo = hiveRelistings[market_id];
            if (newInfo) {
                numOfChanges = numOfChanges + 1;

                const hive_created_time = newInfo?.created_time;
                if (hive_created_time > listing_created_time) {
                    // create something completely new here
                    newActiveListingsObj[uid] = {
                        sell_trx_id: newInfo?.sell_trx_id,
                        buy_price: newInfo?.buy_price,
                        created_time: hive_created_time,
                        uid,
                    };
                } else {
                    // keep what we already have, just trim it down a little
                    newActiveListingsObj[uid] = {
                        sell_trx_id: listing?.sell_trx_id,
                        buy_price: listing?.buy_price,
                        created_time: listing_created_time,
                        uid,
                    };
                }
            } else {
                noMatch = noMatch + 1;
                newActiveListingsObj[uid] = {
                    sell_trx_id: listing?.sell_trx_id,
                    buy_price: listing?.buy_price,
                    created_time: listing_created_time,
                    uid,
                };
            }
        }

        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/addInHiveRelistingData`,
        });
        window.api.bot.log({
            message: `Active Listings: ${
                Object.keys(activeListingsObj)?.length
            }`,
        });
        window.api.bot.log({
            message: `Hive Relistings: ${Object.keys(hiveRelistings)?.length}`,
        });
        window.api.bot.log({
            message: `Num Changes: ${numOfChanges}`,
        });
        window.api.bot.log({
            message: `No Match: ${noMatch}`,
        });
        window.api.bot.log({
            message: `Check: ${
                numOfChanges + noMatch ===
                Object.keys(activeListingsObj)?.length
            }`,
        });
        return newActiveListingsObj;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/addInHiveRelistingData error: ${err.message}`,
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
    rentalDetailsObj,
}) => {
    try {
        const updateRentalDetails = {};
        const newRentalDetails = {};
        // console.log(
        //     `/bot/server/services/rentalDetails/buildNewRentalDetailsObj start`
        // );

        for (const [tx_id, rental] of Object.entries(activeRentals)) {
            console.log(
                `/bot/server/services/rentalDetails/buildNewRentalDetailsObj rental: ${JSON.stringify(
                    rental
                )}, Object.keys(activeRentals): ${JSON.stringify(
                    Object.keys(activeRentals)
                )}`
            );
            //   throw new Error('checking for last_sell_trx_id');
            const { next_rental_payment, buy_price, sell_trx_id } = rental;
            // console.log(
            //     `/bot/server/services/rentalDetails/buildNewRentalDetailsObj next_rental_payment : ${next_rental_payment}, buy_price: ${buy_price}, rental: ${JSON.stringify(
            //         rental
            //     )}`
            // );
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
                if (rentalDetailsObj[rental.card_id] == null) {
                    newRentalDetails[rental.card_id] = {
                        is_rented: true,
                        last_rental_payment,
                        last_rental_payment_time,
                        last_price_update: null,
                        buy_price,
                        last_sell_trx_id: sell_trx_id,
                    };
                    // rentalDetailsObj[rental.card_id] = {
                    //     is_rented: true,
                    //     last_rental_payment,
                    //     last_rental_payment_time,
                    //     last_price_update: null,
                    //     buy_price,
                    //     last_sell_trx_id: sell_trx_id,
                } else {
                    updateRentalDetails[rental.card_id] = {
                        is_rented: true,
                        last_rental_payment,
                        last_rental_payment_time,
                        last_price_update:
                            buy_price !==
                            rentalDetailsObj[rental.card_id].buy_price
                                ? last_rental_payment
                                : null,
                        buy_price,
                        last_sell_trx_id: sell_trx_id,
                    };
                    // rentalDetailsObj[rental.card_id] = {
                    //     is_rented: true,
                    //     last_rental_payment,
                    //     last_rental_payment_time,
                    //     last_price_update:
                    //         buy_price !==
                    //         rentalDetailsObj[rental.card_id].buy_price
                    //             ? last_rental_payment
                    //             : null,
                    //     buy_price,
                    //     last_sell_trx_id: sell_trx_id,
                    // };
                }
            } else {
                console.log(
                    `/bot/server/services/rentalDetails/buildNewRentalDetailsObj issue with oneDayBefore: ${JSON.stringify(
                        oneDayBefore
                    )}`
                );
            }
        }

        for (const listing of Object.keys(activeListingsObj)) {
            const { market_created_date, buy_price, uid } = listing;
            if (rentalDetailsObj[uid] == null) {
                rentalDetailsObj[uid] = {
                    is_rented: false,
                    last_rental_payment: null,
                    last_rental_payment_time: null,
                    last_price_update: market_created_date,
                    buy_price,
                    last_sell_trx_id: null,
                };
            } else {
                //  updateRentalDetails[uid].buy_price = buy_price;
                // this will be handled in the hive relistings data add in, will just taint the data if we add it here imo (relisting data gives us the date + buy_price)
            }
        }

        const rentalDetailsBySellTrx = filterRentalDetailsBySellTrxId({
            rentalDetailsObj,
        });

        // console.log(
        //     `rentalDetailsBySellTrx: ${JSON.stringify(rentalDetailsBySellTrx)}`
        // );
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/buildNewRentalDetailsObj error: ${err.message}`,
        });
        throw err;
    }
};

const filterRentalDetailsBySellTrxId = ({ rentalDetailsObj }) => {
    try {
        console.log(
            `/bot/server/services/rentalDetails/filterRentalDetailsBySellTrxId rentalDetailsObj: ${JSON.stringify(
                rentalDetailsObj
            )}`
        );
        const rentalDetailSellTrx = {};
        for (const [uid, rentalDetail] of Object.entries(rentalDetailsObj)) {
            const { last_sell_trx_id } = rentalDetail;
            rentalDetailSellTrx[last_sell_trx_id] = uid;
        }

        return rentalDetailSellTrx;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/filterRentalDetailsBySellTrxId error: ${err.message}`,
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

newActiveListingsObj: {"G4-176-580RKPBRM8":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-33","buy_price":9.599,"created_time":1663365939000,"uid":"G4-176-580RKPBRM8"},"G3-285-662ZBKWTLS":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-65","buy_price":6.2493334,"created_time":1663365939000,"uid":"G3-285-662ZBKWTLS"},"C3-331-35N7TD2MSW":{"sell_trx_id":"a0ea371597d66713f4febbad5b84901edcff3d5e-12","buy_price":2.1,"created_time":1663365939000,"uid":"C3-331-35N7TD2MSW"},"C3-332-00V96UUP0G":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-79","buy_price":1.7763636,"created_time":1663365939000,"uid":"C3-332-00V96UUP0G"},"C3-333-UHHINJICGW":{"player":"xdww","uid":"C3-333-


activeListingsObj: {"G4-176-580RKPBRM8":{"player":"xdww","uid":"G4-176-580RKPBRM8","card_detail_id":176,"xp":1,"gold":true,"edition":4,"market_id":"dd998bc29079abcab71de53f195f9ea55942e0da-33","buy_price":"9.599","market_listing_type":"RENT","market_listing_status":0,"market_created_date":"2022-09-03T14:35:27.000Z","last_used_block":67634850,"last_used_player":"nonte","last_used_date":"2022-09-05T06:11:24.221Z","last_transferred_block":null,"last_transferred_date":null,"alpha_xp":null,"delegated_to":null,"delegation_tx":"sm_rental_payments_67949640","skin":null,"delegated_to_display_name":null,"display_name":null,"lock_days":3,"unlock_date":null,"level":2},"G3-285-662ZBKWTLS":{"player":"xdww","uid":"G3-285-
*/
