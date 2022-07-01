const cardDetails = require('../cardDetails.json');

const cardRarity = {};
cardDetails.forEach((card) => {
    cardRarity[card.id] = card.rarity;
});

module.exports = { cardRarity };
