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
    users_id,
    listings,
    relistings,
    searchableRentalListings,
}) => {
    try {
        // listings and relistings both arrays of arrays that have [uid, priceInDec]
        console.log(`filterRentalListingsByNewPostedTransactions start`);
        const newRentalListings = [];
        const rentalRelistings = [];
        const rentalListings = [];
        listings.forEach((listing) => {
            const uid = listing[0];
            const cardInfo = searchableRentalListings[uid];
            if (cardInfo != null) {
                const cardToInsert = adjustCollectionRentalListingDataForDB({
                    cardInfo,
                });
                rentalListings.push(cardToInsert);
            }
        });

        relistings.forEach((relisting) => {
            const uid = relisting[0];
            const cardInfo = searchableRentalListings[uid];
            if (cardInfo != null) {
                const cardToInsert = adjustCollectionRentalListingDataForDB({
                    cardInfo,
                    users_id,
                });
                rentalListings.push(cardToInsert);
            }
        });
        return rentalListings;
    } catch (err) {
        console.error(
            `filterRentalListingsByNewPostedTransactions error: ${err.message}`
        );
        throw err;
    }
};

const adjustCollectionRentalListingDataForDB = ({ cardInfo, users_id }) => {
    try {
        const {
            market_created_date,
            card_detail_id,
            level,
            uid,
            market_id,
            buy_price,
            gold,
        } = cardInfo;
        console.log('adjustCollectionRentalListingDataForDB start');
        const cardToInsert = {};
        // TNT NOTE: we need to actually get this ideally from the userData stored in the store
        cardToInsert.users_id = users_id;
        cardToInsert.sl_created_at = new Date(market_created_date);
        cardToInsert.card_detail_id = parseInt(card_detail_id);
        cardToInsert.level = parseInt(level);
        cardToInsert.card_uid = uid;
        cardToInsert.sell_trx_id = market_id;
        cardToInsert.price = parseFloat(buy_price);
        cardToInsert.is_gold = gold;

        return cardToInsert;
    } catch (err) {
        console.error(
            `adjustCollectionRentalListingDataForDB error: ${err.message}`
        );
        throw err;
    }
};

module.exports = {
    filterCollectionByRentalListings,
    filterRentalListingsByNewPostedTransactions,
};
