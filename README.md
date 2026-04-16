# Scout App

App multiplataforma para scouts de fútbol. Web + iOS + Android desde el día uno.
Desktop (Tauri 2) preparado en arquitectura, no implementado aún.

---

## Stack

| Capa            | Tecnología                              |
|-----------------|-----------------------------------------|
| Framework       | Expo SDK 52 + Expo Router 4             |
| Lenguaje        | TypeScript (strict)                     |
| UI              | React Native + NativeWind (Tailwind)    |
| Estado servidor | TanStack Query v5                       |
| Formularios     | React Hook Form + Zod                   |
| Backend         | Supabase (Postgres + Auth + Storage)    |
| Desktop futuro  | Tauri 2 (arquitectura lista, sin código)|

---

## Estructura

```
scout-app/
├── app/                        # Expo Router — rutas = archivos
│   ├── _layout.tsx             # Root layout: providers (Query, SafeArea, Gesture)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab navigator
│   │   ├── index.tsx           # Lista de jugadores + búsqueda + ranking
│   │   ├── shortlists.tsx      # Shortlists del scout
│   │   └── leagues.tsx         # Ligas y clubes
│   └── player/
│       ├── new.tsx             # Alta de jugador (modal)
│       ├── [id].tsx            # Detalle del jugador
│       └── [id]/edit.tsx       # Edición (modal)
│
├── src/
│   ├── types/index.ts          # Tipos del dominio (Player, Club, League, etc.)
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase (singleton)
│   │   ├── ranking/            # Lógica de ranking — pura, sin deps de UI
│   │   ├── filters/            # Lógica de filtros — pura
│   │   └── comparator/         # Comparación jugador vs jugador — pura
│   ├── services/               # Acceso a datos (Supabase queries)
│   │   ├── players.service.ts
│   │   ├── leagues.service.ts
│   │   ├── clubs.service.ts
│   │   ├── notes.service.ts
│   │   └── shortlists.service.ts
│   ├── hooks/                  # TanStack Query hooks
│   │   ├── queryKeys.ts        # Keys centralizadas
│   │   ├── usePlayers.ts
│   │   └── useEntities.ts      # Leagues, clubs, notes, shortlists
│   ├── schemas/index.ts        # Zod schemas para formularios
│   ├── components/
│   │   ├── ui/                 # Primitivos: Text, Card, Button, Badge, etc.
│   │   │   ├── index.tsx
│   │   │   └── AttributeBar.tsx
│   │   └── players/
│   │       └── PlayerCard.tsx
│   └── global.css              # Tailwind entry (NativeWind)
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

### Principio de capas

```
Screens (app/)
    ↓ usa
Hooks (src/hooks/) — TanStack Query
    ↓ llama
Services (src/services/) — Supabase
    ↓ tipos de
Domain (src/types/, src/lib/) — lógica pura TS
```

La lógica de dominio (`ranking`, `filters`, `comparator`) no importa nada de React ni Supabase.
Es testeable con `vitest` sin mocks.

---

## Setup

### 1. Clonar y instalar

```bash
git clone <repo>
cd scout-app
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completar con los valores de tu proyecto en [supabase.com](https://supabase.com):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Base de datos

En el SQL Editor de Supabase, ejecutar:

```
supabase/migrations/001_initial_schema.sql
```

O si tenés la CLI instalada:

```bash
supabase db push
```

### 4. Correr

```bash
# Web (browser)
npm run web

# iOS simulator
npm run ios

# Android emulator
npm run android

# Expo Go (escanear QR)
npm start
```

---

## Funcionalidades MVP

| Feature                    | Estado  |
|----------------------------|---------|
| Lista de jugadores         | ✅       |
| Búsqueda por nombre        | ✅       |
| Alta de jugador            | ✅       |
| Edición de jugador         | ✅       |
| Eliminación de jugador     | ✅       |
| Atributos + barras visual  | ✅       |
| Ranking configurable       | ✅       |
| Filtros (dominio)          | ✅ lógica / 🔲 UI modal |
| Notas del scout            | ✅ lectura / 🔲 UI modal nueva nota |
| Shortlists                 | ✅ listado / 🔲 UI crear + agregar |
| Comparación de jugadores   | 🔲       |
| Auth (Supabase Auth)       | 🔲       |
| Upload de fotos (Storage)  | 🔲       |

---

## Roadmap de próximas iteraciones

### Iteración 2
- Modal de filtros avanzados (posición, edad, liga, pie)
- Modal de nueva nota del scout con rating
- Crear/editar shortlists + agregar jugadores

### Iteración 3
- Pantalla de comparación 1 vs 1
- Ranking customizable desde UI (sliders de pesos)
- Auth con Supabase + RLS policies reales

### Iteración 4
- Upload de foto del jugador (Supabase Storage)
- Exportar shortlist como PDF
- Modo offline básico (TanStack Query persistence)

### Futuro
- Tauri 2 desktop wrapper (la arquitectura web ya lo soporta sin cambios)

---

## Preparación para Tauri 2 (Desktop)

El web build de Expo (`expo export --platform web`) genera HTML/JS/CSS estático.
Tauri 2 puede wrappear ese output directamente.

Cuando llegue el momento, el único archivo nuevo es `src-tauri/tauri.conf.json`
apuntando al directorio `dist/` de Expo. No hay cambios en el código de la app.

```json
{
  "build": {
    "frontendDist": "../dist"
  }
}
```

---

## Decisiones de arquitectura

**¿Por qué `attributes` es jsonb y no columnas separadas?**
Permite al scout agregar atributos personalizados y cambiar los pesos del ranking
sin migraciones. El schema de validación vive en Zod (`playerAttributesSchema`).

**¿Por qué filtros client-side y no 100% server-side?**
Para el MVP (cientos de jugadores, no millones) es más simple y permite combinar
filtros complejos sin escribir SQL dinámico. Los filtros más comunes
(nombre, posición, club) ya se delegan a Supabase. Si la base de datos crece,
migrar a filtros server-side es un cambio en `players.service.ts` sin tocar la UI.

**¿Por qué `queryKeys.ts` centralizado?**
Invalidar queries de forma precisa evita refetches innecesarios. Con las keys
centralizadas, `invalidateQueries({ queryKey: queryKeys.players.all })` invalida
todas las variantes de jugadores de una sola llamada.
