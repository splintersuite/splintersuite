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
                        last_sell_trx_id: null,
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
                    last_sell_trx_id: null,
                };
            }
        }

        if (hiveRelistings && Object.keys(hiveRelistings)?.length > 1) {
            for (const [relistingType, hiveTransactions] of Object.entries(
                hiveRelistings
            )) {
                hiveTransactions.forEach((transaction) => {
                    if (relistingType === 'relist') {
                    } else if (relistingType === 'cancel') {
                    } else if (relistingType === 'notSpecified') {
                    } else {
                    }
                });
            }
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

const filterRentalDetailsBySellTrxId = ({ rentalDetailsObj }) => {
    try {
        console.log(
            `/bot/server/services/rentalDetails/filterRentalDetailsBySellTrxId rentalDetailsObj: ${JSON.stringify(
                rentalDetailsObj
            )}`
        );
        const rentalDetailSellTrx = {};
        for (const [uid, rentalDetail] of Object.entries(rentalDetailsObj)) {
        }
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

/*
hive relistings:

hiveRelistings: {"relist":[{"id":"57d0f907019acb6a4fa720832872ee53207d0644","block_id":"040bee99b6856c4842655995672d894564ac32a8","prev_block_id":"040bee98280bbcd818f8387c171bb6ad2ff1a9dd","type":"update_rental_price","player":"xdww","affected_player":"xdww","data":"{\"items\":[[\"bd4cb81bacfb27afde63da132dc6f6420ea90799-6\",1.106],[\"dd998bc29079abcab71de53f195f9ea55942e0da-50\",36.231030000000004],[\"439dff493cd95380cd6189b0a6e118e76149d1f4-21\",18.03353],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-26\",21.28203]],\"agent\":\"splintersuite\",\"suite_action\":\"relist\",\"required_posting_auths\":[\"xdww\"],\"required_auths\":[]}","success":true,"error":null,"block_num":67890841,"created_date":"2022-09-14T03:56:51.000Z","result":"{\"success\":true}","steem_price":null,"sbd_price":null},{"id":"e54ae5ed855238a260d75c90d4fc3a2c4804bce3","block_id":"040bdbd25feb9bbc26e9e30c06543001fa1a84cf","prev_block_id":"040bdbd109df990e9a0dabaf0aeff2c6814a5d53","type":"update_rental_price","player":"xdww","affected_player":"xdww","data":"{\"items\":[[\"dd998bc29079abcab71de53f195f9ea55942e0da-49\",70.68996],[\"dd998bc29079abcab71de53f195f9ea55942e0da-96\",79.55442000000001],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-3\",164.73203999999998],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-26\",21.496859999999998]],\"agent\":\"splintersuite\",\"suite_action\":\"relist\",\"required_posting_auths\":[\"xdww\"],\"required_auths\":[]}","success":true,"error":null,"block_num":67886034,"created_date":"2022-09-13T23:55:57.000Z","result":"{\"success\":true}","steem_price":null,"sbd_price":null},{"id":"072a3785cd672476af268e9cc1349d6167e6ac0f","block_id":"040bda9373a5dface48fc38a9b50ae62b3314a12","prev_block_id":"040bda92f338dd7a51c4e620725a84b27fb3404e","type":"update_rental_price","player":"xdww","affected_player":"xdww","data":"{\"items\":[[\"dd998bc29079abcab71de53f195f9ea55942e0da-49\",71.40375],[\"dd998bc29079abcab71de53f195f9ea55942e0da-96\",80.3583],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-3\",180.86508],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-13\",7.8891335],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-26\",21.71367]],\"agent\":\"splintersuite\",\"suite_action\":\"relist\",\"required_posting_auths\":[\"xdww\"],\"required_auths\":[]}","success":true,"error":null,"block_num":67885715,"created_date":"2022-09-13T23:39:57.000Z","result":"{\"success\":true}","steem_price":null,"sbd_price":null},{"id":"a565b544fb8e7a7eb9c2dc727beca5f398c93f1a","block_id":"040bc86c8761b0eccfacb8cc02561728f8f31aaf","prev_block_id":"040bc86b1ef74239bdc6c4a9a533b1b9871df5d6","type":"update_rental_price","player":"xdww","affected_player":"xdww","data":"{\"items\":[[\"dd998bc29079abcab71de53f195f9ea55942e0da-8\",4.643152],[\"dd998bc29079abcab71de53f195f9ea55942e0da-32\",4.95],[\"dd998bc29079abcab71de53f195f9ea55942e0da-34\",4.95],[\"dd998bc29079abcab71de53f195f9ea55942e0da-46\",1.38],[\"dd998bc29079abcab71de53f195f9ea55942e0da-48\",6.93099],[\"dd998bc29079abcab71de53f195f9ea55942e0da-64\",6.336],[\"dd998bc29079abcab71de53f195f9ea55942e0da-65\",9.7515],[\"dd998bc29079abcab71de53f195f9ea55942e0da-79\",4.514399999999999],[\"dd998bc29079abcab71de53f195f9ea55942e0da-84\",3.635],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-1\",17.545769999999997],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-22\",43.543169999999996],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-30\",98.01]],\"agent\":\"splintersuite\",\"suite_action\":\"relist\",\"required_posting_auths\":[\"xdww\"],\"required_auths\":[]}","success":true,"error":null,"block_num":67881068,"created_date":"2022-09-13T19:47:18.000Z","result":"{\"success\":true}","steem_price":null,"sbd_price":null},{"id":"d9eac44d45fad676468f71a8d4e763b0deea6eb5","block_id":"040b9a6a1c6cb110133f9b1eeb3e4c05fcb9856b","prev_block_id":"040b9a69ddad0a621e46705aa5e24db17035ab75","type":"update_rental_price","player":"xdww","affected_player":"xdww","data":"{\"items\":[[\"a0ea371597d66713f4febbad5b84901edcff3d5e-24\",80.47314],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-31\",118.19313]],\"agent\":\"splintersuite\",\"suite_action\":\"relist\",\"required_posting_auths\":[\"xdww\"],\"required_auths\":[]}","success":true,"error":null,"block_num":67869290,"created_date":"2022-09-13T09:57:21.000Z","result":"{\"success\":true}","steem_price":null,"sbd_price":null},{"id":"452943ffd43b383dfea9819c797f031b74f01691","block_id":"040b9a5f441957a1987740e54c3133aa93241669","prev_block_id":"040b9a5ebace20844c72183b12fc67e71621aff7","type":"update_rental_price","player":"xdww","affected_player":"xdww","data":"{\"items\":[[\"a0ea371597d66713f4febbad5b84901edcff3d5e-24\",81.28593],[\"a0ea371597d66713f4febbad5b84901edcff3d5e-31\",119.38707000000001]],\"agent\":\"splintersuite\",\"suite_action\":\"relist\",\"required_posting_auths\":[\"xdww\"],\"required_auths\":[]}","success":true,"error":null,"block_num":67869279,"created_date":"2022-09-13T09:56:48.000Z","result":"{\"success\":true}","steem_price":null,"sbd_price":null}
*/
