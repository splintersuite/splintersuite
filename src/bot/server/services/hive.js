'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');
const { sleep } = require('../axios_retry/general');

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

const getSuccessfulSuiteRelistings = async ({ username }) => {
    try {
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getSuccessfulSuiteRelistings error: ${err.message}`,
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
                successArr.push(transaction);
            } else {
                errArr.push(transaction);
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
        if (data && data?.agent === 'splintersuite') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/isSplintersuite error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getPostedSuiteListings,
    getRecentHiveRelistings,
};
