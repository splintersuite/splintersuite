"use strict";

const { axiosInstance } = require("./axios_retry_instance");

const getCollection = async (username) => {
  try {
    const url = `https://api2.splinterlands.com/cards/collection`;

    const res = await axiosInstance(`${url}/${username}`);

    const data = res.data;
    console.log("the restponse of collection is: ", res.data);

    const collection = data.cards;
    return collection;
  } catch (err) {
    console.error(`getCollection error: ${err.message}`);
    throw err;
  }
};

const getCardsAvailablesForRent = ({ username, collection }) => {
  try {
    console.log("cardAvailbleForRent start");

    const cardsAvailableForRent = [];

    const cardsOnRentalCooldown = [];

    collection.forEach((card) => {
      if (
        card.player === username &&
        card.market_listing_type == null &&
        card.delegated_to == null
      ) {
        if (
          card.last_used_player === username &&
          isOnCooldown(card.last_used_date)
        ) {
          console.log("card is on cooldown, can rent once its off CD");
          cardsOnRentalCooldown.push(card);
        } else {
          console.log(
            "card is not on cooldown, listed for rent, or delegated to anyone, and owned by the player. Can rent it out"
          );
          cardsAvailableForRent.push(card);
        }
      }
    });
    console.log("getCardsAvailablesForRent done");
    return { cardsAvailableForRent, cardsOnRentalCooldown };
  } catch (err) {
    console.error(`cardsAvailablesForRent error: ${err.message}`);
    throw err;
  }
};

const isOnCooldown = (date) => {
  try {
    console.log(`isOnCooldown start`);
    const aDayInMs = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const yesterday = now - aDayInMs;
    const _date = date.getTime();

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
  getCollection,
  getCardsAvailablesForRent,
};
