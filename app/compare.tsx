import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, FlatList, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { usePlayers, usePlayer } from '@/src/hooks/usePlayers';
import { comparePlayers } from '@/src/lib/comparator';
import type { AttributeKey } from '@/src/types';

const ATTR_LABELS: Partial<Record<AttributeKey, string>> = {
  pace:        'Velocidad',
  shooting:    'Remate',
  passing:     'Pase',
  dribbling:   'Regate',
  defending:   'Defensa',
  physical:    'Físico',
  aerial:      'Aéreo',
  vision:      'Visión',
  positioning: 'Posicionamiento',
  workrate:    'Trabajo',
};

export default function CompareScreen() {
  const { playerAId } = useLocalSearchParams<{ playerAId?: string }>();
  const { data: playerA } = usePlayer(playerAId ?? null);
  const { data: players = [], isLoading } = usePlayers();
  const [search, setSearch] = useState('');
  const [playerBId, setPlayerBId] = useState<string | null>(null);

  const playerB = useMemo(
    () => players.find((p) => p.id === playerBId) ?? null,
    [players, playerBId],
  );

  const comparison = useMemo(
    () => (playerA && playerB ? comparePlayers(playerA, playerB) : null),
    [playerA, playerB],
  );

  const candidates = useMemo(
    () =>
      players.filter(
        (p) =>
          p.id !== playerAId &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [players, search, playerAId],
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface-0 items-center justify-center">
        <ActivityIndicator color="#3B5BDB" />
      </View>
    );
  }

  if (comparison) {
    return (
      <SafeAreaView className="flex-1 bg-surface-0" edges={['bottom']}>
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabecera con nombres y scores */}
          <View className="flex-row rounded-2xl bg-surface-1 border border-white/5 p-4">
            <View className="flex-1 items-center gap-1">
              <Text className="text-white font-bold text-base text-center" numberOfLines={2}>
                {comparison.playerA.name}
              </Text>
              <Text className="text-gray-400 text-xs">{comparison.playerA.position}</Text>
              <View
                className={`mt-2 px-4 py-1 rounded-full ${
                  comparison.winner === 'A' ? 'bg-green-500/20' : 'bg-surface-2'
                }`}
              >
                <Text
                  className={`text-lg font-bold ${
                    comparison.winner === 'A' ? 'text-green-300' : 'text-gray-400'
                  }`}
                >
                  {comparison.overallA}
                </Text>
              </View>
            </View>

            <View className="items-center justify-center px-4">
              <Text className="text-gray-600 font-bold">VS</Text>
            </View>

            <View className="flex-1 items-center gap-1">
              <Text className="text-white font-bold text-base text-center" numberOfLines={2}>
                {comparison.playerB.name}
              </Text>
              <Text className="text-gray-400 text-xs">{comparison.playerB.position}</Text>
              <View
                className={`mt-2 px-4 py-1 rounded-full ${
                  comparison.winner === 'B' ? 'bg-green-500/20' : 'bg-surface-2'
                }`}
              >
                <Text
                  className={`text-lg font-bold ${
                    comparison.winner === 'B' ? 'text-green-300' : 'text-gray-400'
                  }`}
                >
                  {comparison.overallB}
                </Text>
              </View>
            </View>
          </View>

          {/* Filas de atributos */}
          {comparison.attributes.map(({ attribute, playerA: a, playerB: b, winner }) => (
            <View key={attribute} className="flex-row items-center gap-3">
              <Text
                className={`w-10 text-right text-sm font-bold ${
                  winner === 'A' ? 'text-white' : 'text-gray-600'
                }`}
              >
                {a}
              </Text>

              <View className="flex-1 items-center gap-1">
                <Text className="text-gray-500 text-xs">
                  {ATTR_LABELS[attribute] ?? attribute}
                </Text>
                <View className="flex-row w-full h-1.5 rounded-full overflow-hidden gap-px">
                  <View
                    className={`flex-1 rounded-l-full ${
                      winner === 'A' ? 'bg-brand-500' : 'bg-surface-2'
                    }`}
                  />
                  <View
                    className={`flex-1 rounded-r-full ${
                      winner === 'B' ? 'bg-brand-500' : 'bg-surface-2'
                    }`}
                  />
                </View>
              </View>

              <Text
                className={`w-10 text-left text-sm font-bold ${
                  winner === 'B' ? 'text-white' : 'text-gray-600'
                }`}
              >
                {b}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => setPlayerBId(null)}
            className="border border-white/5 rounded-xl py-3 items-center mt-4"
          >
            <Text className="text-gray-400 text-sm">Comparar con otro jugador</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['bottom']}>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-3 gap-3">
          <View>
            <Text className="text-white text-xl font-bold">
              {playerA ? `Comparar a ${playerA.name}` : 'Comparar jugadores'}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Elegí el segundo jugador
            </Text>
          </View>

          <View className="flex-row items-center bg-surface-1 border border-white/5 rounded-xl px-3 gap-2">
            <Text className="text-gray-500">🔍</Text>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
              className="flex-1 text-white text-sm py-2.5"
            />
          </View>
        </View>

        <FlatList
          data={candidates}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setPlayerBId(item.id)}
              className="bg-surface-1 border border-white/5 rounded-xl p-3 flex-row items-center gap-3"
            >
              <View className="flex-1">
                <Text className="text-white font-semibold text-sm">{item.name}</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {item.position}
                  {item.club?.name ? ` · ${item.club.name}` : ''}
                </Text>
              </View>
              <Text className="text-gray-600 text-xs">→</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
