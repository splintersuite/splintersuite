'use strict';

const { findCardPower } = require('./calculatePower');

const filterCollectionArraysByCPLimitThresholds = ({
    collection,
    settings,
}) => {
    try {
        console.log(`filterCollectionArraysByCPLimitThresholds start`);
        const newArray = [];
        collection.forEach((card) => {
            const {
                tier,
                rarity,
                gold,
                edition,
                alpha_xp,
                xp,
                card_detail_id,
            } = card;
            let limitPower;
            switch (rarity) {
                case 1:
                    limitPower = settings.commonCP;
                    break;
                case 2:
                    limitPower = settings.rareCP;
                    break;
                case 3:
                    limitPower = settings.epicCP;
                    break;
                case 4:
                    limitPower = settings.legendaryCP;
                    break;
                default:
                    throw new Error('this should not happen');
                    console.error(
                        `card does not have a rarity their either exists or is outside of the integer range 1-4.  Card_detail_id is ${card.card_detail_id}, cardUid is: ${card.uid}, Value of rarity is ${rarity}`
                    );
            }

            // const findCardPower = ({ id, rarity, _xp, alpha_xp, _tier, edition, gold }) =>
            const cardPower = findCardPower({
                id: card_detail_id,
                rarity,
                _xp: xp,
                alpha_xp,
                _tier: tier,
                gold,
                edition,
            });
            if (parseInt(cardPower) >= parseInt(limitPower)) {
                newArray.push(card);
            } else {
                // console.log('this card is being excluded`);
            }
        });
        return newArray;
    } catch (err) {
        window.api.bot.log({
            message: err.message,
        });
        console.error(
            `filterCollectionArraysByCPLimitThresholds error: ${err.message}`
        );
        throw err;
    }
};

module.exports = {
    filterCollectionArraysByCPLimitThresholds,
};
