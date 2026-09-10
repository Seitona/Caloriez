import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FitnessGoal } from '../../types/user';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function FitnessGoalScreen() {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(user?.fitnessGoal || 'lose');
  const [targetWeight, setTargetWeight] = useState(
    user?.targetWeightKg ? String(user.targetWeightKg) : '70'
  );
  const [weeklyRate, setWeeklyRate] = useState<number>(user?.weeklyRateKg || 0.5);

  const goals: {
    id: FitnessGoal;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      id: 'lose',
      title: 'Lose Weight',
      description: 'Burn fat and achieve a sustainable calorie deficit',
      icon: 'trending-down-outline',
    },
    {
      id: 'maintain',
      title: 'Maintain Weight',
      description: 'Keep your current weight while optimizing body composition',
      icon: 'fitness-outline',
    },
    {
      id: 'gain',
      title: 'Build Muscle / Gain',
      description: 'Lean surplus to support strength and hypertrophy',
      icon: 'trending-up-outline',
    },
  ];

  const handleContinue = () => {
    updateProfile({
      fitnessGoal,
      targetWeightKg: fitnessGoal === 'lose' ? Number(targetWeight) : user?.weightKg,
      weeklyRateKg: fitnessGoal === 'lose' ? weeklyRate : 0,
    });
    router.push('/(onboarding)/activity');
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Step Header */}
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            Step 2 of 5
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Primary Fitness Goal
          </Text>
        </View>
        <ProgressBar progress={0.4} color={colors.accent} height={6} />
      </View>

      <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
        What is your main goal?
      </Text>
      <Text style={[Typography.body, styles.subtitle, { color: colors.textSecondary }]}>
        Select your objective to help us set the proper energy targets.
      </Text>

      {/* Goal Cards */}
      <View style={styles.cardsList}>
        {goals.map((g) => {
          const isSelected = fitnessGoal === g.id;
          return (
            <Card
              key={g.id}
              style={[
                styles.goalCard,
                isSelected && {
                  borderColor: colors.accent,
                  borderWidth: 2,
                  backgroundColor: colors.surface,
                },
              ]}
              padding="lg"
              onPress={() => setFitnessGoal(g.id)}
            >
              <View style={styles.goalRow}>
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
                    name={g.icon}
                    size={24}
                    color={isSelected ? colors.accent : colors.textSecondary}
                  />
                </View>

                <View style={styles.textCol}>
                  <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                    {g.title}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {g.description}
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

      {/* Conditional: Target Weight & Weekly Rate for Lose Weight */}
      {fitnessGoal === 'lose' ? (
        <Card style={styles.detailsCard} padding="lg">
          <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>
            Target Weight & Pacing
          </Text>

          <Input
            label={`Desired Target Weight (${user?.units === 'imperial' ? 'lbs' : 'kg'})`}
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
            placeholder={user?.units === 'imperial' ? '154' : '70'}
          />

          <Text style={[Typography.captionMedium, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
            Target Weekly Rate
          </Text>
          <View style={styles.rateRow}>
            {[
              { rate: 0.25, label: '0.25 kg/wk\n(Gentle)' },
              { rate: 0.5, label: '0.50 kg/wk\n(Recommended)' },
              { rate: 0.75, label: '0.75 kg/wk\n(Aggressive)' },
            ].map((item) => (
              <TouchableOpacity
                key={item.rate}
                onPress={() => setWeeklyRate(item.rate)}
                style={[
                  styles.rateBtn,
                  {
                    backgroundColor: weeklyRate === item.rate ? colors.surfaceSecondary : colors.surface,
                    borderColor: weeklyRate === item.rate ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    Typography.tiny,
                    {
                      textAlign: 'center',
                      color: weeklyRate === item.rate ? colors.accent : colors.textSecondary,
                      fontWeight: weeklyRate === item.rate ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      ) : null}

      <View style={styles.footer}>
        <Button
          title="Continue to Activity Level"
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
    gap: Spacing.sm,
  },
  goalCard: {
    marginBottom: Spacing.xs,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  detailsCard: {
    marginTop: Spacing.md,
  },
  rateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rateBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: Spacing.xl,
  },
});
