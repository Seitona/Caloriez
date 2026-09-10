import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ActivityLevel } from '../../types/user';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function ActivityLevelScreen() {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.activityLevel || 'moderate'
  );

  const activities: {
    id: ActivityLevel;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      id: 'sedentary',
      title: 'Sedentary',
      description: 'Mostly seated throughout the day with little structured exercise.',
      icon: 'desktop-outline',
    },
    {
      id: 'light',
      title: 'Lightly Active',
      description: 'Light exercise or active lifestyle 1–3 days per week.',
      icon: 'walk-outline',
    },
    {
      id: 'moderate',
      title: 'Moderately Active',
      description: 'Moderate workouts or sustained movement 3–5 days per week.',
      icon: 'bicycle-outline',
    },
    {
      id: 'very',
      title: 'Very Active',
      description: 'Hard workouts, weight lifting, or sports 6–7 days per week.',
      icon: 'barbell-outline',
    },
    {
      id: 'extra',
      title: 'Extra Active',
      description: 'Intense daily training, physical job, or dual daily sessions.',
      icon: 'flame-outline',
    },
  ];

  const handleContinue = () => {
    updateProfile({ activityLevel });
    router.push('/(onboarding)/deficit-calculator');
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            Step 3 of 5
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Daily Activity
          </Text>
        </View>
        <ProgressBar progress={0.6} color={colors.accent} height={6} />
      </View>

      <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
        How active are you?
      </Text>
      <Text style={[Typography.body, styles.subtitle, { color: colors.textSecondary }]}>
        This is factored into calculating your Total Daily Energy Expenditure (TDEE).
      </Text>

      {/* Activity Options List */}
      <View style={styles.cardsList}>
        {activities.map((act) => {
          const isSelected = activityLevel === act.id;
          return (
            <Card
              key={act.id}
              style={[
                styles.activityCard,
                isSelected && {
                  borderColor: colors.accent,
                  borderWidth: 2,
                  backgroundColor: colors.surface,
                },
              ]}
              padding="md"
              onPress={() => setActivityLevel(act.id)}
            >
              <View style={styles.row}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isSelected
                        ? colors.accentLight
                        : colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={act.icon}
                    size={22}
                    color={isSelected ? colors.accent : colors.textSecondary}
                  />
                </View>

                <View style={styles.textCol}>
                  <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
                    {act.title}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {act.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? colors.accent : colors.border,
                      backgroundColor: isSelected ? colors.accent : 'transparent',
                    },
                  ]}
                >
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title="Calculate Calorie Targets"
          onPress={handleContinue}
          size="lg"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
  },
  cardsList: {
    gap: Spacing.xs,
  },
  activityCard: {
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    marginTop: Spacing.xl,
  },
});
