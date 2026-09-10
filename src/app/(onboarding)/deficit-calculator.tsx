import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DeficitType } from '../../types/nutrition';
import { calculateBMR, calculateDeficit, calculateTDEE } from '../../utils/calculations';
import { formatNumber } from '../../utils/formatting';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function DeficitCalculatorScreen() {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [deficitType, setDeficitType] = useState<DeficitType>('moderate');
  const [customDeficitVal, setCustomDeficitVal] = useState('350');

  // Calculate live numbers based on user's entered metrics
  const weightKg = user?.weightKg || 76;
  const heightCm = user?.heightCm || 175;
  const age = user?.age || 28;
  const sex = user?.sex || 'male';
  const activity = user?.activityLevel || 'moderate';

  const bmr = useMemo(() => calculateBMR(weightKg, heightCm, age, sex), [weightKg, heightCm, age, sex]);
  const tdee = useMemo(() => calculateTDEE(bmr, activity), [bmr, activity]);

  const deficitCalc = useMemo(() => {
    return calculateDeficit(
      tdee,
      deficitType,
      deficitType === 'custom' ? Number(customDeficitVal) || 0 : 0,
      bmr
    );
  }, [tdee, deficitType, customDeficitVal, bmr]);

  const handleContinue = () => {
    // Save target calories and carry over to daily goals setup
    updateProfile({
      macroGoals: {
        calories: deficitCalc.targetCalories,
        protein: user?.macroGoals?.protein || 130,
        carbs: user?.macroGoals?.carbs || 220,
        fat: user?.macroGoals?.fat || 65,
      },
    });

    router.push('/(onboarding)/daily-goals');
  };

  const presets: { id: DeficitType; title: string; subtitle: string; tag: string }[] = [
    {
      id: 'maintain',
      title: 'Maintain Weight',
      subtitle: '0 kcal deficit • Maintain current weight',
      tag: '0 kg/wk',
    },
    {
      id: 'mild',
      title: 'Mild Deficit',
      subtitle: '-250 kcal/day • Steady and easy to sustain',
      tag: '~0.23 kg/wk',
    },
    {
      id: 'moderate',
      title: 'Moderate Deficit',
      subtitle: '-500 kcal/day • Optimal fat loss pacing',
      tag: '~0.45 kg/wk',
    },
    {
      id: 'custom',
      title: 'Custom Deficit',
      subtitle: 'Choose your own daily calorie reduction',
      tag: 'Custom',
    },
  ];

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Step Header */}
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            Step 4 of 5
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Calorie Deficit Calculator
          </Text>
        </View>
        <ProgressBar progress={0.8} color={colors.accent} height={6} />
      </View>

      <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
        Your Energy Targets
      </Text>
      <Text style={[Typography.body, styles.subtitle, { color: colors.textSecondary }]}>
        Calculated using scientific metabolic formulas based on your personal metrics.
      </Text>

      {/* Main Calculation Summary Card */}
      <Card style={styles.summaryCard} padding="lg">
        <View style={styles.topStatsRow}>
          <View style={styles.statCol}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Estimated Maintenance
            </Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {formatNumber(deficitCalc.tdee)}{' '}
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>kcal/day</Text>
            </Text>
          </View>

          <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />

          <View style={styles.statCol}>
            <Text style={[Typography.caption, { color: colors.accent }]}>
              Recommended Target
            </Text>
            <Text style={[Typography.h2, { color: colors.accent }]}>
              {formatNumber(deficitCalc.targetCalories)}{' '}
              <Text style={[Typography.caption, { color: colors.accent }]}>kcal/day</Text>
            </Text>
          </View>
        </View>

        <View style={[styles.horizontalLine, { backgroundColor: colors.border }]} />

        <View style={styles.bottomStatsRow}>
          <View style={styles.bottomStat}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Daily Deficit
            </Text>
            <Text style={[Typography.bodySemiBold, { color: colors.calorie }]}>
              {deficitCalc.dailyDeficit > 0 ? `-${deficitCalc.dailyDeficit} kcal` : '0 kcal'}
            </Text>
          </View>

          <View style={styles.bottomStat}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Weekly Deficit
            </Text>
            <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
              {formatNumber(deficitCalc.weeklyDeficit)} kcal
            </Text>
          </View>

          <View style={styles.bottomStat}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Est. Weekly Change
            </Text>
            <Text style={[Typography.bodySemiBold, { color: colors.accent }]}>
              ~{deficitCalc.estimatedWeeklyWeightChangeKg} kg/wk
            </Text>
          </View>
        </View>
      </Card>

      {/* Deficit Presets */}
      <Text style={[Typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
        Select Deficit Strategy
      </Text>

      <View style={styles.presetsList}>
        {presets.map((preset) => {
          const isSelected = deficitType === preset.id;
          return (
            <Card
              key={preset.id}
              style={[
                styles.presetCard,
                isSelected && {
                  borderColor: colors.accent,
                  borderWidth: 2,
                  backgroundColor: colors.surface,
                },
              ]}
              padding="md"
              onPress={() => setDeficitType(preset.id)}
            >
              <View style={styles.presetRow}>
                <View style={styles.presetInfo}>
                  <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
                    {preset.title}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {preset.subtitle}
                  </Text>
                </View>
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: isSelected
                        ? colors.accentLight
                        : colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      Typography.tiny,
                      { color: isSelected ? colors.accent : colors.textSecondary, fontWeight: '700' },
                    ]}
                  >
                    {preset.tag}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Custom Deficit Input if selected */}
      {deficitType === 'custom' ? (
        <Card style={styles.customCard} padding="md">
          <Input
            label="Custom Daily Deficit (kcal)"
            value={customDeficitVal}
            onChangeText={setCustomDeficitVal}
            keyboardType="numeric"
            placeholder="e.g. 350"
            unit="kcal/day"
          />
        </Card>
      ) : null}

      {/* Safety Information Box */}
      <Card style={styles.safetyCard} padding="md">
        <View style={styles.safetyRow}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <View style={styles.safetyText}>
            <Text style={[Typography.captionMedium, { color: colors.textPrimary }]}>
              Health & Safety Notice
            </Text>
            <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 2, lineHeight: 16 }]}>
              Calorie targets are estimates based on standard metabolic formulas. Individual metabolism, body composition, and thermal effect of food vary. Targets do not constitute medical advice.
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.footer}>
        <Button
          title="Review Daily Macro Goals"
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
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  topStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
  },
  verticalLine: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.sm,
  },
  horizontalLine: {
    height: 1,
    marginVertical: Spacing.md,
  },
  bottomStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomStat: {
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  presetsList: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  presetCard: {
    marginBottom: Spacing.xs,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  presetInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  tagBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  customCard: {
    marginBottom: Spacing.md,
  },
  safetyCard: {
    marginBottom: Spacing.base,
  },
  safetyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  safetyText: {
    flex: 1,
  },
  footer: {
    marginTop: Spacing.base,
  },
});
