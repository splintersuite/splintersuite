'use strict';

const { getCollection } = require('./collection.js');

const filterCollectionByRentalListings = async ({ username }) => {
    try {
        console.log(`filterCollectionByRentalListings start`);

        const collection = await getCollection(username);

        const cardsListedButNotRentedOut = [];
        const searchableRentListByUid = {};
        const searchableRentListByMarketId = {};
        collection.forEach((card) => {
            if (card.player === username && card.delegated_to == null) {
                if (
                    card.market_listing_type === 'RENT' &&
                    card.market_listing_status === 0 &&
                    card.market_id != null
                ) {
                    cardsListedButNotRentedOut.push(card);
                    searchableRentListByMarketId[card.market_id] = card;
                    searchableRentListByUid[card.uid] = card;
                }
            }
        });

        return {
            cardsListedButNotRentedOut,
            searchableRentListByUid,
            searchableRentListByMarketId,
        };
    } catch (err) {
        console.error(`filterCollectionByRentalListings error: ${err.message}`);
        throw err;
    }
};

module.exports = {
    filterCollectionByRentalListings,
};
