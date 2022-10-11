'use strict';

const datesUtil = require('../../util/dates');
const hive = require('./hive');
const fileService = require('./rentalDetailsFile');

const getAndUpdateRentalsStore = async ({
    username,
    //   rentalDetailsObj,
    activeListingsObj,
    lastCreatedTime,
    activeRentals,
    // price update object?
}) => {
    try {
        // continue with adding here...
        console.log(`/bot/server/services/rentalDetails/updateRentalStore`);

        const { newActiveListingsObj, newActiveRentalsObj } =
            await addInHiveData({
                username,
                activeListingsObj,
                lastCreatedTime,
                activeRentals,
            });
        // throw new Error('checking');
        //  const rentalDetailsObj = fileService.getRentalDetails();
        const rentalDetailsObj = window.api.rentaldetails.getRentalDetails();
        window.api.bot.log({
            message: `got rental details done, about to see if we should buildNewRentalDetailsObj`,
        });
        window.api.bot.log({
            message: `about to buildNewRentalDetailsObj`,
        });

        console.log('begin', new Date());
        const rentalDetails = buildNewRentalDetailsObj({
            newActiveRentals: newActiveRentalsObj,
            newActiveListingsObj,
            rentalDetailsObj:
                !rentalDetailsObj ||
                Object.entries(rentalDetailsObj)?.length === 0
                    ? {}
                    : rentalDetailsObj,
        });
        console.log('finished', new Date());
        process.exit();
        //  console.log(`rentalDetailsObj: ${JSON.stringify(rentalDetailsObj)}`);

        window.api.bot.log({
            message: `about to buildNewRentalDetailsObj`,
        });

        window.api.bot.log({
            message: `we have the rentalDetails, now about to call updateRentalDetails`,
        });
        window.api.rentaldetails.updateRentalDetails({ rentalDetails });
        // console.log(
        //     `rentalDetails after we build new one: ${JSON.stringify(
        //         rentalDetails
        //     )}`
        // );
        //   await window.api.bot.updateRentalDetails({ rentalDetails });
        // const rentalDetails = prepareRentalDetailsForServer({
        // const { newRentalDetails, updateRentalDetails } =
        //     prepareRentalDetailsForServer({
        //         newRentalDetailsObj,
        //         updateRentalDetailsObj,
        //     });
        // return rentalDetails;
        //return rentalDetails;
        return;
        throw new Error('checking to see if updateRentalDetails worked');
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
        console.log(`activeRentals: ${JSON.stringify(activeRentals)}`);

        const newActiveRentalsObj = addInHiveCancelData({
            activeRentals,
            hiveCancels: cancel,
        });
        console.log(
            `'newActiveRentalsObj: ${JSON.stringify(newActiveRentalsObj)}`
        );
        //    throw new Error(`checking addInHiveCancelData`);

        // TNT TODO: make addInHiveActiveRentalsData with the cancel part of postedSuiteRelistings
        return { newActiveListingsObj, newActiveRentalsObj };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/addInHiveRelistingData error: ${err.message}`,
        });
        throw err;
    }
};

const addInHiveCancelData = ({ activeRentals, hiveCancels }) => {
    try {
        const newActiveRentals = JSON.parse(JSON.stringify(activeRentals));
        let numOfChanges = 0;
        let noMatch = 0;

        for (const [sell_trx_id, rental] of Object.entries(activeRentals)) {
            const { rental_date, buy_price, card_id, next_rental_payment } =
                rental;

            const rental_date_time = new Date(rental_date).getTime();
            const newInfo = hiveCancels[sell_trx_id];
            if (newInfo) {
                numOfChanges = numOfChanges + 1;

                const hive_created_time = newInfo?.created_time;
                if (hive_created_time > rental_date_time) {
                    // we need to update the activeRentalsObj
                    newActiveRentals[sell_trx_id] = {
                        sell_trx_id: newInfo?.sell_trx_id,
                        buy_price: newInfo?.buy_price,
                        price_change_time: hive_created_time,
                        rental_created_time: rental_date_time,
                        uid: card_id,
                        next_rental_payment_time: new Date(
                            next_rental_payment
                        ).getTime(),
                    };
                } else {
                    newActiveRentals[sell_trx_id] = {
                        sell_trx_id,
                        buy_price,
                        price_change_time: null,
                        rental_created_time: rental_date_time,
                        uid: card_id,
                        next_rental_payment_time: new Date(
                            next_rental_payment
                        ).getTime(),
                    };
                }
            } else {
                noMatch = noMatch + 1;
                newActiveRentals[sell_trx_id] = {
                    sell_trx_id,
                    buy_price,
                    price_change_time: null,
                    rental_created_time: rental_date_time,
                    uid: card_id,
                    next_rental_payment_time: new Date(
                        next_rental_payment
                    ).getTime(),
                };
            }
        }

        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/addInHiveCancelData`,
        });

        window.api.bot.log({
            message: `Active Rentals: ${Object.keys(activeRentals)?.length}`,
        });
        window.api.bot.log({
            message: `Hive Cancels: ${Object.keys(hiveCancels)?.length}`,
        });
        window.api.bot.log({
            message: `Num Changes: ${numOfChanges}`,
        });
        window.api.bot.log({
            message: `No Match: ${noMatch}`,
        });

        return newActiveRentals;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/addInHiveCancelData error: ${err.message}`,
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

/*
   properties: {
                    is_rented: {
                        type: 'boolean',
                    },
                    last_rental_payment: {
                        type: 'date',
                    },
                    last_rental_payment_time: { rental_end_time:
                        type: 'number',
                        minimum: 3045572900,
                    },
                    last_price_update: {
                        type: 'date',
                    },
                    buy_price: {
                        type: 'number',
                        minimum: 0.1,
                    },
                    last_sell_trx_id: {
                        type: 'string',
                    },
*/

// this is for when the rentalDetailObject is not populated, either because the store got cleared or its the first usage.
// we also need input of the relisting actions, so we can see when we last changed the price for the activeListingsObj
const buildNewRentalDetailsObj = ({
    newActiveRentals,
    newActiveListingsObj,
}) => {
    try {
        // const updateRentalDetailsObj = {};
        const newRentalDetailsObj = {};
        const oneDayTime = 1000 * 60 * 60 * 24 * 1;
        const twoDayTime = 1000 * 60 * 60 * 24 * 2;
        // console.log(
        //     `/bot/server/services/rentalDetails/buildNewRentalDetailsObj start`
        // );

        for (const [uid, listing] of Object.entries(newActiveListingsObj)) {
            const { sell_trx_id, buy_price, created_time } = listing;

            newRentalDetailsObj[uid] = {
                is_rented: false,
                last_price_update_time: created_time,
                rental_end_time: null,
                buy_price,
                last_sell_trx_id: sell_trx_id,
            };
        }

        for (const [sell_trx_id, rental] of Object.entries(newActiveRentals)) {
            const {
                buy_price,
                price_change_time,
                rental_created_time,
                uid,
                next_rental_payment_time,
            } = rental;

            let rental_end_time;
            const nowTime = new Date().getTime();
            if (rental_created_time + oneDayTime > nowTime) {
                // means not even 24 hours have passed since beginning of rental contract, if we cancelled its 2 days after start of contract.
                rental_end_time = rental_created_time + twoDayTime;
            }
            const daysAgo = datesUtil.roundedDownDaysAgo({
                pastTime: rental_created_time,
            });

            if (daysAgo % 2 === 0) {
                // its been at least a day, and if this is even (therefore equation solves to 0), then we need to add 2 days to the last_rental_payment
                // or just add 1 more day to the next_rental_payment
                rental_end_time = next_rental_payment_time + oneDayTime;
                console.log(
                    `rental_end_time: ${rental_end_time} is date: ${new Date(
                        rental_end_time
                    )}, that is also next_rental_payment_time: ${next_rental_payment_time} date: ${new Date(
                        next_rental_payment_time
                    )} plus a day to get when rental ends`
                );
            } else {
                // otherwise, add 24 hours to the last_rental_payment to get (or just assume its the next rental payment!)
                rental_end_time = next_rental_payment_time;
                console.log(
                    `rental_end_time: ${rental_end_time} is date: ${new Date(
                        rental_end_time
                    )}, that is also next_rental_payment_time: ${next_rental_payment_time} date: ${new Date(
                        next_rental_payment_time
                    )}`
                );
            }
            if (price_change_time) {
            }
            const last_rental_payment_time =
                next_rental_payment_time - oneDayTime;

            newRentalDetailsObj[uid] = {
                is_rented: true,
                rental_end_time,
                buy_price,
                last_rental_payment_time,
                last_price_update_time: price_change_time,
                last_sell_trx_id: sell_trx_id,
            };
            // we need to calc when the rental actually expires, need to see how many days ago the creation was
            // need to calculate the last_rental_payment_time, prob ditch the last_rental_payment
        }

        console.log(
            `newRentalDetailsObj: ${JSON.stringify(newRentalDetailsObj)}`
        );
        return JSON.stringify(newRentalDetailsObj);
        //throw new Error('checking newRentalDetails');
        /*
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
        */
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

const prepareRentalDetailsForServer = ({
    newRentalDetailsObj,
    updateRentalDetailsObj,
}) => {
    try {
        // conv object to array
        const newRentalDetails = [];
        const updateRentalDetails = [];
        if (Object.entries(newRentalDetails).length > 0) {
            for (const [uid, listing] of Object.entries(newRentalDetailsObj)) {
                newRentalDetails.push(...listing, uid);
            }
        }
        if (Object.entries(updateRentalDetailsObj)) {
            for (const [uid, listing] of Object.entries(
                updateRentalDetailsObj
            )) {
                updateRentalDetails.push(...listing, uid);
            }
        }

        return { newRentalDetails, updateRentalDetails };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/prepareRentalDetailsForServer error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getAndUpdateRentalsStore,
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
