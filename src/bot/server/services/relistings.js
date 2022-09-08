'use strict';
const _ = require('lodash');
const { isOnCooldown } = require('../actions/_helpers.js');
const dates = require('../util/dates');
const ALL_OPEN_TRADES = 'ALL_OPEN_TRADES';
const TRADES_DURING_PERIOD = 'TRADES_DURING_PERIOD';
const msInADay = 1000 * 60 * 60 * 24;
const handleListingTooLong = ({
    card,
    listingPrice,
    level,
    currentPriceStats,
    isClBcxModern,
    seasonEndTime,
    daysTillEOS,
    listings, // TNT NOTE: THIS SHOULD BE a local object, we update it when the cards we are listing or analyzing ourselves
    // and just looking through cards that could ever be rented out.  If its delegated out, we don't care because it doesn't affect how long something has actually been off the market

    //endOfSeasonSettings, // seasonEndTime, daysTillEOS
}) => {
    try {
        //const { market_listing_status, market_created_date, buy_price, } = card;
        // if (daysTillEOS < 1 && ) {

        // }
        const now = new Date();
        const nowTime = now.getTime();
        const yesterdayTime = nowTime - msInADay;
        //  const market_created_date = card?.market_created_date;
        if (
            card?.market_listing_status === 0 &&
            card?.market_created_date?.getTime() &&
            dates.isBeforeTime({
                time: card?.market_created_date,
                dateTime: yesterdayTime,
            })
        ) {
            // this means that its been over 24 hours now since we have listed this card for rental.
        }
        // we can care about if its been longer than a day, then we should check the current listed price we have (aka buy_price),
        // and see if the median is lower or at that price, as well as how it compares to the lowest_listing_price and if the high is higher than the current listing price
        // decide whether to try and undercut or not (imo we should choose not to unless median && average is below it)
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/relistings/handleListingTooLong error: ${err.message}`,
        });
        throw err;
    }
};
