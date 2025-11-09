import { Tabs } from 'expo-router';
import React from 'react';
import CategoryBar from '../../components/CategoryBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <CategoryBar />}
    >
      <Tabs.Screen name="client" />
      <Tabs.Screen name="request" />
      <Tabs.Screen name="queue" />
    </Tabs>
  );
}
