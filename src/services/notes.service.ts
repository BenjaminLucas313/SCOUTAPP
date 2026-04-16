import { supabase } from '../lib/supabase';
import type { ScoutNote, ScoutNoteUpdate } from '../types';

const TABLE = 'scout_notes';

type CreateNoteInput = {
  player_id: string;
  content: string;
  rating?: number;
  observed_at?: string;
};

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error('Usuario no autenticado');

  return data.user.id;
}

export async function getNotesByPlayer(playerId: string): Promise<ScoutNote[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('player_id', playerId)
    .eq('user_id', userId)
    .order('observed_at', { ascending: false });

  if (error) {
  console.log('getNotesByPlayer error:', error);
  throw error;
}
  return (data ?? []) as ScoutNote[];
}

export async function createNote(input: CreateNoteInput): Promise<ScoutNote> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...input,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
  console.log('createNote error:', error);
  throw error;
};
  return data as ScoutNote;
}

export async function updateNote(id: string, input: ScoutNoteUpdate): Promise<ScoutNote> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as ScoutNote;
}

export async function deleteNote(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}