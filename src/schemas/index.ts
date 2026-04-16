import { z } from 'zod';

// ─── Player schema ────────────────────────────────────────────────────────────

export const playerAttributesSchema = z.object({
  pace:       z.number().min(0).max(100),
  shooting:   z.number().min(0).max(100),
  passing:    z.number().min(0).max(100),
  dribbling:  z.number().min(0).max(100),
  defending:  z.number().min(0).max(100),
  physical:   z.number().min(0).max(100),
  aerial:     z.number().min(0).max(100).optional(),
  vision:     z.number().min(0).max(100).optional(),
  positioning: z.number().min(0).max(100).optional(),
  workrate:   z.number().min(0).max(100).optional(),
});

export const playerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
    .nullable()
    .optional(),
  nationality:   z.string().max(60).nullable().optional(),
  position: z.enum([
    'GK','CB','LB','RB','LWB','RWB',
    'CDM','CM','CAM','LM','RM',
    'LW','RW','SS','ST','CF',
  ]),
  secondary_positions: z.array(z.string()).optional().default([]),
  foot: z.enum(['right', 'left', 'both']).nullable().optional(),
  height_cm:     z.number().min(140).max(220).nullable().optional(),
  weight_kg:     z.number().min(40).max(130).nullable().optional(),
  club_id:       z.string().uuid().nullable().optional(),
  market_value:  z.number().min(0).nullable().optional(),
  contract_until: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
    .nullable()
    .optional(),
  photo_url:   z.string().url().nullable().optional(),
  attributes:  playerAttributesSchema.nullable().optional(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;

// ─── League schema ────────────────────────────────────────────────────────────

export const leagueFormSchema = z.object({
  name:     z.string().min(2).max(100),
  country:  z.string().min(2).max(60),
  level:    z.number().int().min(1).max(10),
  logo_url: z.string().url().nullable().optional(),
});

export type LeagueFormValues = z.infer<typeof leagueFormSchema>;

// ─── Club schema ──────────────────────────────────────────────────────────────

export const clubFormSchema = z.object({
  name:      z.string().min(2).max(100),
  country:   z.string().min(2).max(60),
  league_id: z.string().uuid().nullable().optional(),
  logo_url:  z.string().url().nullable().optional(),
});

export type ClubFormValues = z.infer<typeof clubFormSchema>;

// ─── Scout note schema ────────────────────────────────────────────────────────

export const noteFormSchema = z.object({
  content:     z.string().min(1, 'Escribe algo antes de guardar').max(2000),
  rating:      z.number().int().min(1).max(10).nullable().optional(),
  observed_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
    .nullable()
    .optional(),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

// ─── Shortlist schema ─────────────────────────────────────────────────────────

export const shortlistFormSchema = z.object({
  name:        z.string().min(2).max(100),
  description: z.string().max(300).nullable().optional(),
});

export type ShortlistFormValues = z.infer<typeof shortlistFormSchema>;
