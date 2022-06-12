"use strict";

const {
  getGroupedRentalsForLevel,
  convertForRentGroupOutputToSearchableObject,
} = require("./rentalListInfo");

const calculateRelistingPrice = async ({ collectionObj }) => {
  try {
    console.log("calculateRelistingPrice start");

    const relistingPriceForEachMarketId = [];
    const cardsUnableToFindPriceFor = [];
    const cardsNotWorthRelisting = [];

    for (const level in collectionObj) {
      // should be a max of 10 possible times we can go through this because max lvl is 10

      // aggregate rental price data for cards of the level
      const groupedRentalsList = await getGroupedRentalsForLevel({ level });

      const searchableRentList = convertForRentGroupOutputToSearchableObject({
        groupedRentalsList,
      });

      for (const card of collectionObj[level]) {
        const rentalPriceForMarketId =
          addPriceRelistInformationForEachCardByMarketId({
            card,
            searchableRentList,
          });
        if (rentalPriceForMarketId[0] === "N") {
          cardsUnableToFindPriceFor.push(rentalPriceForMarketId);
        } else if (rentalPriceForMarketId[0] === "C") {
          cardsNotWorthRelisting.push(rentalPriceForMarketId);
        } else {
          relistingPriceForEachMarketId.push(rentalPriceForMarketId);
        }
      }
    }
    // TNT TODO: find new price data for the cards in cardsUnableToFindPriceFor
    return { relistingPriceForEachMarketId, cardsNotWorthRelisting };
  } catch (err) {
    console.error(`calculateRelistingPrice error: ${err.message}`);
    throw err;
  }
};

const addPriceRelistInformationForEachCardByMarketId = ({
  card,
  searchableRentList,
}) => {
  try {
    console.log(`addPriceRelistInformationForEachCardByUid start`);
    const { card_detail_id, gold, edition, market_id, buy_price, uid } = card;
    let _gold = "F";
    if (gold) {
      _gold = "T";
    } else {
      _gold = "F";
    }
    const rentListKey = `${card_detail_id}${_gold}${edition}`;
    const priceData = searchableRentList[rentListKey];

    if (priceData == null || priceData.low_price == null) {
      const rentalNotFoundForCard = ["N", uid, market_id];
      return rentalNotFoundForCard;
    } else if (priceData.low_price < buy_price) {
      // this means that the card should NOT be relisted
      const doNotChangeThePrice = [
        "C",
        uid,
        market_id,
        buy_price,
        priceData.low_price,
      ];
      return doNotChangeThePrice;
    } else {
      const price = priceData.low_price;

      const rentalRelistingPriceForMarketId = [market_id, price];

      return rentalRelistingPriceForMarketId;
    }
  } catch (err) {
    console.error(
      `addPriceRelistInformationForEachCardByUid error: ${err.message}`
    );
    throw err;
  }
};

module.exports = {
  calculateRelistingPrice,
};
