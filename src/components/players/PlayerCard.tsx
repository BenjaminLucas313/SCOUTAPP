import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { Player } from '../../types';
import { Badge } from '../ui';
import { AttributeGrid } from '../ui/AttributeBar';

const POSITION_COLORS: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'purple'> = {
  GK:  'yellow',
  CB:  'blue', LB: 'blue', RB: 'blue', LWB: 'blue', RWB: 'blue',
  CDM: 'green', CM: 'green', CAM: 'green', LM: 'green', RM: 'green',
  LW:  'purple', RW: 'purple', SS: 'red', ST: 'red', CF: 'red',
};

interface PlayerCardProps {
  player:      Player;
  rankScore?:  number;
  onPress:     () => void;
  onLongPress?: () => void;
}

export function PlayerCard({ player, rankScore, onPress, onLongPress }: PlayerCardProps) {
  const posColor = POSITION_COLORS[player.position] ?? 'gray';

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
      className="bg-surface-1 rounded-xl border border-white/5 p-4 active:border-brand-500/30"
    >
      <View className="flex-row gap-3">
        {/* Avatar */}
        <View className="w-14 h-14 rounded-xl bg-surface-2 overflow-hidden items-center justify-center">
          {player.photo_url ? (
            <Image
              source={{ uri: player.photo_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-2xl">👤</Text>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-white font-semibold text-base flex-shrink">
              {player.name}
            </Text>
            {rankScore !== undefined && (
              <View className="bg-brand-500/20 border border-brand-500/30 px-2 py-0.5 rounded-full">
                <Text className="text-brand-100 text-xs font-bold">{rankScore}</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center gap-2 flex-wrap">
            <Badge label={player.position} color={posColor} />
            {player.nationality && (
              <Text className="text-gray-500 text-xs">{player.nationality}</Text>
            )}
            {player.club?.name && (
              <Text className="text-gray-500 text-xs">· {player.club.name}</Text>
            )}
          </View>

          {player.birth_date && (
            <Text className="text-gray-600 text-xs">
              {calculateAge(player.birth_date)} años
            </Text>
          )}
        </View>
      </View>

      {/* Attributes mini-grid */}
      {player.attributes && (
        <View className="mt-3 pt-3 border-t border-white/5">
          <AttributeGrid attributes={player.attributes} compact />
        </View>
      )}
    </TouchableOpacity>
  );
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
