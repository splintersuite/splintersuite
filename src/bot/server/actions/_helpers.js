"use strict";
const cardDetails = require("../cardDetails.json");

const findCardDetails = (id) => {
  try {
    console.log(`findCardDetails start`);
    const card = cardDetails.find((o) => parseInt(o.id) === parseInt(id));
    const { name, rarity, editions, is_promo, tier } = card;

    return { name, rarity, editions, is_promo, tier };
  } catch (err) {
    console.error(`findCardDetails error: ${err.message}`);
    throw err;
  }
};

const isOnCooldown = (date) => {
  try {
    console.log(`isOnCooldown start`);
    const aDayInMs = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const yesterday = now - aDayInMs;
    const _date = new Date(date).getTime();

    const difference = yesterday - _date;

    if (difference > 0) {
      // cooldown period lasts for 24 hours so no longer on cooldown
      console.log(
        "the date occured more than 24 hours behind the present time, return false"
      );
      return false;
    } else if (difference < 0) {
      // the date occured less than 24 hours ago
      console.log("isOnCooldown is returning true");
      return true;
    }
  } catch (err) {
    console.error(`isOnCooldown error: ${err.message}`);
    throw err;
  }
};

module.exports = {
  findCardDetails,
  isOnCooldown,
};
