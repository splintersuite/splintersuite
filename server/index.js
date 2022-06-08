"use strict";

const { currentRentedOutCardsInfo } = require("./actions/currentRentals");

const test = async () => {
  try {
    const rentedOut = await currentRentedOutCardsInfo("hackinhukk");

    console.log(`number of cards rented out: ${rentedOut.length}`);
    console.log(rentedOut.length);
    return;
  } catch (err) {
    console.error(`error: ${err.message}`);
    throw err;
  }
};

test();
