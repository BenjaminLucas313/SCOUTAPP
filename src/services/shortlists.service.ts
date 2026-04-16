import { supabase } from '../lib/supabase';
import type { Shortlist, ShortlistInsert, ShortlistUpdate, ShortlistPlayer } from '../types';


const TABLE = 'shortlists';
const PIVOT = 'shortlist_players';

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error('Usuario no autenticado');

  return data.user.id;
}

async function assertShortlistOwnership(shortlistId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .select('id')
    .eq('id', shortlistId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Shortlist no encontrada o sin permisos');
  }
}


export async function getShortlists(): Promise<Shortlist[]> {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user?.id) // 👈 CLAVE
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Shortlist[];
}

export async function getShortlistWithPlayers(id: string): Promise<Shortlist | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      players:shortlist_players (
        shortlist_id, player_id, added_at, position_override,
        player:players (
          *,
          club:clubs ( id, name, logo_url )
        )
      )
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as Shortlist;
}

export async function createShortlist(input: ShortlistInsert): Promise<Shortlist> {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...input,
      user_id: user?.id, // 👈 CLAVE
    })
    .select()
    .single();

  if (error) throw error;
  return data as Shortlist;
}

export async function updateShortlist(id: string, input: ShortlistUpdate): Promise<Shortlist> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Shortlist;
}

export async function deleteShortlist(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function addPlayerToShortlist(
  shortlistId: string,
  playerId: string,
): Promise<ShortlistPlayer> {
  await assertShortlistOwnership(shortlistId);

  const { data, error } = await supabase
    .from(PIVOT)
    .upsert(
      { shortlist_id: shortlistId, player_id: playerId },
      { onConflict: 'shortlist_id,player_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as ShortlistPlayer;
}

export async function removePlayerFromShortlist(
  shortlistId: string,
  playerId: string,
): Promise<void> {
  await assertShortlistOwnership(shortlistId);

  const { error } = await supabase
    .from(PIVOT)
    .delete()
    .eq('shortlist_id', shortlistId)
    .eq('player_id', playerId);

  if (error) throw error;
}
