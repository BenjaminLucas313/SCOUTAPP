import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

const isWeb = Platform.OS === 'web';
const isBrowser = typeof window !== 'undefined';

const webStorage: SupportedStorage = {
  getItem: async (key) => {
    if (!isBrowser) return null;
    return window.localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (!isBrowser) return;
    window.localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};

const storage: SupportedStorage | undefined = isWeb
  ? (isBrowser ? webStorage : undefined)
  : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: !isWeb || isBrowser,
    persistSession: !!storage,
    detectSessionInUrl: isWeb,
  },
});