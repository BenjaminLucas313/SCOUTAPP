import React from 'react';
import {
  ScrollView, View, Text, TextInput,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playerFormSchema, type PlayerFormValues } from '../../src/schemas';
import { usePlayer, useCreatePlayer, useUpdatePlayer } from '../../src/hooks/usePlayers';
import { useLeagues, useClubs } from '../../src/hooks/useEntities';
import type { Position } from '../../src/types';

const POSITIONS: Position[] = [
  'GK','CB','LB','RB','LWB','RWB',
  'CDM','CM','CAM','LM','RM',
  'LW','RW','SS','ST','CF',
];

// ─── Reutilizable en alta y edición ──────────────────────────────────────────

interface PlayerFormProps {
  playerId?: string;
}

export default function PlayerFormScreen({ playerId }: PlayerFormProps) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const resolvedId = playerId ?? id;
  const isEditing  = !!resolvedId;

  const { data: existingPlayer } = usePlayer(resolvedId ?? null);
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();
  const { data: clubs = [] } = useClubs();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: existingPlayer
      ? {
          name:                existingPlayer.name,
          birth_date:          existingPlayer.birth_date ?? undefined,
          nationality:         existingPlayer.nationality ?? undefined,
          position:            existingPlayer.position,
          secondary_positions: existingPlayer.secondary_positions ?? [],
          foot:                existingPlayer.foot ?? undefined,
          height_cm:           existingPlayer.height_cm ?? undefined,
          weight_kg:           existingPlayer.weight_kg ?? undefined,
          club_id:             existingPlayer.club_id ?? undefined,
          market_value:        existingPlayer.market_value ?? undefined,
          contract_until:      existingPlayer.contract_until ?? undefined,
          attributes:          existingPlayer.attributes ?? undefined,
        }
      : {
          position:            'CM',
          secondary_positions: [],
        },
  });

  const onSubmit = async (values: PlayerFormValues) => {
    console.log('VALUES EN SUBMIT:', values);
    try {
      if (isEditing && resolvedId) {
        await updatePlayer.mutateAsync({ id: resolvedId, input: values });
      } else {
        await createPlayer.mutateAsync(values as any);
      }
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Ocurrió un error al guardar');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Nombre */}
        <FieldWrapper label="Nombre *" error={errors.name?.message}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                placeholder="Ej: Lionel Messi"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
              />
            )}
          />
        </FieldWrapper>

        {/* Posición */}
        <FieldWrapper label="Posición principal *" error={errors.position?.message}>
          <Controller
            control={control}
            name="position"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {POSITIONS.map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    onPress={() => onChange(pos)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      value === pos
                        ? 'bg-brand-500/20 border-brand-500/50'
                        : 'bg-surface-1 border-white/5'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        value === pos ? 'text-brand-100' : 'text-gray-400'
                      }`}
                    >
                      {pos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </FieldWrapper>

        {/* Fecha de nacimiento */}
        <FieldWrapper label="Fecha de nacimiento" error={errors.birth_date?.message}>
          <Controller
            control={control}
            name="birth_date"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                placeholder="YYYY-MM-DD"
                value={value ?? ''}
                onChangeText={onChange}
                keyboardType="numeric"
              />
            )}
          />
        </FieldWrapper>

        {/* Nacionalidad */}
        <FieldWrapper label="Nacionalidad" error={errors.nationality?.message}>
          <Controller
            control={control}
            name="nationality"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                placeholder="Ej: Argentina"
                value={value ?? ''}
                onChangeText={onChange}
                autoCapitalize="words"
              />
            )}
          />
        </FieldWrapper>

                {/* Club */}
        <FieldWrapper label="Club">
          <Controller
            control={control}
            name="club_id"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <TouchableOpacity
                  className="bg-surface-1 border border-white/5 rounded-xl px-4 py-3"
                >
                  <Text className="text-white text-sm">
                    {value
                      ? clubs.find((club) => club.id === value)?.name ?? 'Club seleccionado'
                      : 'Seleccionar club'}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row flex-wrap gap-2">
                  <TouchableOpacity
                    onPress={() => onChange(undefined)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      !value
                        ? 'bg-brand-500/20 border-brand-500/50'
                        : 'bg-surface-1 border-white/5'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        !value ? 'text-brand-100' : 'text-gray-400'
                      }`}
                    >
                      Sin club
                    </Text>
                  </TouchableOpacity>

                  {clubs.map((club) => (
                    <TouchableOpacity
                      key={club.id}
                      onPress={() => onChange(club.id)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        value === club.id
                          ? 'bg-brand-500/20 border-brand-500/50'
                          : 'bg-surface-1 border-white/5'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          value === club.id ? 'text-brand-100' : 'text-gray-400'
                        }`}
                      >
                        {club.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          />
        </FieldWrapper>

        {/* Fila altura + peso */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FieldWrapper label="Altura (cm)" error={errors.height_cm?.message}>
              <Controller
                control={control}
                name="height_cm"
                render={({ field: { onChange, value } }) => (
                  <StyledInput
                    placeholder="180"
                    value={value?.toString() ?? ''}
                    onChangeText={(t) => onChange(t ? Number(t) : undefined)}
                    keyboardType="numeric"
                  />
                )}
              />
            </FieldWrapper>
          </View>
          <View className="flex-1">
            <FieldWrapper label="Peso (kg)" error={errors.weight_kg?.message}>
              <Controller
                control={control}
                name="weight_kg"
                render={({ field: { onChange, value } }) => (
                  <StyledInput
                    placeholder="75"
                    value={value?.toString() ?? ''}
                    onChangeText={(t) => onChange(t ? Number(t) : undefined)}
                    keyboardType="numeric"
                  />
                )}
              />
            </FieldWrapper>
          </View>
        </View>

        {/* Pie */}
        <FieldWrapper label="Pie dominante" error={errors.foot?.message}>
          <Controller
            control={control}
            name="foot"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-2">
                {(['right', 'left', 'both'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => onChange(f)}
                    className={`px-4 py-2 rounded-lg border flex-1 items-center ${
                      value === f
                        ? 'bg-brand-500/20 border-brand-500/50'
                        : 'bg-surface-1 border-white/5'
                    }`}
                  >
                    <Text className={`text-xs font-medium ${value === f ? 'text-brand-100' : 'text-gray-400'}`}>
                      {f === 'right' ? 'Derecho' : f === 'left' ? 'Izquierdo' : 'Ambos'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </FieldWrapper>

        {/* Atributos */}
        <View>
          <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
            Atributos (0–100)
          </Text>
          <View className="gap-3">
            {(
              [
                ['pace', 'Velocidad (PAC)'],
                ['shooting', 'Disparo (TIR)'],
                ['passing', 'Pase (PAS)'],
                ['dribbling', 'Regate (DRI)'],
                ['defending', 'Defensa (DEF)'],
                ['physical', 'Físico (FÍS)'],
              ] as const
            ).map(([key, label]) => (
              <FieldWrapper key={key} label={label}>
                <Controller
                  control={control}
                  name={`attributes.${key}`}
                  render={({ field: { onChange, value } }) => (
                    <StyledInput
                      placeholder="0–100"
                      value={value?.toString() ?? ''}
                      onChangeText={(t) => onChange(t ? Number(t) : undefined)}
                      keyboardType="numeric"
                    />
                  )}
                />
              </FieldWrapper>
            ))}
          </View>
        </View>

        {/* Valor de mercado */}
        <FieldWrapper label="Valor de mercado (miles €)" error={errors.market_value?.message}>
          <Controller
            control={control}
            name="market_value"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                placeholder="Ej: 5000 = €5M"
                value={value?.toString() ?? ''}
                onChangeText={(t) => onChange(t ? Number(t) : undefined)}
                keyboardType="numeric"
              />
            )}
          />
        </FieldWrapper>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-brand-500 rounded-xl py-4 items-center mt-2 active:bg-brand-600"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {isEditing ? 'Guardar cambios' : 'Crear jugador'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldWrapper({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </Text>
      {children}
      {error && <Text className="text-red-400 text-xs">{error}</Text>}
    </View>
  );
}

function StyledInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      className="bg-surface-1 border border-white/5 rounded-xl px-4 py-3 text-white text-sm"
      placeholderTextColor="#4B5563"
    />
  );
}
