'use strict';

const {
    filterCollectionArraysByLevelLimitThresholds,
    sortCollectionArrayByLevel,
    filterCollectionArrayByLevel,
    filterCollectionArraysByCPLimitThresholds,
} = require('./collection');

const transformCollectionIntoCollectionByLevelObj = ({
    settings,
    collection,
}) => {
    try {
        console.log(`transformCollectionIntoCollectionByLevelObj start`);

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
        console.error(
            `transformCollectionIntoCollectionByLevelObj error: ${err.message}`
        );
        throw err;
    }
};

module.exports = {
    transformCollectionIntoCollectionByLevelObj,
};
