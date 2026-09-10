import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SettingRow } from '../../components/settings/SettingRow';
import { ThemeSelector } from '../../components/settings/ThemeSelector';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { macroGoals } = useNutrition();
  const router = useRouter();

  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOutConfirm = () => {
    setShowSignOutModal(false);
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          Manage profile, targets, and display preferences.
        </Text>
      </View>

      {/* SECTION 1: Appearance */}
      <Text style={[Typography.captionMedium, styles.sectionTitle, { color: colors.textSecondary }]}>
        APPEARANCE
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemeSelector />
      </View>

      {/* SECTION 2: Account */}
      <Text style={[Typography.captionMedium, styles.sectionTitle, { color: colors.textSecondary }]}>
        ACCOUNT
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SettingRow
          icon="person-circle-outline"
          title="Profile"
          subtitle={user?.displayName || 'Manage Profile'}
          onPress={() => router.push('/profile')}
        />
        <SettingRow
          icon="logo-google"
          title="Google Account"
          subtitle={user?.email || 'Not connected'}
          value={user?.email ? 'Connected' : 'Disconnected'}
        />
        <SettingRow
          icon="log-out-outline"
          title="Sign Out"
          subtitle="Return to Google sign-in screen"
          destructive
          showChevron={false}
          onPress={() => setShowSignOutModal(true)}
        />
      </View>

      {/* SECTION 3: Nutrition */}
      <Text style={[Typography.captionMedium, styles.sectionTitle, { color: colors.textSecondary }]}>
        NUTRITION TARGETS
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SettingRow
          icon="flame-outline"
          iconColor={colors.calorie}
          title="Daily Calorie Goal"
          value={`${macroGoals.calories} kcal`}
          onPress={() => router.push('/(onboarding)/daily-goals')}
        />
        <SettingRow
          icon="barbell-outline"
          iconColor={colors.protein}
          title="Daily Protein Goal"
          value={`${macroGoals.protein} g`}
          onPress={() => router.push('/(onboarding)/daily-goals')}
        />
        <SettingRow
          icon="speedometer-outline"
          title="Measurement Units"
          value={user?.units === 'imperial' ? 'Imperial (lbs, ft)' : 'Metric (kg, cm)'}
          onPress={() => router.push('/(onboarding)/profile')}
        />
      </View>

      {/* SECTION 4: General */}
      <Text style={[Typography.captionMedium, styles.sectionTitle, { color: colors.textSecondary }]}>
        GENERAL & ABOUT
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SettingRow
          icon="notifications-outline"
          title="Meal Reminders"
          value="Enabled"
          onPress={() =>
            Alert.alert('Notifications', 'Meal notifications are scheduled for breakfast, lunch, and dinner.')
          }
        />
        <SettingRow
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() =>
            Alert.alert('Privacy Policy', 'Your personal meal data is securely encrypted and private to your account.')
          }
        />
        <SettingRow
          icon="information-circle-outline"
          title="About NutriTrack AI"
          value="v1.0.0"
        />
      </View>

      {/* Screen 34: Sign Out Modal */}
      <ConfirmationModal
        visible={showSignOutModal}
        title="Sign Out?"
        message="You will need to sign in with your Google account again."
        confirmTitle="Sign Out"
        cancelTitle="Cancel"
        isDestructive
        onConfirm={handleSignOutConfirm}
        onCancel={() => setShowSignOutModal(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    letterSpacing: 0.8,
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
});
