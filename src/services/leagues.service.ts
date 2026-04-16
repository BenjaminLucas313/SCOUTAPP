import { supabase } from '../lib/supabase';
import type { League, LeagueInsert, LeagueUpdate } from '../types';

const TABLE = 'leagues';

export async function getLeagues(): Promise<League[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('country')
    .order('level');

  if (error) throw error;
  return (data ?? []) as League[];
}

export async function getLeagueById(id: string): Promise<League | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as League;
}

export async function createLeague(input: LeagueInsert): Promise<League> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as League;
}

export async function updateLeague(id: string, input: LeagueUpdate): Promise<League> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as League;
}

export async function deleteLeague(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
