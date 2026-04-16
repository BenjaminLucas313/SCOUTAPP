/**
 * Query keys centralizadas.
 * Usar siempre estas constantes para invalidar queries de forma precisa.
 *
 * Patrón: queryKeys.entity.all | .detail(id) | .list(filters)
 */

import type { PlayerFilters } from '../types';

export const queryKeys = {
  players: {
    all:    ['players'] as const,
    lists:  () => [...queryKeys.players.all, 'list'] as const,
    list:   (filters?: PlayerFilters) => [...queryKeys.players.lists(), { filters }] as const,
    detail: (id: string) => [...queryKeys.players.all, 'detail', id] as const,
  },

  leagues: {
    all:    ['leagues'] as const,
    lists:  () => [...queryKeys.leagues.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.leagues.all, 'detail', id] as const,
  },

  clubs: {
    all:    ['clubs'] as const,
    lists:  () => [...queryKeys.clubs.all, 'list'] as const,
    list:   (leagueId?: string) => [...queryKeys.clubs.lists(), { leagueId }] as const,
    detail: (id: string) => [...queryKeys.clubs.all, 'detail', id] as const,
  },

  notes: {
    all:       ['notes'] as const,
    byPlayer:  (playerId: string) => [...queryKeys.notes.all, 'player', playerId] as const,
  },

  shortlists: {
    all:    ['shortlists'] as const,
    lists:  () => [...queryKeys.shortlists.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.shortlists.all, 'detail', id] as const,
  },
} as const;
