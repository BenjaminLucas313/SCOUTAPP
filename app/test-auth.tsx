import { View, Text } from 'react-native';
import { useAuth } from '@/src/providers/auth-provider';


export default function TestAuthScreen() {
  const { user, loading, session } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Text>Loading: {loading ? 'sí' : 'no'}</Text>
      <Text>User: {user?.email ?? 'sin usuario'}</Text>
      <Text>Session: {session ? 'activa' : 'null'}</Text>
    </View>
  );
}