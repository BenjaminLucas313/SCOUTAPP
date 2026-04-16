import type { Player, AttributeKey, PlayerAttributes } from '../types';

export interface AttributeComparison {
  attribute:  AttributeKey;
  playerA:    number;
  playerB:    number;
  winner:     'A' | 'B' | 'tie';
  delta:      number;  // playerA - playerB
}

export interface PlayerComparison {
  playerA:    Player;
  playerB:    Player;
  attributes: AttributeComparison[];
  overallA:   number;
  overallB:   number;
  winner:     'A' | 'B' | 'tie';
}

const ATTRIBUTE_KEYS: AttributeKey[] = [
  'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical',
];

/**
 * Compara dos jugadores atributo por atributo.
 * No toca React ni Supabase — testeable.
 */
export function comparePlayers(
  playerA: Player,
  playerB: Player,
  attributeKeys: AttributeKey[] = ATTRIBUTE_KEYS,
): PlayerComparison {
  const attributes: AttributeComparison[] = attributeKeys.map((attribute) => {
    const a = playerA.attributes?.[attribute] ?? 0;
    const b = playerB.attributes?.[attribute] ?? 0;
    const delta = a - b;
    return {
      attribute,
      playerA: a,
      playerB: b,
      delta,
      winner: delta > 0 ? 'A' : delta < 0 ? 'B' : 'tie',
    };
  });

  const overallA = average(attributes.map((c) => c.playerA));
  const overallB = average(attributes.map((c) => c.playerB));

  return {
    playerA,
    playerB,
    attributes,
    overallA,
    overallB,
    winner: overallA > overallB ? 'A' : overallA < overallB ? 'B' : 'tie',
  };
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}
