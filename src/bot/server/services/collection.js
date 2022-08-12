'use strict';

const { filterCollectionArrayByLevel } = require('../actions/collection');

const filterCollectionByEdition = ({ collection }) => {
    try {
        const alpha = [];
        const beta = [];
        const untamed = [];
        const chaosLegion = [];
        const gladius = [];
        const dice = [];
        const rewardCards = [];
        const promoCards = [];
        collection.forEach((card) => {
            const { edition, tier, rarity } = card;

            switch (edition) {
                case 0:
                    alpha.push(card);
                    break;
                case 1:
                    beta.push(card);
                    break;
                case 2:
                    promoCards.push(card);
                    break;
                case 3:
                    rewardCards.push(card);
                    break;
                case 4:
                    untamed.push(card);
                    break;
                case 5:
                    dice.push(card);
                    break;
                case 6:
                    gladius.push(card);
                    break;
                case 7:
                    chaosLegion.push(card);
                    break;
                default:
                    throw new Error(
                        `edition: ${edition} for card: ${JSON.stringify(
                            card
                        )} is not currently available`
                    );
            }
        });

        return {
            alpha,
            beta,
            untamed,
            chaosLegion,
            gladius,
            dice,
            rewardCards,
            promoCards,
        };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/filterCardsByEdition error: ${err.message}`,
        });
        throw err;
    }
};

const getLowBCXCLCardsByUid = ({ collection }) => {
    try {
        const { chaosLegion } = filterCollectionByEdition({ collection });

        const cardsByLevel = filterCollectionArrayByLevel({
            collection: chaosLegion,
        });

        const cardObjByUid = {};
        cardsByLevel[1].forEach((card) => {
            if (cardObjByUid[card.uid] === undefined) {
                cardObjByUid[card.uid] = { ...card };
            }
        });
        return cardObjByUid;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/getLowBCXCLCardsByUid error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getLowBCXCLCardsByUid,
};
