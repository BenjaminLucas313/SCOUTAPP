import { differenceInYears, parseISO } from 'date-fns';
import type { Player, PlayerFilters } from '../types';

/**
 * Aplica filtros a una lista de jugadores.
 * Lógica pura: sin side effects.
 */
export function filterPlayers(players: Player[], filters: PlayerFilters): Player[] {
  return players.filter((p) => matchesFilters(p, filters));
}

function matchesFilters(player: Player, filters: PlayerFilters): boolean {
  // Búsqueda por nombre
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!player.name.toLowerCase().includes(q)) return false;
  }

  // Posición
  if (filters.positions?.length) {
    const allPositions = [player.position, ...player.secondary_positions];
    if (!filters.positions.some((pos) => allPositions.includes(pos))) return false;
  }

  // Club
  if (filters.club_ids?.length) {
    if (!player.club_id || !filters.club_ids.includes(player.club_id)) return false;
  }

  // Liga (requiere join club.league_id)
  if (filters.league_ids?.length) {
    if (!player.club?.league_id || !filters.league_ids.includes(player.club.league_id)) return false;
  }

  // Nacionalidad
  if (filters.nationalities?.length) {
    if (!player.nationality || !filters.nationalities.includes(player.nationality)) return false;
  }

  // Pie
  if (filters.foot) {
    if (player.foot !== filters.foot) return false;
  }

  // Edad
  if (filters.age_min !== undefined || filters.age_max !== undefined) {
    if (!player.birth_date) return false;
    const age = differenceInYears(new Date(), parseISO(player.birth_date));
    if (filters.age_min !== undefined && age < filters.age_min) return false;
    if (filters.age_max !== undefined && age > filters.age_max) return false;
  }

  // Altura
  if (filters.height_min !== undefined && (player.height_cm ?? 0) < filters.height_min) return false;
  if (filters.height_max !== undefined && (player.height_cm ?? 999) > filters.height_max) return false;

  // Valor de mercado
  if (filters.market_value_max !== undefined) {
    if ((player.market_value ?? Infinity) > filters.market_value_max) return false;
  }

  return true;
}

/**
 * Cuenta cuántos filtros activos tiene una configuración de filtros.
 * Útil para mostrar badges en la UI.
 */
export function countActiveFilters(filters: PlayerFilters): number {
  let count = 0;
  if (filters.search)               count++;
  if (filters.positions?.length)    count++;
  if (filters.club_ids?.length)     count++;
  if (filters.league_ids?.length)   count++;
  if (filters.nationalities?.length) count++;
  if (filters.foot)                 count++;
  if (filters.age_min !== undefined || filters.age_max !== undefined) count++;
  if (filters.height_min !== undefined || filters.height_max !== undefined) count++;
  if (filters.market_value_max !== undefined) count++;
  return count;
}
