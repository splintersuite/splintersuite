"use strict";

const maxBurnBonus = 1.05;
const AlphaBurnBonus = 2;
const PromoBurnBonus = 2;
const GoldBurnBonus = 50;
const GoldBurnBonus2 = 25;

const XPProperty = {
  alpha_xp: [20, 100, 250, 1000],
  gold_xp: [250, 500, 1000, 2500],
  beta_xp: [15, 75, 175, 750],
  beta_gold_xp: [200, 400, 800, 2000],
};

const BurnRates = {
  burn_rate: [15, 60, 300, 1500],
  untamed_burn_rate: [10, 40, 200, 1000],
};

const CombinaeRatesGold = [
  [0, 0, 1, 2, 5, 9, 14, 20, 27, 38],
  [0, 1, 2, 4, 7, 11, 16, 22],
  [0, 1, 2, 4, 7, 10],
  [0, 1, 2, 4],
];

const CombineRates = [
  [1, 5, 14, 30, 60, 100, 150, 220, 300, 400],
  [1, 5, 14, 25, 40, 60, 85, 115],
  [1, 4, 10, 20, 32, 46],
  [1, 3, 6, 11],
];

const XPLevels = [
  [20, 60, 160, 360, 750, 1560, 2560, 4560, 7560],
  [100, 300, 700, 1500, 2500, 4500, 8500],
  [250, 750, 1750, 3750, 7750],
  [1000, 3000, 7000],
];

const findCardPower = (id, rarity, _xp, alpha_xp, _tier, edition, gold) => {
  try {
    // idk what tier is, seems like its a way for reward cards + gladius cards to get counted tho tbh

    let alpha_bcx = 0;
    let alpha_dec = 0;
    const tier = Number(_tier);
    let xp = _xp - alpha_xp;
    if (xp <= 0) {
      xp = 1;
    }

    let burn_rate = 0;

    if (edition === 4 || tier >= 4) {
      burn_rate = BurnRates.untamed_burn_rate[rarity - 1]; // due to array indexs starting at 0
    } else {
      burn_rate = BurnRates.burn_rate[rarity - 1];
    }

    if (alpha_xp > 0) {
      // aparently needs testing
      let alpha_bcx_xp = XPProperty[gold ? "gold_xp" : "alpha_xp"][rarity - 1];
      alpha_bcx = gold ? alpha_xp / alpha_bcx_xp : alpha_xp / alpha_bcx_xp; // this is the way it is on splinterlands.coim
      alpha_dec = burn_rate * alpha_bcx * AlphaBurnBonus;
      if (gold) {
        alpha_dec = alpha_dec * GoldBurnBonus;
      }
    }

    let xp_property = "";

    if (edition === 0 || (edition == 2 && id < 100)) {
      xp_property = gold ? "gold_xp" : "alpha_xp";
    } else {
      xp_property = gold ? "beta_gold_xp" : "beta_xp";
    }

    const bcx_xp = XPProperty[xp_property][rarity - 1];

    let bcx = Math.max(gold ? xp / bcx_xp : (xp + bcx_xp) / bcx_xp, 1);

    let maxXP;
    // tier 4 is reward cards that are untamed/dice, tier 7 are reward cards that are choas legion
    if (edition === 4 || tier >= 4) {
      bcx = xp;
      let rates = gold
        ? CombinaeRatesGold[rarity - 1]
        : CombineRates[rarity - 1];
      maxXP = rates[rates.length - 1];
    } else {
      maxXP = XPLevels[rarity - 1][XPLevels[rarity - 1].length - 1];
    }
    if (alpha_xp > 0) {
      bcx = bcx - 1;
    }

    let dec = burn_rate * bcx;
    if (gold) {
      let goldBurnRateBonus;
      // if reward cards are choas legion reward cards
      if (tier >= 7) {
        goldBurnRateBonus = GoldBurnBonus2;
      } else {
        goldBurnRateBonus = GoldBurnBonus;
      }
      dec = dec * goldBurnRateBonus;
    }

    if (edition === 0) {
      dec = dec * AlphaBurnBonus;
    }

    if (edition === 2) {
      dec = dec * PromoBurnBonus;
    }

    let total_dec = dec + alpha_dec;

    if (xp >= maxXP) {
      total_dec = total_dec * maxBurnBonus;
    }

    if (tier >= 7) {
      total_dec = total_dec / 2;
    }

    return total_dec;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  findCardPower,
};
