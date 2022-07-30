'use strict';

const {
    filterCollectionArraysByLevelLimitThresholds,
    sortCollectionArrayByLevel,
    filterCollectionArrayByLevel,
} = require('./collection');

const { filterCollectionArraysByCPLimitThresholds } = require('./settings');

const transformCollectionIntoCollectionByLevelObj = ({
    settings,
    collection,
}) => {
    try {
        // console.log(`transformCollectionIntoCollectionByLevelObj start`);

        const cardsFilteredByUserLevelLimits =
            filterCollectionArraysByLevelLimitThresholds({
                collection,
                settings,
            });

        const cardsFilteredByUserPowerLimits =
            filterCollectionArraysByCPLimitThresholds({
                collection: cardsFilteredByUserLevelLimits,
                settings,
            });

        const sortedByLevelArray = sortCollectionArrayByLevel({
            collection: cardsFilteredByUserPowerLimits,
        });

        const collectionByLevelObj = filterCollectionArrayByLevel({
            collection: sortedByLevelArray,
        });

        return collectionByLevelObj;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/actions/getRentalPricesForGrouped/transformCollectionIntoCollectionByLevelObj error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    transformCollectionIntoCollectionByLevelObj,
};
