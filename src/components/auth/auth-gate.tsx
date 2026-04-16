import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import { useAuth } from '@/src/providers/auth-provider';

export function AuthGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthScreen = pathname === '/login' || pathname === '/register';

    if (!user && !inAuthScreen) {
      router.replace('/login');
    } else if (user && inAuthScreen) {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-0">
        <ActivityIndicator color="#3B5BDB" />
      </View>
    );
  }

  return null;
}