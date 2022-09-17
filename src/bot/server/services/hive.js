'use strict';

const { axiosInstance } = require('../requests/axiosGetInstance');

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

const getPostedSuiteRelistings = async ({ username, lastCreatedTime }) => {
    try {
        //   console.log(`/bot/server/services/hive/getPostedSuiteRelistings`);

        const relistings = await getRecentHiveRelistings({
            username,
            lastCreatedTime,
        });

        const { relist, cancel } = getRelistingType({
            transactions: relistings,
        });

        return { relist, cancel };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/getPostedSuiteRelistings error: ${err.message}`,
        });
        throw err;
    }
};

const getRecentHiveRelistings = async ({ username, lastCreatedTime }) => {
    try {
        const hiveRelistings = [];
        let notOurs = 0;
        let notSuccess = 0;
        const hiveListings = await getHiveRelistings({ username });

        hiveListings.forEach((hiveTransaction) => {
            const { created_date } = hiveTransaction;
            const createdTime = new Date(created_date).getTime();
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

const isSplintersuite = ({ hiveTransaction }) => {
    try {
        const data = hiveTransaction?.data;
        const jsonData = JSON.parse(data);
        if (jsonData && jsonData?.agent === 'splintersuite') {
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

const seperateByListingType = ({ hiveListingsObj }) => {
    try {
        const relist = {};
        const cancel = {};
        let none = 0;
        let listingCatch = 0;
        let total = 0;
        for (const [sell_id, listing] of Object.entries(hiveListingsObj)) {
            total = total + 1;
            const { type } = listing;
            if (type === 'rl') {
                relist[sell_id] = listing;
            } else if (type === 'c') {
                cancel[sell_id] = listing;
            } else if (type === 'n') {
                none = none + 1;
            } else {
                listingCatch = listingCatch + 1;
            }
        }
        window.api.bot.log({
            message: `/bot/server/services/hive/seperateByListingType`,
        });
        window.api.bot.log({
            message: `Relistings: ${Object.keys(relist)?.length}`,
        });
        window.api.bot.log({
            message: `Cancelled: ${Object.keys(cancel)?.length}`,
        });
        window.api.bot.log({
            message: `No SS_Action: ${none}`,
        });
        window.api.bot.log({
            message: `Catch: ${listingCatch}`,
        });
        window.api.bot.log({
            message: `Check: ${
                total ===
                listingCatch +
                    none +
                    Object.keys(relist)?.length +
                    Object.keys(cancel)?.length
            }`,
        });
        return { relist, cancel };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/hive/seperateByListingType error: ${err.message}`,
        });
        throw err;
    }
};

const getRelistingType = ({ transactions }) => {
    try {
        //  console.log(`getRelistingType start`);

        const hiveListingsObj = buildHiveListingsObj({ transactions });
        const { relist, cancel } = seperateByListingType({ hiveListingsObj });

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

module.exports = {
    getPostedSuiteRelistings,
};

/*
final result:

relist: {"dd998bc29079abcab71de53f195f9ea55942e0da-51":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-51","buy_price":24.01443,"created_time":1663367529000,"type":"rl"},"dd998bc29079abcab71de53f195f9ea55942e0da-54":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-54","buy_price":53.31546,"created_time":1663367529000,"type":"rl"},"dd998bc29079abcab71de53f195f9ea55942e0da-73":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-73","buy_price":96.49035,"created_time":1663367529000,"type":"rl"},"dd998bc29079abcab71de53f195f9ea55942e0da-90":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-90","buy_price":9.40302,"created_time":1663367529000,"type":"rl"},"dd998bc29079abcab71de53f195f9ea55942e0da-93":{"sell_id":"dd998bc29079abcab71de53f195f9ea55942e0da-93","buy_price":25.50141,"created_time":1663367529000,"type":"rl"},"439dff493cd95380cd6189b0a6e118e76149d1f4-60":
cancel: {"e3e05a71a04ee01eca8cbbba8f708c1d93967fd6-0":{"sell_id":"e3e05a71a04ee01eca8cbbba8f708c1d93967fd6-0","buy_price":67.011,"created_time":1663365939000,"type":"c"},"657170b1f707167af65f77b8b16a807003f6ddd3-4":{"sell_id":"657170b1f707167af65f77b8b16a807003f6ddd3-4","buy_price":40,"created_time":1663365939000,"type":"c"},"a0ea371597d66713f4febbad5b84901edcff3d5e-39":{"sell_id":"a0ea371597d66713f4febbad5b84901edcff3d5e-39","buy_price":107.483,"created_time":1663127811000,"type":"c"},"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-9":{"sell_id":"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-9","buy_price":0.188,"created_time":1663112397000,"type":"c"},"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-8":{"sell_id":"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-8","buy_price":0.188,"created_time":1663112397000,"type":"c"},"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-10":{"sell_id":"0b6509d4dd372da3616ce4ecc11e86144fa96a2c-10","buy_price":0.188,"created_time":1663112397000,"type":"c"},"1a7e1dcccd7875c36dca164bb4764a82da943915-1":{"sell_id":"1a7e1dcccd7875c36dca164bb4764a82da943915-1","buy_price":0.26569927,"created_time":1663112397000,"type":"c"},"84934f264c83cffd9c410ec29815c7c5813b4772-0":{"sell_id":"84934f264c83cffd9c410ec29815c7c5813b4772-0","buy_price":0.2,"created_time":1663112397000,"type":"c"},"dd998bc29079abcab71de53f195f9ea55942e0da-35":
*/
