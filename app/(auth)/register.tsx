import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá email y contraseña');
      return;
    }

    try {
      setLoading(true);

      console.log('REGISTER START', { email });

      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      console.log('REGISTER RESPONSE', result, 'status:', response.status);

      if (!response.ok) {
        Alert.alert(
          'Error al crear cuenta',
          result?.msg || result?.message || 'No se pudo crear la cuenta'
        );
        return;
      }

      Alert.alert(
        'Cuenta creada',
        'La cuenta fue creada correctamente. Ahora podés iniciar sesión.'
      );

      router.replace('/login');
    } catch (err: any) {
      console.log('REGISTER CATCH', err);
      Alert.alert(
        'Error inesperado',
        err?.message ?? 'No se pudo completar el registro'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0 px-4 py-6">
      <View className="flex-1 justify-center items-center">
        <View className="w-full max-w-[520px] gap-5 rounded-2xl bg-surface-1 border border-white/5 p-5">
          <View className="gap-1">
            <Text className="text-white text-3xl font-bold">Crear cuenta</Text>
            <Text className="text-gray-400 text-sm">
              Registrate para guardar tus jugadores, notas y shortlists.
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
            onPress={handleRegister}
            disabled={loading}
            className={`rounded-xl py-3 items-center ${
              loading ? 'bg-brand-500/70' : 'bg-brand-500'
            }`}
          >
            <Text className="text-white font-semibold">
              {loading ? 'Creando...' : 'Crear cuenta'}
            </Text>
          </Pressable>

          <View className="items-center pt-1">
            <Text className="text-gray-400">¿Ya tenés cuenta?</Text>
            <Pressable onPress={() => router.replace('/login')} className="mt-2">
              <Text className="text-brand-100 font-semibold">Iniciar sesión</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}