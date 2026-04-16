import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import {
  getLeagues, createLeague, updateLeague, deleteLeague,
} from '../services/leagues.service';
import {
  getClubs, createClub, updateClub, deleteClub,
} from '../services/clubs.service';
import {
  getNotesByPlayer, createNote, updateNote, deleteNote,
} from '../services/notes.service';
import {
  getShortlists, getShortlistWithPlayers, createShortlist,
  updateShortlist, deleteShortlist,
  addPlayerToShortlist, removePlayerFromShortlist,
} from '../services/shortlists.service';
import type {
  LeagueInsert, LeagueUpdate,
  ClubInsert, ClubUpdate,
  ScoutNoteInsert, ScoutNoteUpdate,
  ShortlistInsert, ShortlistUpdate,
} from '../types';

// ─── Leagues ─────────────────────────────────────────────────────────────────

export function useLeagues() {
  return useQuery({
    queryKey: queryKeys.leagues.lists(),
    queryFn:  getLeagues,
  });
}

export function useCreateLeague() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LeagueInsert) => createLeague(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.leagues.all }),
  });
}

export function useUpdateLeague() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: LeagueUpdate }) =>
      updateLeague(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.leagues.all }),
  });
}

export function useDeleteLeague() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLeague(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.leagues.all }),
  });
}

// ─── Clubs ───────────────────────────────────────────────────────────────────

export function useClubs(leagueId?: string) {
  return useQuery({
    queryKey: queryKeys.clubs.list(leagueId),
    queryFn:  () => getClubs(leagueId),
  });
}

export function useCreateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ClubInsert) => createClub(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clubs.all }),
  });
}

export function useUpdateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClubUpdate }) =>
      updateClub(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clubs.all }),
  });
}

export function useDeleteClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClub(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clubs.all }),
  });
}

// ─── Scout notes ─────────────────────────────────────────────────────────────

export function usePlayerNotes(playerId: string) {
  return useQuery({
    queryKey: queryKeys.notes.byPlayer(playerId),
    queryFn:  () => getNotesByPlayer(playerId),
    enabled:  !!playerId,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ScoutNoteInsert) => createNote(input),
    onSuccess: (_data, input) => {
      qc.invalidateQueries({ queryKey: queryKeys.notes.byPlayer(input.player_id) });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ScoutNoteUpdate }) =>
      updateNote(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notes.all }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notes.all }),
  });
}

// ─── Shortlists ───────────────────────────────────────────────────────────────

export function useShortlists(scoutId?: string) {
  return useQuery({
    queryKey: queryKeys.shortlists.lists(),
    queryFn: () => getShortlists(scoutId),
  });
}

export function useShortlistDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.shortlists.detail(id ?? ''),
    queryFn:  () => getShortlistWithPlayers(id!),
    enabled:  !!id,
  });
}

export function useCreateShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ShortlistInsert) => createShortlist(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.shortlists.all }),
  });
}

export function useUpdateShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ShortlistUpdate }) =>
      updateShortlist(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.shortlists.all }),
  });
}

export function useDeleteShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShortlist(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.shortlists.all }),
  });
}

export function useAddToShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shortlistId, playerId }: { shortlistId: string; playerId: string }) =>
      addPlayerToShortlist(shortlistId, playerId),
    onSuccess: (_data, { shortlistId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.shortlists.detail(shortlistId) });
    },
  });
}

export function useRemoveFromShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shortlistId, playerId }: { shortlistId: string; playerId: string }) =>
      removePlayerFromShortlist(shortlistId, playerId),
    onSuccess: (_data, { shortlistId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.shortlists.detail(shortlistId) });
    },
  });
}

