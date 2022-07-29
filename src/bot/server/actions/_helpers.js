'use strict';
let cardDetails = require('../cardDetails.json');
const { setTimeout_safe } = require('../axios_retry/general');
const { axiosInstance } = require('../requests/axiosGetInstance');

const findCardDetails = (id) => {
    try {
        //  console.log(`findCardDetails start`);
        let card = cardDetails.find((o) => parseInt(o.id) === parseInt(id));
        if (!card) {
            return null;
        }
        const { name, rarity, editions, is_promo, tier } = card;

        return { name, rarity, editions, is_promo, tier };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/_helpers/findCardDetails error: ${err.message}`,
        });
        throw err;
    }
};

// https://stackoverflow.com/questions/17648395/which-is-faster-for-loop-or-hasownproperty
const updateCardDetails = async (collection) => {
    try {
        const seen = {};
        for (const card of collection) {
            if (seen[card.card_detail_id] === undefined) {
                seen[card.card_detail_id] = 'dummy';
                if (findCardDetails(card.card_detail_id) === null) {
                    cardDetails = await getCardDetails();
                }
            }
        }
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/_helpers/updateCardDetails error: ${err.message}`,
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
    findCardDetails,
    isOnCooldown,
    sleep,
    getCardDetails,
    updateCardDetails,
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
