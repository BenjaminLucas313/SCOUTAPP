import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View className="items-center justify-center">
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: 'rgba(255,255,255,0.05)',
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 64,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarActiveTintColor: '#3B5BDB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jugadores',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚽" focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="shortlists/index"
        options={{
          title: 'Shortlists',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="leagues"
        options={{
          title: 'Ligas',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="shortlists/new"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="shortlists/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}