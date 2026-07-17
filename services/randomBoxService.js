'use strict';

/**
 * randomBoxService.js
 *
 * Handles the RANDOM BOX OPENING game mode.
 *
 * Mode:  random_single  — exactly ONE box opens, chosen by the server.
 * Bias:
 *   normal         — truly random from all boxes (prize 1..N equally likely)
 *   unlucky_bias   — heavily weighted toward unlucky (NORMAL / COMMON) prizes
 *   always_unlucky — the unlucky box is ALWAYS opened (100% guaranteed loss)
 *
 * Rule invariant: at least one box in every session MUST be labelled UNLUCKY /
 * have prize_N_status = 'NORMAL'.  The controller enforces this at creation.
 */

const crypto = require('crypto');

/**
 * Cryptographically fair random integer in [0, max).
 */
function secureRandInt(max) {
  if (max <= 1) return 0;
  const bytes = crypto.randomBytes(4);
  return bytes.readUInt32BE(0) % max;
}

/**
 * Parse prize statuses for a session into an array indexed 1…boxCount.
 *
 * @param {object} session   - GameSession plain object
 * @param {number} boxCount
 * @returns {Array<{index: number, status: string, rarity: string}>}
 */
function getPrizeSlots(session, boxCount) {
  const slots = [];
  for (let i = 1; i <= boxCount; i++) {
    slots.push({
      index: i,
      status: (session[`prize_${i}_status`] || 'NORMAL').toUpperCase(),
      rarity: (session[`prize_${i}_rarity`] || 'common').toLowerCase()
    });
  }
  return slots;
}

/**
 * Select the winning box using the requested bias mode.
 *
 * @param {object} session    - GameSession plain object
 * @param {'normal'|'unlucky_bias'|'always_unlucky'} bias
 * @param {number} boxCount
 * @returns {number}          - 1-indexed winning box number
 */
function selectRandomBox(session, bias, boxCount) {
  const slots = getPrizeSlots(session, boxCount);

  if (bias === 'always_unlucky') {
    // Guaranteed: pick from UNLUCKY / NORMAL status boxes only
    const unlucky = slots.filter((s) => s.status === 'NORMAL');
    if (unlucky.length === 0) {
      // Fallback: all prizes are special — pick lowest rarity
      const byRarity = [...slots].sort((a, b) => rarityWeight(a.rarity) - rarityWeight(b.rarity));
      return byRarity[0].index;
    }
    return unlucky[secureRandInt(unlucky.length)].index;
  }

  if (bias === 'unlucky_bias') {
    // Build a weighted list: NORMAL prizes get 5× weight; SPECIAL/RARE get 1×
    const weighted = [];
    for (const s of slots) {
      const weight = s.status === 'NORMAL' ? 5 : 1;
      for (let w = 0; w < weight; w++) weighted.push(s.index);
    }
    return weighted[secureRandInt(weighted.length)];
  }

  // Default: normal — uniform random across all boxes
  return slots[secureRandInt(slots.length)].index;
}

function rarityWeight(rarity) {
  const order = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  return order[rarity] ?? 0;
}

/**
 * Validate that a session being created in random_single mode has at least
 * one UNLUCKY box (needed to satisfy the always_unlucky mode requirement).
 *
 * @param {Array<{status:string}>} prizes
 * @returns {boolean}
 */
function hasAtLeastOneUnluckyPrize(prizes) {
  return prizes.some((p) => {
    const status = String(p.status || 'NORMAL').toUpperCase();
    return status === 'NORMAL' || status === 'UNLUCKY';
  });
}

/**
 * Given the selected box, return prize details for the SSE broadcast.
 *
 * @param {object} session   - GameSession plain object
 * @param {number} boxNum    - 1-indexed box number
 * @returns {object}
 */
function buildOpenedBoxResult(session, boxNum) {
  return {
    openedBox: boxNum,
    prize: session[`prize_${boxNum}`] || null,
    prizeDescription: session[`prize_${boxNum}_description`] || null,
    prizeIcon: session[`prize_${boxNum}_icon`] || '🎁',
    prizeStatus: session[`prize_${boxNum}_status`] || 'NORMAL',
    prizeRarity: session[`prize_${boxNum}_rarity`] || 'common',
    prizeCash: session[`prize_${boxNum}_cash`] || false,
    prizeCashAmount: session[`prize_${boxNum}_cash_amount`] || 0,
    prizeImageUrl: session[`prize_${boxNum}_image_url`] || null,
    prizeColorHex: session[`prize_${boxNum}_color_hex`] || null
  };
}

module.exports = { selectRandomBox, hasAtLeastOneUnluckyPrize, buildOpenedBoxResult };
