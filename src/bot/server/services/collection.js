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

const filterByRarity = ({ collection }) => {
    try {
        const commons = [];
        const rares = [];
        const epics = [];
        const legendaries = [];
        collection.forEach((card) => {
            const { rarity } = card;

            switch (rarity) {
                case 1:
                    commons.push(card);
                    break;
                case 2:
                    rares.push(card);
                    break;
                case 3:
                    epics.push(card);
                    break;
                case 4:
                    legendaries.push(card);
                    break;
                default:
                    throw new Error(
                        `this rarity number shouldnt be possible, rarity: ${rarity}`
                    );
            }
        });

        return { commons, rares, epics, legendaries };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/filterByRarity error: ${err.message}`,
        });
        throw err;
    }
};

const filterCollectionByRewardCards = ({ collection }) => {
    try {
        const alphaBetaRewards = [];
        const untamedRewards = [];
        const chaosLegionRewards = [];

        collection.forEach((card) => {
            const { edition, tier } = card;
            if (edition !== 3) {
                return;
            }
            if (tier == null) {
                alphaBetaRewards.push(card);
                return;
            }

            switch (tier) {
                case 4:
                    untamedRewards.push(card);
                    break;
                case 7:
                    chaosLegionRewards.push(card);
                    break;
                default:
                    console.log('card error');
                    console.log(card);
                    throw new Error(
                        `tier: ${tier} that we don't support from card: ${card}`
                    );
                    break;
            }
        });

        return { alphaBetaRewards, untamedRewards, chaosLegionRewards };
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/filterCollectionByRewardCards error: ${err.message}`,
        });
        throw err;
    }
};

const getLowBCXModernCardsByUid = ({ collection }) => {
    try {
        if (!Array.isArray(collection) || collection.length < 1) {
            return {};
        }
        const { chaosLegion, untamed } = filterCollectionByEdition({
            collection,
        });

        const modernCards = [];
        modernCards.push(...chaosLegion);
        modernCards.push(...untamed);

        const cardsByLevel = filterCollectionArrayByLevel({
            collection: modernCards,
        });

        if (!Array.isArray(cardsByLevel[1]) || cardsByLevel[1].length < 1) {
            return {};
        }
        const { commons, rares } = filterByRarity({
            collection: cardsByLevel[1],
        });

        const modernGhostCards = [];
        modernGhostCards.push(...commons);
        modernGhostCards.push(...rares);

        const rewardCardsNotWorthRenting = getLowCLBCXRewardCards({
            collection,
        });

        const cardObjByUid = {};
        modernGhostCards.forEach((card) => {
            if (
                cardObjByUid[card.uid] === undefined &&
                rewardCardsNotWorthRenting[card.uid] === undefined
            ) {
                cardObjByUid[card.uid] = { ...card };
            }
        });

        console.log(
            `/bot/server/services/collection/getLowBCXModernCardsByUid length: ${
                Object.keys(cardObjByUid).length
            }`
        );

        return cardObjByUid;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/getLowBCXModernCardsByUid error: ${err.message}`,
        });
        throw err;
    }
};

const getLowCLBCXRewardCards = ({ collection }) => {
    try {
        if (!Array.isArray(collection) || collection.length < 1) {
            return {};
        }
        const { rewardCards } = filterCollectionByEdition({ collection });

        if (!Array.isArray(rewardCards) || rewardCards.length < 1) {
            return {};
        }
        const { chaosLegionRewards } = filterCollectionByRewardCards({
            collection: rewardCards,
        });
        if (
            !Array.isArray(chaosLegionRewards) ||
            chaosLegionRewards.length < 1
        ) {
            return {};
        }
        const cardsByLevel = filterCollectionArrayByLevel({
            collection: chaosLegionRewards,
        });

        if (!Array.isArray(cardsByLevel[1]) || cardsByLevel[1].length < 1) {
            return {};
        }
        const { commons, rares } = filterByRarity({
            collection: cardsByLevel[1],
        });

        const lowBCXRewardCards = [];
        lowBCXRewardCards.push(...commons);
        lowBCXRewardCards.push(...rares);

        const cardObjByUid = {};
        lowBCXRewardCards.forEach((card) => {
            if (cardObjByUid[card.uid] === undefined) {
                cardObjByUid[card.uid] = { ...card };
            }
        });
        return cardObjByUid;
    } catch (err) {
        window.api.bot.log({
            message: `/bot/server/services/collection/getLowCLBCXRewardCards error: ${err.message}`,
        });
        throw err;
    }
};

module.exports = {
    getLowBCXModernCardsByUid,
    getLowCLBCXRewardCards,
};
