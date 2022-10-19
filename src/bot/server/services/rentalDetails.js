'use strict';

const { JsonInput } = require('@mantine/core');
const datesUtil = require('../../util/dates');
const hive = require('./hive');
const _ = require('lodash');

const updateRentalsStore = async ({
    username,
    activeListingsObj,
    lastCreatedTime,
    activeRentals,
}) => {
    try {
        // TNT TODO: make activeListingsObj not have so much excess data, we don't need most of it so can lower RAM usage since it can be quite a lot of extra BS
        console.log(`/bot/server/services/rentalDetails/updateRentalStore`);

        // activeListingsObj: {"C3-242-014BSEFUG0":{"player":"xdww","uid":"C3-242-014BSEFUG0","card_detail_id":242,"xp":31,"gold":false,"edition":3,"market_id":"dd998bc29079abcab71de53f195f9ea55942e0da-52","buy_price":"16.148","market_listing_type":"RENT","market_listing_status":0,"market_created_date":"2022-09-03T14:35:27.000Z","last_used_block":68244366,"last_used_player":"zexn","last_used_date":"2022-09-26T10:57:02.563Z","last_transferred_block":null,"last_transferred_date":null,"alpha_xp":0,"delegated_to":null,"delegation_tx":"sm_rental_payments_68263420","skin":null,"delegated_to_display_name":null,"display_name":null,"lock_days":3,"unlock_date":"2022-07-25T15:51:15.000Z","level":4},"C3-333-UHHINJICGW":{"player":"xdww","uid":"C3-333-UHHINJICGW","card_detail_id":333,"xp":1,"gold":false,"edition":3,"market_id":"8478644fd5909e198e971b8062a02400a1a72873-0","buy_price":"0.200","market_listing_type":"RENT","market_listing_status":0,"market_created_date":"2022-09-

        const { newActiveListingsObj, newActiveRentalsObj } =
            await addInHiveData({
                username,
                activeListingsObj,
                lastCreatedTime,
                activeRentals,
            });

        // newActiveListingsObj: {"C3-242-014BSEFUG0":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-52","buy_price":13.06305,"created_time":1664479305000,"uid":"C3-242-014BSEFUG0"},"C5-273-3QPDTEMU4G":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-53","buy_price":2.5244999999999997,"created_time":1664650299000,"uid":"C5-273-3QPDTEMU4G"},"G3-333-E8IWMRTC74":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-34","buy_price":2.871,"created_time":1664650299000,"uid":"G3-333-E8IWMRTC74"},"C3-333-ESIARZJMHC":{"sell_trx_id":"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-5","buy_price":"0.131","created_time":1662222948000,"uid":"C3-333-ESIARZJMHC"},"C3-334-0EIEZ6HY34":{"sell_trx_id":"439dff493cd95380cd6189b0a6e118e76149d1f4-78","buy_price":2.8,"created_time":1664479305000,"uid":"C3-334-0EIEZ6HY34"},"G3-337-178IKKV7S0":{"sell_trx_id":"a0ea371597d66713f4febbad5b84901edcff3d5e-

        // newActiveRentalsObj: {"7c61a722bdc6987076b5594aed04157c0f785030-18":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-18","buy_price":"0.223","price_change_time":null,"rental_created_time":1662997611000,"uid":"C7-364-7UGBLACFGW","next_rental_payment_time":1664725611000},"bd4cb81bacfb27afde63da132dc6f6420ea90799-6":{"sell_trx_id":"bd4cb81bacfb27afde63da132dc6f6420ea90799-6","buy_price":"1.106","price_change_time":null,"rental_created_time":1663127901000,"uid":"G7-382-558VKHEPC0","next_rental_payment_time":1664683101000},"bd4cb81bacfb27afde63da132dc6f6420ea90799-5":{"sell_trx_id":"bd4cb81bacfb27afde63da132dc6f6420ea90799-5","buy_price":"0.684","price_change_time":null,"rental_created_time":1663318824000,"uid":"G7-381-

        const rentalDetailsObj =
            await window.api.rentaldetails.getRentalDetails();
        // coming out as a string
        console.log(
            'rentalDetailsObj.data.rentalDetails',
            rentalDetailsObj.data.rentalDetails
        );
        console.log(rentalDetailsObj.data.rentalDetails['C-062EC71JF4']);
        // console.log(
        //     'here22',
        //     JSON.parse(JSON.stringify(rentalDetailsObj?.data)).rentalDetails
        // );

        const rentalDetails = buildNewRentalDetailsObj({
            newActiveRentalsObj,
            newActiveListingsObj,
            rentalDetailsObj:
                rentalDetailsObj?.code === 1 &&
                Object.keys(rentalDetailsObj?.data?.rentalDetails).length > 1
                    ? rentalDetailsObj?.data?.rentalDetails
                    : {},
        });
        window.api.rentaldetails.updateRentalDetails({
            rentalDetails: JSON.stringify(rentalDetails),
        });
        return rentalDetails;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/updateRentalStore error: ${err.message}`,
        });
        window.api.bot.log({
            message: err.stack,
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
        //     console.log(`addInHiveData start`);
        const { relist, cancel } = await hive.getPostedSuiteRelistings({
            username,
            lastCreatedTime,
        });
        const newActiveListingsObj = addInHiveRelistingData({
            activeListingsObj,
            hiveRelistings: relist,
        });

        // newActiveListingsObj: {"C1-39-3WO78X7TIO":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-44","buy_price":0.432,"created_time":1664650299000,"uid":"C1-39-3WO78X7TIO"},"C3-242-014BSEFUG0":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-52","buy_price":13.06305,"created_time":1664479305000,"uid":"C3-242-014BSEFUG0"},"G3-246-3E7P9B3MNK":{"sell_trx_id":"260c53e56822c69d14edcdd487194a5c655fd5d0-0","buy_price":0.54747,"created_time":1664650299000,"uid":"G3-246-3E7P9B3MNK"},"C5-273-3QPDTEMU4G":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-53","buy_price":2.5244999999999997,"created_time":1664650299000,"uid":"C5-273-3QPDTEMU4G"},"C3-287-52YF6MTLUO":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-

        const newActiveRentalsObj = addInHiveCancelData({
            activeRentals,
            hiveCancels: cancel,
        });

        // newActiveRentalsObj: {"C1-39-3WO78X7TIO":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-44","buy_price":0.432,"created_time":1664650299000,"uid":"C1-39-3WO78X7TIO"},"C3-242-014BSEFUG0":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-52","buy_price":13.06305,"created_time":1664479305000,"uid":"C3-242-014BSEFUG0"},"G3-246-3E7P9B3MNK":{"sell_trx_id":"260c53e56822c69d14edcdd487194a5c655fd5d0-0","buy_price":0.54747,"created_time":1664650299000,"uid":"G3-246-3E7P9B3MNK"},"C5-273-3QPDTEMU4G":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-53","buy_price":2.5244999999999997,"created_time":1664650299000,"uid":"C5-273-3QPDTEMU4G"},"C3-287-52YF6MTLUO":{"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-66","buy_price":7.0879,"created_time":1664650299000,"uid":"C3-287-52YF6MTLUO"},"C3-333-066DKVJI0W":{"sell_trx_id":"5bfd138a349e7cad9af495900d4b91d2b9a76fcf-

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
            // uid: C3-242-014BSEFUG0, listing: {"player":"xdww","uid":"C3-242-014BSEFUG0","card_detail_id":242,"xp":31,"gold":false,"edition":3,"market_id":"dd998bc29079abcab71de53f195f9ea55942e0da-52","buy_price":"16.148","market_listing_type":"RENT","market_listing_status":0,"market_created_date":"2022-09-03T14:35:27.000Z","last_used_block":68244366,"last_used_player":"zexn","last_used_date":"2022-09-26T10:57:02.563Z","last_transferred_block":null,"last_transferred_date":null,"alpha_xp":0,"delegated_to":null,"delegation_tx":"sm_rental_payments_68263420","skin":null,"delegated_to_display_name":null,"display_name":null,"lock_days":3,"unlock_date":"2022-07-25T15:51:15.000Z","level":4}

            const { market_id } = listing; // this is the sell_trx_id, sell_trx_id is just the listing id once its been converted to an actual rental (would show as sell_trx_id in activeRentals)
            const listing_created_time = new Date(
                listing?.market_created_date
            )?.getTime();
            const hiveInfo = hiveRelistings[market_id];

            if (hiveInfo && Object.entries(hiveInfo)?.length > 0) {
                numOfChanges = numOfChanges + 1;
                // console.log(`hiveInfo: ${JSON.stringify(hiveInfo)}`);
                const hive_created_time = hiveInfo?.created_time;
                if (hive_created_time > listing_created_time) {
                    // create something completely new here
                    newActiveListingsObj[uid] = {
                        sell_trx_id: hiveInfo?.sell_trx_id,
                        buy_price: hiveInfo?.buy_price,
                        created_time: hive_created_time,
                        uid,
                    };

                    // newActiveListingsObj[uid]: {"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-44","buy_price":0.432,"created_time":1664650299000,"uid":"C1-39-3WO78X7TIO"}
                } else {
                    // keep what we already have, just trim it down a little
                    newActiveListingsObj[uid] = {
                        sell_trx_id: market_id,
                        buy_price: listing?.buy_price,
                        created_time: listing_created_time,
                        uid,
                    };
                    // console.log(
                    //     `newActiveListingsObj[uid]: ${JSON.stringify(
                    //         newActiveListingsObj[uid]
                    //     )}`
                    // );
                    throw new Error(
                        `checking newActiveListingsObj after hive_created_time was not greater than listing_created_time`
                    );
                }
            } else {
                noMatch = noMatch + 1;
                newActiveListingsObj[uid] = {
                    sell_trx_id: market_id,
                    buy_price: listing?.buy_price,
                    created_time: listing_created_time,
                    uid,
                };
                // newActiveListingsObj[uid]: {"sell_trx_id":"dd998bc29079abcab71de53f195f9ea55942e0da-52","buy_price":"16.148","created_time":1662215727000,"uid":"C3-242-014BSEFUG0"}
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
    newActiveRentalsObj,
    newActiveListingsObj,
    rentalDetailsObj,
}) => {
    try {
        const oneDayTime = 1000 * 60 * 60 * 24 * 1;
        const twoDayTime = 1000 * 60 * 60 * 24 * 2;

        // new listings is actually all listings
        for (const [uid, listing] of Object.entries(newActiveListingsObj)) {
            const { sell_trx_id, buy_price, created_time } = listing;
            if (rentalDetailsObj[uid] == null) {
                // brand new listing for a card we do not know
                rentalDetailsObj[uid] = {
                    is_rented: false,
                    last_price_update_time: created_time,
                    rental_end_time: null,
                    buy_price,
                    last_sell_trx_id: sell_trx_id,
                };
            } else {
                // we have it in our object, update it if necessary
                const currentData = rentalDetailsObj[uid];
                if (created_time >= currentData?.last_price_update_time) {
                    // we've had a hive update since and need to update our object
                    // update price and update price change times
                    rentalDetailsObj[uid] = {
                        is_rented: false,
                        rental_end_time: currentData?.rental_end_time,
                        buy_price: buy_price,
                        last_rental_payment_time:
                            currentData?.last_rental_payment_time,
                        last_price_update_time:
                            currentData?.buy_price === buy_price
                                ? currentData?.last_price_update_time
                                : created_time,
                        last_sell_trx_id: currentData?.last_sell_trx_id, // this is really the only thing that could change, since something could be cancelled
                    };
                }
                if (currentData?.is_rented) {
                    rentalDetailsObj[uid] = false;
                }
            }
        }

        // new active rentals is actually all listings
        for (const [sell_trx_id, rental] of Object.entries(
            newActiveRentalsObj
        )) {
            const {
                buy_price,
                price_change_time,
                rental_created_time,
                uid,
                next_rental_payment_time,
            } = rental;

            let rental_end_time;
            const nowTime = new Date().getTime();
            // will get reasigned later
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
                // console.log(
                //     `rental_end_time: ${rental_end_time} is date: ${new Date(
                //         rental_end_time
                //     )}, that is also next_rental_payment_time: ${next_rental_payment_time} date: ${new Date(
                //         next_rental_payment_time
                //     )} plus a day to get when rental ends`
                // );
            } else {
                // otherwise, add 24 hours to the last_rental_payment to get (or just assume its the next rental payment!)
                rental_end_time = next_rental_payment_time;
                // console.log(
                //     `rental_end_time: ${rental_end_time} is date: ${new Date(
                //         rental_end_time
                //     )}, that is also next_rental_payment_time: ${next_rental_payment_time} date: ${new Date(
                //         next_rental_payment_time
                //     )}`
                // );
            }

            let this_price_change_time = price_change_time;
            if (
                rentalDetailsObj[uid] !== undefined &&
                (price_change_time == null ||
                    rentalDetailsObj[uid].price_change_time > price_change_time)
            ) {
                this_price_change_time =
                    rentalDetailsObj[uid].price_change_time;
            }

            const last_rental_payment_time =
                next_rental_payment_time - oneDayTime;

            rentalDetailsObj[uid] = {
                is_rented: true,
                rental_end_time,
                buy_price,
                last_rental_payment_time,
                last_price_update_time: this_price_change_time,
                last_sell_trx_id: sell_trx_id,
            };
            // we need to calc when the rental actually expires, need to see how many days ago the creation was
            // need to calculate the last_rental_payment_time, prob ditch the last_rental_payment
        }

        // delete old stuff not listed or rented
        const uidsToPurge = [];
        Object.keys(rentalDetailsObj).forEach((uid) => {
            if (
                newActiveListingsObj[uid] === undefined &&
                newActiveRentalsObj[uid] === undefined
            ) {
                uidsToPurge.push(uid);
            }
        });

        uidsToPurge.forEach((uid) => {
            delete rentalDetailsObj[uid];
        });

        return rentalDetailsObj;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/buildNewRentalDetailsObj error: ${err.message}`,
        });
        throw err;
    }
};

const aggListingsDataByMarketKey = ({ activeListingsObj }) => {
    try {
        const listingDataByMarketKey = {};
        Object.keys(activeListingsObj).forEach((cardUID) => {
            const cardDetails = activeListingsObj[cardUID];
            const marketKey = `${cardDetails.card_detail_id}-${cardDetails.level}-${cardDetails.gold}-${cardDetails.edition}`;
            if (listingDataByMarketKey[marketKey] === undefined) {
                listingDataByMarketKey[marketKey] = {};
                listingDataByMarketKey[marketKey].count = 0;
                listingDataByMarketKey[marketKey].prices = [];
            }
            listingDataByMarketKey[marketKey].prices.push(
                parseFloat(cardDetails.buy_price)
            );
            listingDataByMarketKey[marketKey].count += 1;
        });
        Object.keys(listingDataByMarketKey).forEach((marketKey) => {
            const lookedup = listingDataByMarketKey[marketKey];
            listingDataByMarketKey[marketKey] = {
                avg: _.mean(lookedup.prices),
                count: lookedup.count,
            };
        });
        return listingDataByMarketKey;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/rentalDetails/aggListingsDataByMarketKey error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    updateRentalsStore,
    aggListingsDataByMarketKey,
};

/*

newActiveListingsObj: {"C3-242-014BSEFUG0":{"buy_price":"16.148","created_time":1662215727000,"uid":"C3-242-014BSEFUG0"},"C3-333-UHHINJICGW":{"buy_price":"0.200","created_time":1663016235000,"uid":"C3-333-UHHINJICGW"},"C3-333-J3C1YJ3Q0G":{"buy_price":"0.153","created_time":1662319128000,"uid":"C3-333-J3C1YJ3Q0G"},"C3-333-6P729I5PR4":{"buy_price":"0.153","created_time":1662319128000,"uid":"C3-333-6P729I5PR4"},"C3-333-WVOXP9ND28":{"buy_price":"0.153","created_time":1662319128000,"uid":"C3-333-WVOXP9ND28"},"C3-333-Q7X8CJYD5S":{"buy_price":"0.153","created_time":1662319128000,"uid":"C3-333-Q7X8CJYD5S"},"C3-333-8HPUBH8TO0":{"buy_price":"0.200","created_time":1662222948000,"uid":"C3-333-8HPUBH8TO0"},"C3-333-JD3R25YQE8":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-JD3R25YQE8"},"C3-333-WXGDEIQFVK":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-WXGDEIQFVK"},"C3-333-2IC4PT42WG":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-2IC4PT42WG"},"C3-333-T1QK2O4L4G":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-T1QK2O4L4G"},"C3-333-LQW2T9AHV4":{"buy_price":"0.200","created_time":1662846486000,"uid":"C3-333-LQW2T9AHV4"},"C3-333-L0SUP9QNCG":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-L0SUP9QNCG"},"C3-333-EMS0QXT3WW":{"buy_price":"0.200","created_time":1662222948000,"uid":"C3-333-EMS0QXT3WW"},"C3-333-1TZOK5YDF4":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-1TZOK5YDF4"},"C3-333-M1AA96FPSG":{"buy_price":"0.200","created_time":1662846486000,"uid":"C3-333-M1AA96FPSG"},"C3-333-RN6356A38G":{"buy_price":"0.200","created_time":1662846486000,"uid":"C3-333-RN6356A38G"},"C3-333-75MSKR99SG":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-75MSKR99SG"},"C3-333-KSLINKQ50G":{"buy_price":"0.200","created_time":1662846486000,"uid":"C3-333-KSLINKQ50G"},"C3-333-XWXNSJS03K":{"buy_price":"0.153","created_time":1662319128000,"uid":"C3-333-XWXNSJS03K"},"C3-333-LODLX5YAWW":{"buy_price":"0.153","created_time":1662222948000,"uid":"C3-333-LODLX5YAWW"},"C3-333-F7DT0JQQM8":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-F7DT0JQQM8"},"C3-333-0GIOLLO2PC":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-0GIOLLO2PC"},"C3-333-3ZNKOB5MUO":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-333-3ZNKOB5MUO"},"C3-333-PLO0HDV1HC":{"buy_price":"0.153","created_time":1662222948000,"uid":"C3-333-PLO0HDV1HC"},"C3-333-65QO9KU4TS":{"buy_price":"0.200","created_time":1662222948000,"uid":"C3-333-65QO9KU4TS"},"C3-333-ADH9STMDHS":{"buy_price":"0.200","created_time":1662222948000,"uid":"C3-333-ADH9STMDHS"},"C3-333-3HWD46B174":{"buy_price":"0.200","created_time":1662222948000,"uid":"C3-333-3HWD46B174"},"C3-333-E332LF70GG":{"buy_price":"0.200","created_time":1662319128000,"uid":"C3-

newActiveRentals: {"bd4cb81bacfb27afde63da132dc6f6420ea90799-8":{"sell_trx_id":"bd4cb81bacfb27afde63da132dc6f6420ea90799-8","buy_price":"0.451","price_change_time":null,"rental_created_time":1662589473000,"uid":"G7-398-FQRBFL0YPC","next_rental_payment_time":1664317473000},"7c61a722bdc6987076b5594aed04157c0f785030-64":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-64","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668061000,"uid":"C7-389-QFZ87OEC4W","next_rental_payment_time":1664309661000},"7c61a722bdc6987076b5594aed04157c0f785030-62":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-62","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668061000,"uid":"C7-389-PNTTW3SFPC","next_rental_payment_time":1664309661000},"7c61a722bdc6987076b5594aed04157c0f785030-68":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-68","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668061000,"uid":"C7-389-EUUF1CPYZ4","next_rental_payment_time":1664309661000},"7c61a722bdc6987076b5594aed04157c0f785030-65":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-65","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668061000,"uid":"C7-389-IA88APPIKW","next_rental_payment_time":1664309661000},"7c61a722bdc6987076b5594aed04157c0f785030-60":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-60","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668064000,"uid":"C7-389-I83H4CPHI8","next_rental_payment_time":1664309664000},"7c61a722bdc6987076b5594aed04157c0f785030-59":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-59","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668064000,"uid":"C7-389-Q9R7254LY8","next_rental_payment_time":1664309664000},"7c61a722bdc6987076b5594aed04157c0f785030-63":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-63","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668064000,"uid":"C7-389-0Q62G0KP80","next_rental_payment_time":1664309664000},"7c61a722bdc6987076b5594aed04157c0f785030-67":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-67","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668064000,"uid":"C7-389-13822XCD1S","next_rental_payment_time":1664309664000},"7c61a722bdc6987076b5594aed04157c0f785030-66":{"sell_trx_id":"7c61a722bdc6987076b5594aed04157c0f785030-66","buy_price":"0.472","price_change_time":null,"rental_created_time":1662668082000,"uid":"C7-389-
*/
