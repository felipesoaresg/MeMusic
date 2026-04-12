import { Tabs, useLocalSearchParams } from 'expo-router';
import React from 'react';
import CategoryBar from '../../components/CategoryBar';

export default function TabsLayout() {
  const { clientId, clientName } = useLocalSearchParams<{ clientId: string; clientName: string }>();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <CategoryBar />}
    >
      <Tabs.Screen name="client" initialParams={{ clientId, clientName }} />
      <Tabs.Screen name="request" initialParams={{ clientId, clientName }} />
      <Tabs.Screen name="queue" initialParams={{ clientId, clientName }} />
    </Tabs>
  );
}