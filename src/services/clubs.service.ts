import { supabase } from '../lib/supabase';
import type { Club, ClubInsert, ClubUpdate } from '../types';

const TABLE = 'clubs';

export async function getClubs(leagueId?: string): Promise<Club[]> {
  let query = supabase
    .from(TABLE)
    .select('*, league:leagues(id, name, country, level)')
    .order('name');

  if (leagueId) {
    query = query.eq('league_id', leagueId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Club[];
}

export async function getClubById(id: string): Promise<Club | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, league:leagues(id, name, country, level)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Club;
}

export async function createClub(input: ClubInsert): Promise<Club> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Club;
}

export async function updateClub(id: string, input: ClubUpdate): Promise<Club> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Club;
}

export async function deleteClub(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
