import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';

import { usePlayers } from '@/src/hooks/usePlayers';
import { PlayerCard } from '@/src/components/players/PlayerCard';
import { EmptyState } from '@/src/components/ui';
import { filterPlayers, countActiveFilters } from '@/src/lib/filters';
import {
  rankPlayers,
  DEFAULT_RANKING_CONFIG,
  PRESET_RANKING_CONFIGS,
} from '@/src/lib/ranking';
import type { PlayerFilters, RankingConfig } from '@/src/types';
import { signOut } from '@/src/services/auth/sign-out';
import { FilterModal } from '@/src/components/players/FilterModal';

export default function PlayersScreen() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<PlayerFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [rankingConfig, setRankingConfig] =
    useState<RankingConfig>(DEFAULT_RANKING_CONFIG);

  const { data: players = [], isLoading, isRefetching, refetch } = usePlayers();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onError: (error: Error) => {
      Alert.alert('Error al cerrar sesión', error.message);
    },
  });

  const activeFilterCount = countActiveFilters({
    ...filters,
    search: search || undefined,
  });

  const processedPlayers = useMemo(() => {
    const filtered = filterPlayers(players, {
      ...filters,
      search: search || undefined,
    });

    return rankPlayers(filtered, rankingConfig);
  }, [players, filters, search, rankingConfig]);

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['top', 'bottom']}>
      <View className="px-4 pt-2 pb-3 gap-3">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-2xl font-bold">Jugadores</Text>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => signOutMutation.mutate()}
              disabled={signOutMutation.isPending}
              className="bg-red-500/20 px-3 py-1.5 rounded-lg"
            >
              <Text className="text-red-300 text-sm font-semibold">
                {signOutMutation.isPending ? 'Saliendo...' : 'Salir'}
              </Text>
            </Pressable>

            <TouchableOpacity
              onPress={() => router.push('/player/new')}
              className="bg-brand-500 px-3 py-1.5 rounded-lg"
            >
              <Text className="text-white text-sm font-semibold">+ Nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View className="flex-row gap-2">
          <View className="flex-1 flex-row items-center bg-surface-1 border border-white/5 rounded-xl px-3 gap-2">
            <Text className="text-gray-500 text-base">🔍</Text>
            <TextInput
              placeholder="Buscar jugador..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
              className="flex-1 text-white text-sm py-2.5"
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`bg-surface-1 border rounded-xl px-3 items-center justify-center ${
              activeFilterCount > 0 ? 'border-brand-500/50' : 'border-white/5'
            }`}
          >
            <Text className={`text-sm ${activeFilterCount > 0 ? 'text-brand-100' : 'text-gray-400'}`}>
              {activeFilterCount > 0 ? `⚙️ ${activeFilterCount}` : '⚙️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ranking selector */}
        <View className="flex-row items-center gap-2">
          <Text className="text-gray-500 text-xs">Ranking:</Text>

          <View className="flex-row gap-1 flex-wrap">
            {PRESET_RANKING_CONFIGS.map((cfg) => (
              <TouchableOpacity
                key={cfg.id}
                onPress={() => setRankingConfig(cfg)}
                className={`px-2.5 py-1 rounded-full border ${
                  rankingConfig.id === cfg.id
                    ? 'bg-brand-500/20 border-brand-500/50'
                    : 'bg-surface-1 border-white/5'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    rankingConfig.id === cfg.id
                      ? 'text-brand-100'
                      : 'text-gray-400'
                  }`}
                >
                  {cfg.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Results count */}
      {!isLoading && (
        <View className="px-4 pb-2">
          <Text className="text-gray-600 text-xs">
            {processedPlayers.length} jugador
            {processedPlayers.length !== 1 ? 'es' : ''}
          </Text>
        </View>
      )}

      {/* List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3B5BDB" />
        </View>
      ) : (
        <FlatList
          data={processedPlayers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingTop: 4,
            paddingBottom: 90,
            gap: 8,
          }}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              rankScore={item.rankScore}
              onPress={() => router.push(`/player/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={search ? 'Sin resultados' : 'No hay jugadores aún'}
              subtitle={
                search
                  ? `No encontramos jugadores para "${search}"`
                  : 'Tocá + Nuevo para agregar el primero'
              }
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#3B5BDB"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={showFilters}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}