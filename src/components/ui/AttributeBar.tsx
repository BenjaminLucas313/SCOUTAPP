import React from 'react';
import { View, Text } from 'react-native';
import type { AttributeKey } from '../../types';

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  pace:        'PAC',
  shooting:    'TIR',
  passing:     'PAS',
  dribbling:   'DRI',
  defending:   'DEF',
  physical:    'FÍS',
  aerial:      'AÉR',
  vision:      'VIS',
  positioning: 'POS',
  workrate:    'MOT',
};

function valueToColor(value: number): string {
  if (value >= 80) return 'bg-green-500';
  if (value >= 65) return 'bg-yellow-400';
  if (value >= 50) return 'bg-orange-400';
  return 'bg-red-500';
}

function valueToTextColor(value: number): string {
  if (value >= 80) return 'text-green-400';
  if (value >= 65) return 'text-yellow-400';
  if (value >= 50) return 'text-orange-400';
  return 'text-red-400';
}

interface AttributeBarProps {
  attribute: AttributeKey;
  value:     number;
  showLabel?: boolean;
  compact?:  boolean;
}

export function AttributeBar({
  attribute,
  value,
  showLabel = true,
  compact = false,
}: AttributeBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <View className={`${compact ? 'gap-0.5' : 'gap-1'}`}>
      {showLabel && (
        <View className="flex-row justify-between items-center">
          <Text className="text-xs font-medium text-gray-400">
            {ATTRIBUTE_LABELS[attribute]}
          </Text>
          <Text className={`text-xs font-bold ${valueToTextColor(pct)}`}>
            {pct}
          </Text>
        </View>
      )}
      <View className={`w-full ${compact ? 'h-1' : 'h-1.5'} bg-white/5 rounded-full overflow-hidden`}>
        <View
          className={`h-full rounded-full ${valueToColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}

// ─── AttributeHexagon — radar simplificado como lista de barras ───────────────

interface AttributeGridProps {
  attributes: Partial<Record<AttributeKey, number>>;
  compact?:  boolean;
}

const MAIN_ATTRIBUTES: AttributeKey[] = [
  'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical',
];

export function AttributeGrid({ attributes, compact = false }: AttributeGridProps) {
  return (
    <View className="gap-2">
      {MAIN_ATTRIBUTES.map((key) => {
        const val = attributes[key];
        if (val === undefined) return null;
        return (
          <AttributeBar
            key={key}
            attribute={key}
            value={val}
            compact={compact}
          />
        );
      })}
    </View>
  );
}
