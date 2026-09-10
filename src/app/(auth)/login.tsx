import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await loginWithGoogle();
      router.replace('/(onboarding)/profile');
    } catch (e) {
      console.error('Google login error:', e);
      router.replace('/(onboarding)/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable={false} contentContainerStyle={styles.container}>
      {/* Top Branding Section */}
      <View style={styles.topSection}>
        <View style={[styles.logoBox, { backgroundColor: colors.accentLight }]}>
          <Ionicons name="sparkles" size={38} color={colors.accent} />
        </View>
        <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
          NutriTrack <Text style={{ color: colors.accent }}>AI</Text>
        </Text>
        <Text style={[Typography.body, styles.subtitle, { color: colors.textSecondary }]}>
          Track meals effortlessly with computer vision and smart calorie analytics.
        </Text>
      </View>

      {/* Feature Preview Card */}
      <Card style={styles.previewCard} padding="lg">
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.calorieLight }]}>
            <Ionicons name="camera-outline" size={20} color={colors.calorie} />
          </View>
          <View style={styles.featureText}>
            <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
              Snap & Estimate
            </Text>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Instant food identification & macro estimation
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.proteinLight }]}>
            <Ionicons name="calculator-outline" size={20} color={colors.protein} />
          </View>
          <View style={styles.featureText}>
            <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
              Adaptive Deficit Calculator
            </Text>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Personalized TDEE and protein targets
            </Text>
          </View>
        </View>
      </Card>

      {/* Login Action Section */}
      <View style={styles.actionSection}>
        <Button
          title="Continue with Google"
          onPress={handleGoogleLogin}
          loading={loading}
          size="lg"
          variant="secondary"
          icon={<Ionicons name="logo-google" size={22} color={colors.textPrimary} />}
          style={[styles.googleButton, { borderColor: colors.border, borderWidth: 1 }]}
          textStyle={{ fontWeight: '600' }}
        />

        <Text style={[Typography.tiny, styles.termsText, { color: colors.textSecondary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy. Mock prototype only.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: Spacing.xl,
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 22,
  },
  previewCard: {
    marginVertical: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  googleButton: {
    width: '100%',
  },
  termsText: {
    textAlign: 'center',
    marginTop: Spacing.base,
    maxWidth: 260,
    lineHeight: 16,
  },
});
