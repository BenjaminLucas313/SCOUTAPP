import { supabase } from '../lib/supabase';
import type { Player, PlayerInsert, PlayerUpdate, PlayerFilters } from '../types';

const TABLE = 'players';

/**
 * Obtiene todos los jugadores con join a club (y club→league).
 * Filtrado en servidor cuando es posible; el resto se hace client-side
 * con filterPlayers() del dominio.
 */
export async function getPlayers(filters?: PlayerFilters): Promise<Player[]> {
  let query = supabase
    .from(TABLE)
    .select(`
      *,
      club:clubs (
        id, name, country, logo_url, league_id,
        league:leagues ( id, name, country, level )
      )
    `)
    .order('name');

  // Filtros que Supabase puede resolver en servidor
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters?.club_ids?.length) {
    query = query.in('club_id', filters.club_ids);
  }
  if (filters?.positions?.length) {
    query = query.in('position', filters.positions);
  }
  if (filters?.foot) {
    query = query.eq('foot', filters.foot);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Player[];
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      club:clubs (
        id, name, country, logo_url, league_id,
        league:leagues ( id, name, country, level )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as Player;
}

export async function createPlayer(input: PlayerInsert): Promise<Player> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Player;
}

export async function updatePlayer(id: string, input: PlayerUpdate): Promise<Player> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Player;
}

export async function deletePlayer(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
