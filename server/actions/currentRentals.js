"use strict";

const { axiosInstance } = require("../requests/axiosGetInstance");

// https://discord.com/channels/447924793048825866/567729128900526120/882406218344316968
const currentRentedOutCardsInfo = async (username) => {
  try {
    console.log("currentRentedOutCardsInfo start");

    const url = "https://api2.splinterlands.com/market/active_rentals";

    const res = await axiosInstance(url, {
      params: {
        owner: username,
      },
    });
    const results = res.data;

    return results;
    // TNT NOTE: my only concern with this endpoint is some sort of limit so potentially need pagination to get all of them, tbd though (and the return from collection filterAllCardsAvailablesForRent will have all the actual listed ones, so can compare
  } catch (err) {
    console.error(`currentRentedOutCardsInfo error: ${err.message}`);
    throw err;
  }
};

module.exports = {
  currentRentedOutCardsInfo,
};
