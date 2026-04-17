import React, { useState } from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import type { PlayerFilters, Position, Foot } from '@/src/types';

const POSITIONS: Position[] = [
  'GK',
  'CB', 'LB', 'RB', 'LWB', 'RWB',
  'CDM', 'CM', 'CAM', 'LM', 'RM',
  'LW', 'RW', 'SS', 'ST', 'CF',
];

const FOOT_OPTIONS: { value: Foot; label: string }[] = [
  { value: 'right', label: 'Derecho' },
  { value: 'left',  label: 'Izquierdo' },
  { value: 'both',  label: 'Ambos' },
];

interface FilterModalProps {
  visible: boolean;
  filters: PlayerFilters;
  onApply: (filters: PlayerFilters) => void;
  onClose: () => void;
}

export function FilterModal({ visible, filters, onApply, onClose }: FilterModalProps) {
  const [draft, setDraft] = useState<PlayerFilters>(filters);

  const togglePosition = (pos: Position) => {
    setDraft((prev) => {
      const current = prev.positions ?? [];
      return {
        ...prev,
        positions: current.includes(pos)
          ? current.filter((p) => p !== pos)
          : [...current, pos],
      };
    });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    const empty: PlayerFilters = {};
    setDraft(empty);
    onApply(empty);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-surface-0">
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/5">
          <Text className="text-white text-xl font-bold">Filtros</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-400 text-sm">Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Posición */}
          <View className="gap-3">
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Posición
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {POSITIONS.map((pos) => {
                const active = draft.positions?.includes(pos) ?? false;
                return (
                  <TouchableOpacity
                    key={pos}
                    onPress={() => togglePosition(pos)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      active
                        ? 'bg-brand-500/20 border-brand-500/50'
                        : 'bg-surface-1 border-white/10'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        active ? 'text-brand-100' : 'text-gray-400'
                      }`}
                    >
                      {pos}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pie */}
          <View className="gap-3">
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Pie
            </Text>
            <View className="flex-row gap-2">
              {FOOT_OPTIONS.map(({ value, label }) => {
                const active = draft.foot === value;
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        foot: active ? undefined : value,
                      }))
                    }
                    className={`flex-1 py-2 rounded-lg border items-center ${
                      active
                        ? 'bg-brand-500/20 border-brand-500/50'
                        : 'bg-surface-1 border-white/10'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        active ? 'text-brand-100' : 'text-gray-400'
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Edad */}
          <View className="gap-3">
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Edad
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1">
                <Text className="text-gray-500 text-xs">Mínima</Text>
                <TextInput
                  value={draft.age_min !== undefined ? String(draft.age_min) : ''}
                  onChangeText={(t) =>
                    setDraft((p) => ({ ...p, age_min: t ? Number(t) : undefined }))
                  }
                  keyboardType="numeric"
                  placeholder="16"
                  placeholderTextColor="#4B5563"
                  className="bg-surface-1 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-gray-500 text-xs">Máxima</Text>
                <TextInput
                  value={draft.age_max !== undefined ? String(draft.age_max) : ''}
                  onChangeText={(t) =>
                    setDraft((p) => ({ ...p, age_max: t ? Number(t) : undefined }))
                  }
                  keyboardType="numeric"
                  placeholder="35"
                  placeholderTextColor="#4B5563"
                  className="bg-surface-1 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-4 pb-8 pt-3 gap-3 border-t border-white/5">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-brand-500 rounded-xl py-3.5 items-center"
          >
            <Text className="text-white font-semibold">Aplicar filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear} className="items-center py-2">
            <Text className="text-gray-400 text-sm">Limpiar todo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
