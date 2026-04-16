import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useShortlistDetail } from '../../../src/hooks/useEntities';
import { Card, EmptyState } from '../../../src/components/ui';

export default function ShortlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: shortlist, isLoading } = useShortlistDetail(id ?? null);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface-0 items-center justify-center">
        <ActivityIndicator color="#3B5BDB" />
      </SafeAreaView>
    );
  }

  if (!shortlist) {
    return (
      <SafeAreaView className="flex-1 bg-surface-0">
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-brand-400 text-sm">← Volver</Text>
          </TouchableOpacity>
        </View>

        <EmptyState
          title="Shortlist no encontrada"
          subtitle="No se pudo cargar la lista seleccionada"
        />
      </SafeAreaView>
    );
  }

  const players = shortlist.players ?? [];

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['top']}>
      <View className="px-4 pt-4 pb-3 gap-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-brand-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold">
          {shortlist.name}
        </Text>

        {shortlist.description && (
          <Text className="text-gray-400 text-sm">
            {shortlist.description}
          </Text>
        )}

        <Text className="text-gray-500 text-xs mt-1">
          {players.length} jugador{players.length === 1 ? '' : 'es'}
        </Text>
      </View>

      <FlatList
        data={players}
        keyExtractor={(item) => item.player_id}
        contentContainerStyle={{ padding: 16, gap: 8, paddingTop: 4 }}
        renderItem={({ item }) => {
          const player = item.player;

          if (!player) return null;

          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push(`/player/${player.id}`)}
            >
              <Card className="p-4 gap-1">
                <Text className="text-white font-semibold text-base">
                  {player.name}
                </Text>

                <Text className="text-gray-400 text-sm">
                  {player.position}
                  {player.club?.name ? ` · ${player.club.name}` : ''}
                </Text>

                {item.position_override && (
                  <Text className="text-brand-300 text-xs mt-1">
                    Posición observada: {item.position_override}
                  </Text>
                )}
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="Sin jugadores"
            subtitle="Todavía no agregaste jugadores a esta shortlist"
          />
        }
      />
    </SafeAreaView>
  );
}