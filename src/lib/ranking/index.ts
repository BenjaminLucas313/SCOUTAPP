import type { Player, RankingConfig, RankingWeight, AttributeKey } from '../types';

/**
 * Calcula el score de ranking para un jugador dado una config.
 * Retorna valor 0–100.
 * Lógica pura: sin efectos secundarios, testeable sin mocks.
 */
export function scorePlayer(player: Player, config: RankingConfig): number {
  if (!player.attributes || config.weights.length === 0) return 0;

  const totalWeight = config.weights.reduce((sum, w) => sum + w.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = config.weights.reduce((sum, w) => {
    const value = player.attributes![w.attribute] ?? 0;
    return sum + value * w.weight;
  }, 0);

  return Math.round(weightedSum / totalWeight);
}

/**
 * Ordena una lista de jugadores aplicando la config de ranking.
 * Devuelve nueva lista (inmutable).
 */
export function rankPlayers(
  players: Player[],
  config: RankingConfig
): Array<Player & { rankScore: number }> {
  return players
    .map((p) => ({ ...p, rankScore: scorePlayer(p, config) }))
    .sort((a, b) => b.rankScore - a.rankScore);
}

/**
 * Config de ranking por defecto — pesos iguales para todos los atributos.
 */
export const DEFAULT_RANKING_CONFIG: RankingConfig = {
  id:   'default',
  name: 'Overall',
  weights: [
    { attribute: 'pace',      weight: 17 },
    { attribute: 'shooting',  weight: 17 },
    { attribute: 'passing',   weight: 17 },
    { attribute: 'dribbling', weight: 16 },
    { attribute: 'defending', weight: 17 },
    { attribute: 'physical',  weight: 16 },
  ],
};

/**
 * Configs predefinidas por posición.
 * Permiten que el scout seleccione un preset o cree el suyo.
 */
export const PRESET_RANKING_CONFIGS: RankingConfig[] = [
  DEFAULT_RANKING_CONFIG,
  {
    id:   'striker',
    name: 'Delantero',
    weights: [
      { attribute: 'pace',      weight: 20 },
      { attribute: 'shooting',  weight: 35 },
      { attribute: 'passing',   weight: 10 },
      { attribute: 'dribbling', weight: 20 },
      { attribute: 'defending', weight:  5 },
      { attribute: 'physical',  weight: 10 },
    ],
  },
  {
    id:   'midfielder',
    name: 'Mediocampista',
    weights: [
      { attribute: 'pace',      weight: 10 },
      { attribute: 'shooting',  weight: 15 },
      { attribute: 'passing',   weight: 35 },
      { attribute: 'dribbling', weight: 20 },
      { attribute: 'defending', weight: 10 },
      { attribute: 'physical',  weight: 10 },
    ],
  },
  {
    id:   'defender',
    name: 'Defensor',
    weights: [
      { attribute: 'pace',      weight: 15 },
      { attribute: 'shooting',  weight:  5 },
      { attribute: 'passing',   weight: 15 },
      { attribute: 'dribbling', weight: 10 },
      { attribute: 'defending', weight: 40 },
      { attribute: 'physical',  weight: 15 },
    ],
  },
];
