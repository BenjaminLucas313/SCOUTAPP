import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { useCreateShortlist } from '../../../src/hooks/useEntities';


export default function NewShortlistScreen() {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createShortlist = useCreateShortlist()

  const handleSave = async () => {

    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio')
      return
    }

    try {

      await createShortlist.mutateAsync({
  name: name.trim(),
  description: description.trim() || null
})

      router.back()

    } catch (err:any) {
      Alert.alert('Error', err.message ?? 'No se pudo crear la shortlist')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={['top','bottom']}>
      <View className="p-4 gap-4">

        <Text className="text-white text-2xl font-bold">
          Nueva shortlist
        </Text>

        <View className="gap-2">
          <Text className="text-gray-400 text-xs font-medium uppercase">
            Nombre *
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej: Prioridad alta"
            placeholderTextColor="#4B5563"
            className="bg-surface-1 border border-white/5 rounded-xl px-4 py-3 text-white text-sm"
          />
        </View>

        <View className="gap-2">
          <Text className="text-gray-400 text-xs font-medium uppercase">
            Descripción
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Jugadores a seguir"
            placeholderTextColor="#4B5563"
            className="bg-surface-1 border border-white/5 rounded-xl px-4 py-3 text-white text-sm"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-brand-500 rounded-xl py-4 items-center mt-2"
        >
          <Text className="text-white font-semibold text-base">
            Crear shortlist
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}