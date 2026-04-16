import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createNote } from '@/src/services/notes.service';
import { queryKeys } from '@/src/hooks/queryKeys';

export default function NewNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [rating, setRating] = useState('3');
  const [observedAt, setObservedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const createNoteMutation = useMutation({
  mutationFn: createNote,
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.notes.byPlayer(String(id)),
    });

    await queryClient.refetchQueries({
      queryKey: queryKeys.notes.byPlayer(String(id)),
    });

    router.replace(`/player/${id}`);
  },
  onError: (error: any) => {
    Alert.alert('Error al crear nota', error.message ?? 'Error desconocido');
  },
});

  const handleSave = async () => {
    if (!id) {
      Alert.alert('Error', 'Jugador inválido');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Falta contenido', 'Escribí una nota antes de guardar.');
      return;
    }

    await createNoteMutation.mutateAsync({
      player_id: String(id),
      content: content.trim(),
      rating: Number(rating),
      observed_at: observedAt,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0 px-4 py-4">
      <View className="gap-5">
        <View className="gap-1">
          <Text className="text-white text-3xl font-bold">Nueva nota</Text>
          <Text className="text-gray-400 text-sm">
            Guardá una observación rápida del jugador.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-gray-300 text-sm font-medium">Contenido</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Ej: buen primer control, agresivo en presión, toma buenas decisiones..."
            placeholderTextColor="#6B7280"
            className="min-h-[140px] rounded-2xl bg-surface-1 border border-white/5 px-4 py-4 text-white"
            textAlignVertical="top"
          />
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <Text className="text-gray-300 text-sm font-medium">Rating</Text>
            <TextInput
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
              placeholder="3"
              placeholderTextColor="#6B7280"
              className="rounded-2xl bg-surface-1 border border-white/5 px-4 py-3 text-white"
            />
          </View>

          <View className="flex-[2] gap-2">
            <Text className="text-gray-300 text-sm font-medium">Fecha observada</Text>
            <TextInput
              value={observedAt}
              onChangeText={setObservedAt}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#6B7280"
              className="rounded-2xl bg-surface-1 border border-white/5 px-4 py-3 text-white"
            />
          </View>
        </View>

        <View className="rounded-2xl border border-white/5 bg-surface-1 px-4 py-3">
          <Text className="text-gray-400 text-xs">
            Consejo: usá notas cortas y específicas. Después es mucho más fácil comparar jugadores.
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={createNoteMutation.isPending}
          className={`rounded-2xl px-4 py-4 items-center ${
            createNoteMutation.isPending ? 'bg-brand-500/70' : 'bg-brand-500'
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {createNoteMutation.isPending ? 'Guardando...' : 'Guardar nota'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}