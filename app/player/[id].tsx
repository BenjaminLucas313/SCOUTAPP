import React, { useState } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity,
  Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayer, useDeletePlayer } from '../../src/hooks/usePlayers';
import { usePlayerNotes } from '../../src/hooks/useEntities';
import { AttributeGrid } from '../../src/components/ui/AttributeBar';
import { Badge, Card, Divider, Text as AppText } from '../../src/components/ui';
import { useAddPlayerToShortlist, useShortlists } from '../../src/hooks/useEntities';

const notify = (msg: string) => {
  if (typeof window !== 'undefined') {
    window.alert(msg);
  } else {
    Alert.alert('Aviso', msg);
  }
};





export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: player, isLoading } = usePlayer(id);
  const { data: notes = [] } = usePlayerNotes(id ?? '');
  const deletePlayer = useDeletePlayer();
  const { data: shortlists = [] } = useShortlists();
  const addToShortlistMutation = useAddPlayerToShortlist();
  const [activeTab, setActiveTab] = useState<'info' | 'notes'>('info');

  const [showShortlists, setShowShortlists] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface-0 items-center justify-center">
        <ActivityIndicator color="#3B5BDB" />
      </View>
    );
  }

  if (!player) {
    return (
      <View className="flex-1 bg-surface-0 items-center justify-center px-8">
        <AppText variant="h3" className="text-gray-500 text-center">
          Jugador no encontrado
        </AppText>
      </View>
    );
  }

  const handleDelete = async () => {
  const confirmed =
    typeof window !== 'undefined'
      ? window.confirm(`¿Eliminar a ${player.name}? Esta acción no se puede deshacer.`)
      : true;

  if (!confirmed) return;

  try {
    await deletePlayer.mutateAsync(player.id);
    router.back();
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    if (typeof window !== 'undefined') {
      window.alert('No se pudo eliminar el jugador.');
    }
  }
};

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View className="bg-surface-1 px-4 pt-4 pb-6">
          <View className="flex-row items-start gap-4">
            <View className="w-20 h-20 rounded-2xl bg-surface-2 overflow-hidden items-center justify-center">
              {player.photo_url ? (
                <Image
                  source={{ uri: player.photo_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-4xl">👤</Text>
              )}
            </View>

            <View className="flex-1 gap-2">
              <Text className="text-white text-2xl font-bold">{player.name}</Text>
              <View className="flex-row gap-2 flex-wrap">
                <Badge label={player.position} color="blue" />
                {player.secondary_positions?.map((pos) => (
                  <Badge key={pos} label={pos} color="gray" />
                ))}
              </View>
              {player.club && (
                <Text className="text-gray-400 text-sm">
                  {player.club.name}
                  {player.club.league && ` · ${player.club.league.name}`}
                </Text>
              )}
            </View>

            {/* Edit button */}
            <TouchableOpacity
              onPress={() => router.push(`/player/new?playerId=${player.id}`)}
              className="bg-surface-2 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Text className="text-gray-300 text-sm">Editar</Text>
            </TouchableOpacity>
          </View>



          <TouchableOpacity
  onPress={() => setShowShortlists((prev) => !prev)}
  className="bg-brand-500 px-3 py-2 rounded-lg mt-2"
>
  <Text className="text-white text-sm font-semibold">
    + Agregar a shortlist
  </Text>
</TouchableOpacity>
{showShortlists && (
  <View className="mt-2 gap-2">
    {shortlists.length ? (
      shortlists.map((shortlist) => (
        <TouchableOpacity
          key={shortlist.id}
          onPress={async () => {
            if (!player) return;

            try {
              await addToShortlistMutation.mutateAsync({
                shortlistId: shortlist.id,
                playerId: player.id,
              });

              notify(`Se agregó a ${shortlist.name}`);
              setShowShortlists(false);
            } catch (err: any) {
              notify(err.message ?? 'No se pudo agregar a la shortlist');
            }
          }}
          className="bg-surface-2 border border-white/10 rounded-lg px-3 py-2"
        >
          <Text className="text-white text-sm">{shortlist.name}</Text>
          {shortlist.description ? (
            <Text className="text-gray-400 text-xs mt-1">
              {shortlist.description}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))
    ) : (
      <Text className="text-gray-400 text-sm">
        No hay shortlists disponibles
      </Text>
    )}
  </View>
)}




          {/* Quick stats row */}
          <View className="flex-row gap-4 mt-4 pt-4 border-t border-white/5">
            {player.birth_date && (
              <StatPill label="Edad" value={`${calculateAge(player.birth_date)} años`} />
            )}
            {player.nationality && (
              <StatPill label="País" value={player.nationality} />
            )}
            {player.height_cm && (
              <StatPill label="Altura" value={`${player.height_cm} cm`} />
            )}
            {player.foot && (
              <StatPill
                label="Pie"
                value={player.foot === 'right' ? 'Derecho' : player.foot === 'left' ? 'Izquierdo' : 'Ambos'}
              />
            )}
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-white/5">
          {(['info', 'notes'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3 items-center border-b-2 ${
                activeTab === tab
                  ? 'border-brand-500'
                  : 'border-transparent'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? 'text-brand-100' : 'text-gray-500'
                }`}
              >
                {tab === 'info' ? 'Atributos' : `Notas (${notes.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="p-4 gap-4">
          {activeTab === 'info' ? (
            <>
              {player.attributes ? (
                <Card className="p-4">
                  <AppText variant="label" className="mb-3">Atributos</AppText>
                  <AttributeGrid attributes={player.attributes} />
                </Card>
              ) : (
                <View className="py-6 items-center">
                  <AppText variant="muted">Sin atributos cargados</AppText>
                </View>
              )}

              {/* Contract / market info */}
              {(player.market_value || player.contract_until) && (
                <Card className="p-4 gap-3">
                  <AppText variant="label">Información contractual</AppText>
                  <Divider />
                  {player.market_value && (
                    <View className="flex-row justify-between">
                      <AppText variant="muted">Valor de mercado</AppText>
                      <AppText variant="body">
                        {formatMarketValue(player.market_value)}
                      </AppText>
                    </View>
                  )}
                  {player.contract_until && (
                    <View className="flex-row justify-between">
                      <AppText variant="muted">Contrato hasta</AppText>
                      <AppText variant="body">{player.contract_until}</AppText>
                    </View>
                  )}
                </Card>
              )}

              {/* Danger zone */}
              <TouchableOpacity
                onPress={handleDelete}
                className="border border-red-500/20 rounded-xl p-3 items-center mt-2"
              >
                <Text className="text-red-400 text-sm">Eliminar jugador</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
  className="bg-surface-1 border border-white/5 rounded-xl p-3 items-center"
  onPress={() => {
    router.push({
      pathname: '/player/[id]/new-note',
      params: { id: String(id) },
    });
  }}
>
  <Text className="text-brand-100 text-sm font-medium">+ Nueva nota</Text>
</TouchableOpacity>

              {notes.length === 0 ? (
  <View className="py-10 items-center rounded-2xl border border-white/5 bg-surface-1">
    <Text className="text-3xl mb-2">📝</Text>
    <AppText variant="body" className="text-gray-300">
      Todavía no hay notas
    </AppText>
    <AppText variant="muted" className="mt-1 text-center">
      Guardá observaciones rápidas para comparar mejor a este jugador.
    </AppText>
  </View>
) : (
  <View className="gap-3">
    {notes.map((note, index) => (
      <Card key={note.id} className="p-4 gap-3 rounded-2xl border border-white/5">
        <View className="flex-row justify-between items-start">
          <View className="gap-1">
            <Text className="text-gray-500 text-xs">
              Nota #{notes.length - index}
            </Text>
            <Text className="text-gray-400 text-xs">
              {formatObservedDate(note.observed_at)}
            </Text>
          </View>

          {note.rating ? (
            <View className="bg-green-500/15 px-2.5 py-1 rounded-full">
              <Text className="text-green-300 text-xs font-semibold">
                {note.rating}/5
              </Text>
            </View>
          ) : null}
        </View>

        <AppText variant="body" className="text-white leading-6">
          {note.content}
        </AppText>
      </Card>
    ))}
  </View>
)}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-gray-600 text-xs">{label}</Text>
      <Text className="text-white text-sm font-medium">{value}</Text>
    </View>
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

function formatMarketValue(value: number): string {
  if (value >= 1000) return `€${(value / 1000).toFixed(1)}M`;
  return `€${value}K`;
}

function formatObservedDate(date?: string | null) {
  if (!date) return 'Sin fecha';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}