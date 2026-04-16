import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useShortlists } from '../../../src/hooks/useEntities';
import { Card, EmptyState } from '../../../src/components/ui';

// En MVP usamos un scout_id fijo. En la próxima iteración vendrá del contexto de auth.

export default function ShortlistsScreen() {
   const { data: shortlists = [], isLoading } = useShortlists();

   return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['top']}>
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Shortlists</Text>
        <TouchableOpacity
          onPress={() => router.push('/shortlists/new')}
          className="bg-brand-500 px-3 py-1.5 rounded-lg"
        >
          <Text className="text-white text-sm font-semibold">+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3B5BDB" />
        </View>
      ) : (
        <FlatList
          data={shortlists}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ padding: 16, gap: 8, paddingTop: 4 }}
          renderItem={({ item }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={() => router.push(`/shortlists/${item.id}`)}
  >
    <Card className="p-4 gap-1">
      <Text className="text-white font-semibold text-base">{item.name}</Text>
      {item.description && (
        <Text className="text-gray-500 text-sm">{item.description}</Text>
      )}
      <Text className="text-gray-600 text-xs mt-1">
        Creada {new Date(item.created_at).toLocaleDateString('es-AR')}
      </Text>
    </Card>
  </TouchableOpacity>
)}
          ListEmptyComponent={
            <EmptyState
              title="Sin shortlists"
              subtitle="Creá listas para agrupar jugadores de interés"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
