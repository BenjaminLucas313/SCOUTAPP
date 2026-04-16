import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { signIn } from '@/src/services/auth/sign-in';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá email y contraseña');
      return;
    }

    try {
      setLoading(true);

      await signIn({ email, password });

      router.replace('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      Alert.alert('Error al iniciar sesión', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0 px-4 py-6">
      <View className="flex-1 justify-center items-center">
        <View className="w-full max-w-[520px] gap-5 rounded-2xl bg-surface-1 border border-white/5 p-5">
          <View className="gap-1">
            <Text className="text-white text-3xl font-bold">Iniciar sesión</Text>
            <Text className="text-gray-400 text-sm">
              Entrá a tu espacio de scouting.
            </Text>
          </View>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-surface-0 border border-white/5 rounded-xl px-4 py-3 text-white"
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-surface-0 border border-white/5 rounded-xl px-4 py-3 text-white"
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-xl py-3 items-center ${
              loading ? 'bg-brand-500/70' : 'bg-brand-500'
            }`}
          >
            <Text className="text-white font-semibold">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Text>
          </Pressable>

          <View className="items-center pt-1">
            <Text className="text-gray-400">¿No tenés cuenta?</Text>
            <Pressable onPress={() => router.push('/register')} className="mt-2">
              <Text className="text-brand-100 font-semibold">Crear cuenta</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}