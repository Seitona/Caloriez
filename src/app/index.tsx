import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else if (!user?.isOnboarded) {
        router.replace('/(onboarding)/profile');
      } else {
        router.replace('/(tabs)');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.isOnboarded, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.centerContent}>
        {/* App Logo Icon */}
        <View style={[styles.logoContainer, { backgroundColor: colors.accentLight }]}>
          <Ionicons name="sparkles" size={44} color={colors.accent} />
        </View>

        {/* App Name & Tagline */}
        <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
          Caloriez
        </Text>
        <Text style={[Typography.body, styles.tagline, { color: colors.textSecondary }]}>
          Intelligent Calorie & Macro Nutrition
        </Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: Spacing.sm }]}>
          Loading your nutrition profile...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 260,
  },
  footer: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
});
