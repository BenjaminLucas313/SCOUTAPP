import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLeagues, useDeleteLeague, useClubs, useDeleteClub } from '../../src/hooks/useEntities';
import { Card, EmptyState } from '../../src/components/ui';

export default function LeaguesScreen() {
  const [activeTab, setActiveTab] = useState<'leagues' | 'clubs'>('leagues');

  const { data: leagues = [], isLoading: loadingLeagues } = useLeagues();
  const { data: clubs   = [], isLoading: loadingClubs   } = useClubs();
  const deleteLeague = useDeleteLeague();
  const deleteClub   = useDeleteClub();

  const isLoading = activeTab === 'leagues' ? loadingLeagues : loadingClubs;

  const handleDeleteLeague = (id: string, name: string) => {
    Alert.alert('Eliminar liga', `¿Eliminar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteLeague.mutate(id) },
    ]);
  };

  const handleDeleteClub = (id: string, name: string) => {
    Alert.alert('Eliminar club', `¿Eliminar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteClub.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['top']}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-white text-2xl font-bold mb-3">Ligas y clubes</Text>

        <View className="flex-row gap-2 bg-surface-1 rounded-xl p-1">
          {(['leagues', 'clubs'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg items-center ${
                activeTab === tab ? 'bg-brand-500' : ''
              }`}
            >
              <Text className={`text-sm font-medium ${
                activeTab === tab ? 'text-white' : 'text-gray-500'
              }`}>
                {tab === 'leagues' ? `Ligas (${leagues.length})` : `Clubes (${clubs.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3B5BDB" />
        </View>
      ) : activeTab === 'leagues' ? (
        <FlatList
          data={leagues}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ padding: 16, gap: 8, paddingTop: 4 }}
          renderItem={({ item }) => (
            <Card className="p-4 flex-row items-center justify-between">
              <View className="gap-0.5">
                <Text className="text-white font-semibold">{item.name}</Text>
                <Text className="text-gray-500 text-xs">
                  {item.country} · División {item.level}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteLeague(item.id, item.name)}
                className="p-2"
              >
                <Text className="text-red-400 text-sm">🗑</Text>
              </TouchableOpacity>
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Sin ligas"
              subtitle="Agregá ligas para organizar los clubes"
            />
          }
        />
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: 16, gap: 8, paddingTop: 4 }}
          renderItem={({ item }) => (
            <Card className="p-4 flex-row items-center justify-between">
              <View className="gap-0.5">
                <Text className="text-white font-semibold">{item.name}</Text>
                <Text className="text-gray-500 text-xs">
                  {item.country}
                  {item.league && ` · ${item.league.name}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteClub(item.id, item.name)}
                className="p-2"
              >
                <Text className="text-red-400 text-sm">🗑</Text>
              </TouchableOpacity>
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Sin clubes"
              subtitle="Agregá clubes para asignarlos a jugadores"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
