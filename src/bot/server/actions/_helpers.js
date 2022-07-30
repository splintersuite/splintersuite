'use strict';
const { setTimeout_safe } = require('../axios_retry/general');
const { axiosInstance } = require('../requests/axiosGetInstance');

const getCardDetailObj = async () => {
    try {
        //     console.log(`/bot/server/actions/_helpers/getCardDetailObj`);

        const cardDetails = await getCardDetails();
        const cardDetailObj = {};
        cardDetails.forEach((card) => {
            cardDetailObj[card.id] = card;
        });

        // console.log(`/bot/server/actions/_helpers/getCardDetailObj done`);
        return cardDetailObj;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/_helpers/getCardDetailObj error: ${err.message}`,
        });
        throw err;
    }
};

const getCardDetails = async () => {
    try {
        const res = await axiosInstance(
            `https://api2.splinterlands.com/cards/get_details`
        );
        return res.data;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/_helpers/getCardDetails error: ${err.message}`,
        });
        throw err;
    }
};

const isOnCooldown = (date) => {
    try {
        //   console.log(`isOnCooldown start`);
        const aDayInMs = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();
        const yesterday = now - aDayInMs;
        const _date = new Date(date).getTime();

        const difference = yesterday - _date;

        if (difference > 0) {
            // cooldown period lasts for 24 hours so no longer on cooldown
            return false;
        } else if (difference < 0) {
            // the date occured less than 24 hours ago
            return true;
        } else {
            return true;
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/_helpers/isOnCooldown error: ${err.message}`,
        });
        throw err;
    }
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout_safe(resolve, ms));
};

module.exports = {
    isOnCooldown,
    sleep,
    getCardDetails,
    getCardDetailObj,
};

// cancellationMatrix[0]
// when there is 1 days (days_till_eos) till end of sesaon.  we will cancel your rental when
// your rental price is 20% (cancellation_threshold) less than the current_market_price

// cancellationMatrix[1]
// when there are 10 days (days_till_eos) till end of sesaon.  we will cancel your rental when
// your rental price is 40% (cancellation_threshold) less than the current_market_price

// where:
// cancellationMatrix[0]
// when there is 15 days (days_till_eos) till end of sesaon.  we will cancel your rental when
// your rental price is 20% (cancellation_threshold) less than the current_market_price

// cancellationMatrix[1]
// when there are 14 days (days_till_eos) till end of sesaon.  we will cancel your rental when
// your rental price is 14% (cancellation_threshold) less than the current_market_price

// and current_market_price is defined by median, else high depending on number of listings
