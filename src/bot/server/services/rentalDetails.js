'use strict';

const datesUtil = require('../../util/dates');
const hive = require('./hive');
const fileService = require('./rentalDetailsFile');

const updateRentalsStore = async ({
    username,
    activeListingsObj,
    lastCreatedTime,
    activeRentals,
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
        const rentalDetailsObj = window.api.rentaldetails.getRentalDetails();
        window.api.bot.log({
            message: `got rental details done, about to see if we should buildNewRentalDetailsObj`,
        });
        if (
            !rentalDetailsObj ||
            Object.entries(rentalDetailsObj)?.length === 0
        ) {
            window.api.bot.log({
                message: `about to buildNewRentalDetailsObj`,
            });
            const rentalDetails = buildNewRentalDetailsObj({
                newActiveRentals: newActiveRentalsObj,
                newActiveListingsObj,
            });
            window.api.bot.log({
                message: `we have the rentalDetails, now about to call updateRentalDetails`,
            });
            window.api.rentaldetails.updateRentalDetails({ rentalDetails });
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
        console.log(`activeRentals: ${JSON.stringify(activeRentals)}`);

        const newActiveRentalsObj = addInHiveCancelData({
            activeRentals,
            hiveCancels: cancel,
        });
        console.log(
            `'newActiveRentalsObj: ${JSON.stringify(newActiveRentalsObj)}`
        );

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

// TODO: have this handle both existing and new ones imo
const buildNewRentalDetailsObj = ({
    newActiveRentals,
    newActiveListingsObj,
}) => {
    try {
        const newRentalDetailsObj = {};
        const oneDayTime = 1000 * 60 * 60 * 24 * 1;
        const twoDayTime = 1000 * 60 * 60 * 24 * 2;

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
        return JSON.stringify(newRentalDetailsObj);
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
