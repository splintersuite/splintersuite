'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');
/*
const getRecentHiveListings = async ({ username }) => {
    try {
        const url = `https://api2.splinterlands.com/players/history?username=${username}&from_block=-1&limit=250&types=market_list`;
        const res = await axiosInstance(url);

        const results = res.data;

        return results;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getRecentHiveListings error: ${err.message}`,
        });
        throw err;
    }
};*/

const getRecentHiveRelistings = async ({ username, lastCreatedTime }) => {
    try {
        const hiveRelistings = [];
        let notOurs = 0;
        let notSuccess = 0;
        const hiveListings = await getHiveRelistings({ username });

        hiveListings.forEach((hiveTransaction) => {
            const { created_date } = hiveTransaction;
            const createdTime = new Date(created_date).getTime();
            console.log(
                `createdTime: ${createdTime}, lastCreatedTime: ${lastCreatedTime}`
            );
            const posted = successfullyPosted({ hiveTransaction });
            const isSuite = isSplintersuite({ hiveTransaction });
            if (!isSuite) {
                notOurs = notOurs + 1;
            }
            if (!posted) {
                notSuccess = notSuccess + 1;
            }
            if (lastCreatedTime <= createdTime && posted && isSuite) {
                hiveRelistings.push(hiveTransaction);
            }
        });

        window.api.bot.log({
            message: `/bot/server/services/hive/getRecentHiveRelistings`,
        });
        window.api.bot.log({
            message: `lastCreatedTime: ${lastCreatedTime}`,
        });
        window.api.bot.log({
            message: `lastCreatedDate: ${new Date(lastCreatedTime)}`,
        });
        window.api.bot.log({
            message: `notOurs: ${notOurs}`,
        });
        window.api.bot.log({
            message: `notSuccess: ${notSuccess}`,
        });
        window.api.bot.log({
            message: `hiveListings: ${hiveListings?.length}`,
        });
        window.api.bot.log({
            message: `hiveRelistings: ${hiveRelistings?.length}`,
        });

        return hiveRelistings;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getRecentHiveRelistings error: ${err.message}`,
        });
        throw err;
    }
};

const getHiveRelistings = async ({ username }) => {
    try {
        const url = `https://api2.splinterlands.com/players/history?username=${username}&from_block=-1&limit=250&types=update_rental_price`;
        const res = await axiosInstance(url);

        const results = res.data;

        return results;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getHiveRelistings error: ${err.message}`,
        });
        throw err;
    }
};
/*
const getPostedSuiteListings = async ({ username }) => {
    try {
        console.log(`/bot/server/services/hive/getPostedSuiteListings`);

        const listings = await getRecentHiveListings({ username });

        const successfulListings = getSuccessfulTransactions({
            transactions: listings,
        });

        const postedSuiteListings = getSplinterSuiteTransactions({
            transactions: successfulListings,
        });

        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteListings`,
        });
        window.api.bot.log({
            message: `Listings: ${postedSuiteListings?.length}`,
        });
        window.api.bot.log({
            message: `Listings: ${listings?.length}`,
        });

        return postedSuiteListings;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteListings error: ${err.message}`,
        });
        throw err;
    }
}; */

const getPostedSuiteRelistings = async ({ username, lastCreatedTime }) => {
    try {
        console.log(`/bot/server/services/hive/getPostedSuiteRelistings`);

        const relistings = await getRecentHiveRelistings({
            username,
            lastCreatedTime,
        });
        //  console.log(`relistings: ${JSON.stringify(relistings)}`);

        // const postedRelistings = getSuccessfulTransactions({
        //     transactions: relistings,
        // });

        // //  console.log(`postedRelistings: ${JSON.stringify(postedRelistings)}`);
        // const postedSuiteRelistings = getSplinterSuiteTransactions({
        //     transactions: postedRelistings,
        // });

        // window.api.bot.log({
        //     message: `/bot/server/services/hive/getPostedSuiteRelistings`,
        // });
        // window.api.bot.log({
        //     message: `Relistings: ${postedSuiteRelistings?.length}`,
        // });

        const postedSuiteRelistingsByType = getRelistingType({
            transactions: relistings,
        });
        console.log(
            `postedSuiteRelistingsByType: ${JSON.stringify(
                postedSuiteRelistingsByType
            )}`
        );
        return postedSuiteRelistingsByType;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteRelistings error: ${err.message}`,
        });
        throw err;
    }
};
/*
const getSuccessfulTransactions = ({ transactions }) => {
    try {
        const successArr = [];
        const errArr = [];
        transactions.forEach((hiveTransaction) => {
            const posted = successfullyPosted({ hiveTransaction });
            if (posted) {
                successArr.push(hiveTransaction);
            } else {
                errArr.push(hiveTransaction);
            }
        });

        window.api.bot.log({
            message: `/bot/server/services/hive/getSuccessfulTransactions`,
        });
        window.api.bot.log({
            message: `Transactions: ${transactions?.length}`,
        });
        window.api.bot.log({
            message: `Success: ${successArr?.length}`,
        });
        window.api.bot.log({
            message: `Error: ${errArr?.length}`,
        });
        return successArr;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getSuccessfulTransactions error: ${err.message}`,
        });
        throw err;
    }
}; */
const successfullyPosted = ({ hiveTransaction }) => {
    try {
        if (hiveTransaction?.success) {
            if (hiveTransaction?.error) {
                window.api.bot.log({
                    message: `/bot/server/services/hive/successfullyPosted hive transaction that is success = true but has an error: ${JSON.stringify(
                        hiveTransaction?.error
                    )} && hive Transaction: ${hiveTransaction}`,
                });
            }
            return true;
        } else {
            return false;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/successfullyPosted error: ${err.message}`,
        });
        throw err;
    }
};
/*
const getSplinterSuiteTransactions = ({ transactions }) => {
    try {
        const splintersuite = [];
        const other = [];
        transactions.forEach((hiveTransaction) => {
            const ours = isSplintersuite({ hiveTransaction });
            if (ours) {
                splintersuite.push(hiveTransaction);
            } else {
                other.push(hiveTransaction);
            }
        });
        window.api.bot.log({
            message: `/bot/server/services/hive/getSplinterSuiteTransactions`,
        });
        window.api.bot.log({
            message: `Transactions: ${transactions?.length}`,
        });
        window.api.bot.log({
            message: `Ours: ${splintersuite?.length}`,
        });
        window.api.bot.log({
            message: `Other: ${other?.length}`,
        });

        return splintersuite;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getSplinterSuiteTransactions error: ${err.message}`,
        });
        throw err;
    }
};*/

const isSplintersuite = ({ hiveTransaction }) => {
    try {
        const data = hiveTransaction?.data;
        console.log(
            `isSplintersuite: data: ${JSON.stringify(
                data
            )}, hiveTransaction data?.agent: $${data?.agent}`
        );
        const jsonData = JSON.parse(data);
        console.log(`jsonData: ${JSON.stringify(jsonData)}`);
        if (jsonData && jsonData?.agent === 'splintersuite') {
            console.log(`is splintersuite`);
            return true;
        } else {
            console.log(`not splintersuite`);
            return false;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/isSplintersuite error: ${err.message}`,
        });
        throw err;
    }
};

const getRelistingType = ({ transactions }) => {
    try {
        console.log(`getRelistingType start`);
        const relist = [];
        const cancel = [];
        const relistObj = {};
        const cancelObj = {};
        // const notSpecified = [];
        let notSpecified = 0;

        const hiveListingsObj = buildHiveListingsObj({ transactions });

        console.log(`hiveListingsObj: ${JSON.stringify(hiveListingsObj)}`);
        throw new Error('checking listings Obj');
        // transactions.forEach((hiveTransaction) => {
        //     // const jsonHiveTransaction = JSON.parse(
        //     //     JSON.stringify(hiveTransaction)
        //     // );
        //     const data = hiveTransaction?.data;
        //     const jsonData = JSON.parse(data);

        //     if (!jsonData) {
        //         window.api.bot.log({
        //             message: `/bot/server/services/hive/getRelistingType hiveTransaction does not have data or jsonData, hiveTransaction: ${JSON.stringify(
        //                 hiveTransaction
        //             )}`,
        //         });
        //         return;
        //     }

        //     const items = jsonData?.items;

        //     items?.forEach((listing) => {});

        //     // const transactionData = prepTransactionData({
        //     //     items: jsonData?.items,
        //     //     created_date: hiveTransaction?.created_date, //jsonHiveTransaction?.created_date,
        //     // });
        //     // console.log(
        //     //     `transactionData is: ${JSON.stringify(transactionData)}`
        //     // );
        //     if (jsonData?.suite_action === 'cancel') {
        //         // cancel.push(...transactionData);
        //     } else if (jsonData?.suite_action === 'relist') {
        //         //  relist.push(...transactionData);
        //     } else {
        //         //notSpecified.push(...transactionData);
        //         notSpecified = notSpecified + 1;
        //     }
        // });

        // window.api.bot.log({
        //     message: `/bot/server/services/hive/getRelistingType`,
        // });

        // window.api.bot.log({
        //     message: `Hive Transactions: ${transactions?.length}`,
        // });
        // window.api.bot.log({
        //     message: `Relisted: ${relist?.length}`,
        // });
        // window.api.bot.log({
        //     message: `Cancel: ${cancel?.length}`,
        // });
        // window.api.bot.log({
        //     message: `Not Specified: ${notSpecified}`,
        //     //  message: `Not Specified: ${notSpecified?.length}`,
        // });
        // window.api.bot.log({
        //     message: `Check: ${
        //         notSpecified?.length + cancel?.length + relist?.length ===
        //         transactions?.length
        //     }`,
        // });

        return { relist, cancel };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getRelistingType error: ${err.message}`,
        });
        throw err;
    }
};
// TODO:
const buildHiveListingsObj = ({ transactions }) => {
    try {
        const listings = {};
        const oldTxs = [];
        let tx = 0;
        if (transactions?.length < 1) {
            window.api.bot.log({
                message: `/bot/server/services/hive/buildHiveListingsObj transactions.length is less than 1, transactions: ${JSON.stringify(
                    transactions
                )}`,
            });
        }
        transactions.forEach((hiveTransaction) => {
            const data = hiveTransaction?.data;
            const jsonData = JSON.parse(data);
            if (!jsonData) {
                window.api.bot.log({
                    message: `/bot/server/services/hive/buildHiveListingsObj hiveTransaction does not have data or jsonData, hiveTransaction: ${JSON.stringify(
                        hiveTransaction
                    )}`,
                });
                return;
            }

            const items = jsonData?.items;
            const created_date = hiveTransaction?.created_date;
            let type;

            if (jsonData?.suite_action === 'cancel') {
                type = 'c';
            } else if (jsonData?.suite_action === 'relist') {
                type = 'rl';
            } else {
                type = 'n';
            }
            const created_time = new Date(created_date).getTime();
            console.log(
                `buildHiveListingsObj created_time: ${created_time}, created_date: ${created_date}`
            );

            items?.forEach((item) => {
                tx = tx + 1;
                const sell_id = item[0];
                const buy_price = item[1];

                if (listings[sell_id]) {
                    const existingTx = listings[sell_id];
                    if (existingTx?.created_time < created_time) {
                        listings[sell_id] = {
                            sell_id,
                            buy_price,
                            created_time,
                            type,
                        };
                    } else {
                        const txInfo = {
                            sell_id,
                            buy_price,
                            created_time,
                            type,
                        };
                        oldTxs.push(txInfo);
                    }
                } else {
                    // there is no existing sell_id in listings
                    listings[sell_id] = {
                        sell_id,
                        buy_price,
                        created_time,
                        type,
                    };
                }
            });
        });
        window.api.bot.log({
            message: `/bot/server/services/hive/buildHiveListingsObj`,
        });
        window.api.bot.log({
            message: `Hive Transactions: ${transactions?.length}`,
        });
        window.api.bot.log({
            message: `Hive Listings: ${tx}`,
        });
        window.api.bot.log({
            message: `Latest Listings: ${Object.keys(listings)?.length}`,
        });
        window.api.bot.log({
            message: `Old Transactions: ${oldTxs?.length}`,
        });
        window.api.bot.log({
            message: `Check: ${
                oldTxs?.length + Object.keys(listings)?.length === tx
            }`,
        });

        return listings;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/buildHiveListingsObj error: ${err.message}`,
        });
        throw err;
    }
};

const oldgetRelistingType = ({ transactions }) => {
    try {
        console.log(`getRelistingType start`);
        const relist = [];
        const cancel = [];
        const relistObj = {};
        const cancelObj = {};
        // const notSpecified = [];
        let notSpecified = 0;

        transactions.forEach((hiveTransaction) => {
            // const jsonHiveTransaction = JSON.parse(
            //     JSON.stringify(hiveTransaction)
            // );
            const data = hiveTransaction?.data;
            const jsonData = JSON.parse(data);

            if (!jsonData) {
                window.api.bot.log({
                    message: `/bot/server/services/hive/getRelistingType hiveTransaction does not have data or jsonData, hiveTransaction: ${JSON.stringify(
                        hiveTransaction
                    )}`,
                });
                return;
            }

            const transactionData = prepTransactionData({
                items: jsonData?.items,
                created_date: hiveTransaction?.created_date, //jsonHiveTransaction?.created_date,
            });
            console.log(
                `transactionData is: ${JSON.stringify(transactionData)}`
            );
            if (jsonData?.suite_action === 'cancel') {
                cancel.push(...transactionData);
            } else if (jsonData?.suite_action === 'relist') {
                relist.push(...transactionData);
            } else {
                //notSpecified.push(...transactionData);
                notSpecified = notSpecified + 1;
            }
        });

        window.api.bot.log({
            message: `/bot/server/services/hive/getRelistingType`,
        });

        window.api.bot.log({
            message: `Hive Transactions: ${transactions?.length}`,
        });
        window.api.bot.log({
            message: `Relisted: ${relist?.length}`,
        });
        window.api.bot.log({
            message: `Cancel: ${cancel?.length}`,
        });
        window.api.bot.log({
            message: `Not Specified: ${notSpecified}`,
            //  message: `Not Specified: ${notSpecified?.length}`,
        });
        window.api.bot.log({
            message: `Check: ${
                notSpecified?.length + cancel?.length + relist?.length ===
                transactions?.length
            }`,
        });

        return { relist, cancel };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getRelistingType error: ${err.message}`,
        });
        throw err;
    }
};
const TNTprepTransactionData = ({ items, created_date }) => {
    try {
        const transactions = [];
        const created_time = new Date(created_date).getTime();
        console.log(
            `prepTransactionData with created_date: ${created_date},  items: ${JSON.stringify(
                items
            )}`
        );
        items?.forEach((item) => {
            const txToAdd = [...item, created_time];
            transactions.push(txToAdd);
        });

        return transactions;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/prepTransactionData error: ${err.message}`,
        });
        throw err;
    }
};

const prepTransactionData = ({ items, created_date }) => {
    try {
        const transactions = [];
        const created_time = new Date(created_date).getTime();
        console.log(
            `prepTransactionData with created_date: ${created_date},  items: ${JSON.stringify(
                items
            )}`
        );
        items?.forEach((item) => {
            const txToAdd = [...item, created_time];
            transactions.push(txToAdd);
        });

        return transactions;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/prepTransactionData error: ${err.message}`,
        });
        throw err;
    }
};

const newprepTransactionData = ({ items, created_date }) => {
    try {
        const transactions = {};
        const oldTxs = [];
        const created_time = new Date(created_date).getTime();
        console.log(
            `prepTransactionData with created_date: ${created_date},  items: ${JSON.stringify(
                items
            )}`
        );
        items?.forEach((item) => {
            const sell_id = item[0];
            const buy_price = item[1];
            if (transactions[sell_id] == null) {
                transactions[sell_id] = {
                    sell_id,
                    buy_price,
                    created_time,
                };
            } else {
                const existingTx = transactions[sell_id];
                if (existingTx?.created_time < created_time) {
                    transactions[sell_id] = {
                        sell_id,
                        buy_price,
                        created_time,
                    };
                } else {
                    // the transaction data we currently have is more relevant than this old data, disregard it
                    const txInfo = { sell_id, buy_price, created_time };
                    oldTxs.push(txInfo);
                }
            }
            // const txToAdd = [...item, created_time];
            // transactions.push(txToAdd);
        });

        window.api.bot.log({
            message: `/bot/server/services/hive/prepTransactionData`,
        });
        window.api.bot.log({
            message: `oldTxs: ${oldTxs?.length}`,
        });
        window.api.bot.log({
            message: `Relevant Transactions: ${
                Object.keys(transactions)?.length
            }`,
        });
        window.api.bot.log({
            message: `Total Transactions: ${Object.keys(items)?.length}`,
        });
        return transactions;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/prepTransactionData error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getPostedSuiteRelistings,
};

/*

prepTransactionData with created_date: 2022-09-16T10:19:57.000Z,  items: [["dd998bc29079abcab71de53f195f9ea55942e0da-50",28.536749999999998],["dd998bc29079abcab71de53f195f9ea55942e0da-53",2.1681428],["dd998bc29079abcab71de53f195f9ea55942e0da-57",71.2305],["dd998bc29079abcab71de53f195f9ea55942e0da-61",10.89],["dd998bc29079abcab71de53f195f9ea55942e0da-65",7.74],["dd998bc29079abcab71de53f195f9ea55942e0da-76",38.016],["657170b1f707167af65f77b8b16a807003f6ddd3-7",65.58849000000001],["a0ea371597d66713f4febbad5b84901edcff3d5e-26",12.191],["a0ea371597d66713f4febbad5b84901edcff3d5e-30",78.408],["a0ea371597d66713f4febbad5b84901edcff3d5e-40",49.3515]]
hive.js?70b0:322 transactionData is: [["dd998bc29079abcab71de53f195f9ea55942e0da-50",28.536749999999998],["dd998bc29079abcab71de53f195f9ea55942e0da-53",2.1681428],["dd998bc29079abcab71de53f195f9ea55942e0da-57",71.2305],["dd998bc29079abcab71de53f195f9ea55942e0da-61",10.89],["dd998bc29079abcab71de53f195f9ea55942e0da-65",7.74],["dd998bc29079abcab71de53f195f9ea55942e0da-76",38.016],["657170b1f707167af65f77b8b16a807003f6ddd3-7",65.58849000000001],["a0ea371597d66713f4febbad5b84901edcff3d5e-26",12.191],["a0ea371597d66713f4febbad5b84901edcff3d5e-30",78.408],["a0ea371597d66713f4febbad5b84901edcff3d5e-40",49.3515]]


prepTransactionData with created_date: 2022-08-16T02:38:48.000Z,  items: [["417d17c64d240d0c4bc7964a5bafad069c51fa71-26","0.21749918000000001"],["417d17c64d240d0c4bc7964a5bafad069c51fa71-27","0.21749918000000001"],["058ab527ed355790e0384b7d120465c23ee9de57-1","82.24"],["24aadd12f2e900840c819a40bdb7f58df989e6d4-4",34.003]]
hive.js?70b0:322 transactionData is: [["417d17c64d240d0c4bc7964a5bafad069c51fa71-26","0.21749918000000001",1660617528000],["417d17c64d240d0c4bc7964a5bafad069c51fa71-27","0.21749918000000001",1660617528000],["058ab527ed355790e0384b7d120465c23ee9de57-1","82.24",1660617528000],["24aadd12f2e900840c819a40bdb7f58df989e6d4-4",34.003,1660617528000]]

*/

/*

hiveListingsObj: {"dd998bc29079abcab71de53f195f9ea55942e0da-51":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-51","buy_price":24.01443,"created_time":1663367529000},"dd998bc29079abcab71de53f195f9ea55942e0da-54":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-54","buy_price":53.31546,"created_time":1663367529000},"dd998bc29079abcab71de53f195f9ea55942e0da-73":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-73","buy_price":96.49035,"created_time":1663367529000},"dd998bc29079abcab71de53f195f9ea55942e0da-90":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-90","buy_price":9.40302,"created_time":1663367529000},"dd998bc29079abcab71de53f195f9ea55942e0da-93":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-93","buy_price":25.50141,"created_time":1663367529000},"439dff493cd95380cd6189b0a6e118e76149d1f4-60":{"sell_id":"439dff493cd95380cd6189b0a6e118e76149d1f4-60","buy_price":27.92691,"created_time":1663367529000},"a0ea371597d66713f4febbad5b84901edcff3d5e-25":{"sell_id":"a0ea371597d66713f4febbad5b84901edcff3d5e-25","buy_price":20.288069999999998,"created_time":1663367529000},"7c61a722bdc6987076b5594aed04157c0f785030-44":
*/

/*

hiveListingsObj: {"dd998bc29079abcab71de53f195f9ea55942e0da-51":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-51","buy_price":24.01443,"created_time":1663367529000,"type":"rl"},"dd998bc29079abcab71de53f195f9ea55942e0da-54":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-54","buy_price":53.31546,"created_time":1663367529000,"type":"rl"},"dd998bc29079abcab71de53f195f9ea55942e0da-73":

*/
