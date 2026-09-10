import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="goal" options={{ headerShown: false }} />
      <Stack.Screen name="activity" options={{ headerShown: false }} />
      <Stack.Screen name="deficit-calculator" options={{ headerShown: false }} />
      <Stack.Screen name="daily-goals" options={{ headerShown: false }} />
    </Stack>
  );
}
