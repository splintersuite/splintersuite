'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');

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
};

const getRecentHiveRelistings = async ({ username }) => {
    try {
        const url = `https://api2.splinterlands.com/players/history?username=${username}&from_block=-1&limit=250&types=update_rental_price`;
        const res = await axiosInstance(url);

        const results = res.data;

        return results;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getRecentHiveRelistings error: ${err.message}`,
        });
        throw err;
    }
};

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

        return postedSuiteListings;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteListings error: ${err.message}`,
        });
        throw err;
    }
};

const getPostedSuiteRelistings = async ({ username }) => {
    try {
        console.log(`/bot/server/services/hive/getPostedSuiteRelistings`);

        const relistings = await getRecentHiveRelistings({ username });
        //  console.log(`relistings: ${JSON.stringify(relistings)}`);

        const postedRelistings = getSuccessfulTransactions({
            transactions: relistings,
        });

        //  console.log(`postedRelistings: ${JSON.stringify(postedRelistings)}`);
        const postedSuiteRelistings = getSplinterSuiteTransactions({
            transactions: postedRelistings,
        });

        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteRelistings`,
        });
        window.api.bot.log({
            message: `Relistings: ${postedSuiteRelistings?.length}`,
        });

        const postedSuiteRelistingsByType = getRelistingType({
            transactions: postedSuiteRelistings,
        });

        return postedSuiteRelistingsByType;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteRelistings error: ${err.message}`,
        });
        throw err;
    }
};

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
};
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
};

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
        const relist = [];
        const cancel = [];
        const notSpecified = [];

        transactions.forEach((hiveTransaction) => {
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
            if (jsonData?.suite_action === 'cancel') {
                cancel.push(hiveTransaction);
            } else if (jsonData?.suite_action === 'relist') {
                relist.push(hiveTransaction);
            } else {
                notSpecified.push(hiveTransaction);
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
            message: `Not Specified: ${notSpecified?.length}`,
        });
        window.api.bot.log({
            message: `Check: ${
                notSpecified?.length + cancel?.length + relist?.length ===
                transactions?.length
            }`,
        });

        return { relist, cancel, notSpecified };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getRelistingType error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getPostedSuiteListings,
    getPostedSuiteRelistings,
};
