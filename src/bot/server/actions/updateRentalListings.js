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
                    //  searchableRentListByMarketId[card.market_id] = card;
                    searchableRentListByUid[card.uid] = card;
                }
            }
        });

        return {
            cardsListedButNotRentedOut,
            searchableRentListByUid,
            //searchableRentListByMarketId,
        };
    } catch (err) {
        console.error(`filterCollectionByRentalListings error: ${err.message}`);
        throw err;
    }
};

const filterRentalListingsByNewPostedTransactions = ({
    listings,
    relistings,
    searchableRentalListings,
}) => {
    try {
        // listings and relistings both arrays of arrays that have [uid, priceInDec]
        console.log(`filterRentalListingsByNewPostedTransactions start`);
        const newRentalListings = [];
        const rentalRelistings = [];
        listings.forEach((listing) => {
            const uid = listing[0];
            const cardInfo = searchableRentalListings[uid];
            if (cardInfo != null) {
                newRentalListings.push(cardInfo);
            }
        });

        relistings.forEach((relisting) => {
            const uid = relisting[0];
            const cardInfo = searchableRentalListings[uid];
            if (cardInfo != null) {
                rentalRelistings.push(cardInfo);
            }
        });
        return { newRentalListings, rentalRelistings };
    } catch (err) {
        console.error(
            `filterRentalListingsByNewPostedTransactions error: ${err.message}`
        );
        throw err;
    }
};

module.exports = {
    filterCollectionByRentalListings,
    filterRentalListingsByNewPostedTransactions,
};
