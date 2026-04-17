import '../src/global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/src/providers/auth-provider';

import { AuthGate } from '@/src/components/auth/auth-gate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  1000 * 60 * 2,   // 2 min
      gcTime:     1000 * 60 * 10,  // 10 min
      retry:      1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function RootLayout() {
  return (
  <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <AuthGate />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="player/[id]"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#111827' },
                headerTintColor: '#fff',
                headerTitle: '',
                headerBackTitle: 'Volver',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="player/new"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#111827' },
                headerTintColor: '#fff',
                headerTitle: 'Nuevo jugador',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="player/[id]/edit"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#111827' },
                headerTintColor: '#fff',
                headerTitle: 'Editar jugador',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="player/[id]/new-note"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#111827' },
                headerTintColor: '#fff',
                headerTitle: 'Nueva nota',
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="compare"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#111827' },
                headerTintColor: '#fff',
                headerTitle: 'Comparar jugadores',
                presentation: 'card',
              }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  </AuthProvider>
);
}
