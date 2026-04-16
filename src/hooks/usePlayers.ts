import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from '../services/players.service';
import type { PlayerFilters, PlayerInsert, PlayerUpdate } from '../types';

// ─── Queries ─────────────────────────────────────────────────────────────────

export function usePlayers(filters?: PlayerFilters) {
  return useQuery({
    queryKey: queryKeys.players.list(filters),
    queryFn:  () => getPlayers(filters),
  });
}

export function usePlayer(id: string | null) {
  return useQuery({
    queryKey: queryKeys.players.detail(id ?? ''),
    queryFn:  () => getPlayerById(id!),
    enabled:  !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreatePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PlayerInsert) => createPlayer(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.players.all });
    },
  });
}

export function useUpdatePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PlayerUpdate }) =>
      updatePlayer(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.players.all });
      qc.invalidateQueries({ queryKey: queryKeys.players.detail(id) });
    },
  });
}

export function useDeletePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlayer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.players.all });
    },
  });
}
