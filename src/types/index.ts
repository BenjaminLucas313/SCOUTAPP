// ─── Player ──────────────────────────────────────────────────────────────────

export type Position =
  | 'GK'
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'SS' | 'ST' | 'CF';

export type Foot = 'right' | 'left' | 'both';

/**
 * Atributos numéricos del jugador (0–100).
 * Diseñados como jsonb en Postgres para permitir ranking configurable
 * sin alterar el schema.
 */
export interface PlayerAttributes {
  pace:       number;
  shooting:   number;
  passing:    number;
  dribbling:  number;
  defending:  number;
  physical:   number;
  // Atributos extendidos opcionales
  aerial?:    number;
  vision?:    number;
  positioning?: number;
  workrate?:  number;
}

export type AttributeKey = keyof PlayerAttributes;

export interface Player {
  id:                   string;
  name:                 string;
  birth_date:           string | null;   // ISO date
  nationality:          string | null;
  position:             Position;
  secondary_positions:  Position[];
  foot:                 Foot | null;
  height_cm:            number | null;
  weight_kg:            number | null;
  club_id:              string | null;
  market_value:         number | null;   // en miles de EUR
  contract_until:       string | null;   // ISO date
  photo_url:            string | null;
  attributes:           PlayerAttributes | null;
  created_at:           string;
  updated_at:           string;
  // Joins opcionales (cuando se hace select con club)
  club?:                Club;
}

export type PlayerInsert = Omit<Player, 'id' | 'created_at' | 'updated_at' | 'club'>;
export type PlayerUpdate = Partial<PlayerInsert>;

// ─── League ──────────────────────────────────────────────────────────────────

export interface League {
  id:         string;
  name:       string;
  country:    string;
  level:      number;  // 1 = primera división
  logo_url:   string | null;
  created_at: string;
}

export type LeagueInsert = Omit<League, 'id' | 'created_at'>;
export type LeagueUpdate = Partial<LeagueInsert>;

// ─── Club ─────────────────────────────────────────────────────────────────────

export interface Club {
  id:         string;
  name:       string;
  league_id:  string | null;
  country:    string;
  logo_url:   string | null;
  created_at: string;
  // Joins opcionales
  league?:    League;
}

export type ClubInsert = Omit<Club, 'id' | 'created_at' | 'league'>;
export type ClubUpdate = Partial<ClubInsert>;

// ─── Scout note ──────────────────────────────────────────────────────────────

export interface ScoutNote {
  id:          string;
  player_id:   string;
  scout_id:    string;
  content:     string;
  rating:      number | null;  // 1–10
  observed_at: string | null;  // ISO date
  created_at:  string;
}

export type ScoutNoteInsert = Omit<ScoutNote, 'id' | 'created_at'>;
export type ScoutNoteUpdate = Partial<ScoutNoteInsert>;

// ─── Shortlist ────────────────────────────────────────────────────────────────

export interface Shortlist {
  id:          string;
  scout_id:    string;
  name:        string;
  description: string | null;
  created_at:  string;
  // Virtual: se carga aparte
  players?:    ShortlistPlayer[];
}

export interface ShortlistPlayer {
  shortlist_id:       string;
  player_id:          string;
  added_at:           string;
  position_override:  string | null;
  // Join
  player?:            Player;
}

export type ShortlistInsert = Omit<Shortlist, 'id' | 'created_at' | 'players'>;
export type ShortlistUpdate = Partial<ShortlistInsert>;

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface PlayerFilters {
  search?:        string;
  positions?:     Position[];
  club_ids?:      string[];
  league_ids?:    string[];
  nationalities?: string[];
  foot?:          Foot;
  age_min?:       number;
  age_max?:       number;
  height_min?:    number;
  height_max?:    number;
  market_value_max?: number;
}

// ─── Ranking config ───────────────────────────────────────────────────────────

export interface RankingWeight {
  attribute: AttributeKey;
  weight:    number;  // 0–100 (porcentaje de importancia)
}

export interface RankingConfig {
  id:      string;
  name:    string;
  weights: RankingWeight[];
}
