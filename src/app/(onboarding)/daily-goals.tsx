import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCalories, formatGrams, formatNumber } from '../../utils/formatting';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function DailyGoalsScreen() {
  const { colors } = useTheme();
  const { user, updateProfile, completeOnboarding } = useAuth();
  const router = useRouter();

  const [calories, setCalories] = useState(
    String(user?.macroGoals?.calories || 1950)
  );
  const [protein, setProtein] = useState(
    String(user?.macroGoals?.protein || 130)
  );
  const [carbs, setCarbs] = useState(
    String(user?.macroGoals?.carbs || 220)
  );
  const [fat, setFat] = useState(
    String(user?.macroGoals?.fat || 65)
  );

  const handleFinishSetup = () => {
    updateProfile({
      macroGoals: {
        calories: Number(calories) || 1950,
        protein: Number(protein) || 130,
        carbs: Number(carbs) || 220,
        fat: Number(fat) || 65,
      },
    });
    completeOnboarding();
    // Navigate directly into Dashboard
    router.replace('/(tabs)');
  };

  const calNumber = Number(calories) || 1950;
  const pGrams = Number(protein) || 130;
  const cGrams = Number(carbs) || 220;
  const fGrams = Number(fat) || 65;

  // Macro calorie sum check
  const calculatedKcal = pGrams * 4 + cGrams * 4 + fGrams * 9;

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            Step 5 of 5
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Daily Targets Setup
          </Text>
        </View>
        <ProgressBar progress={1.0} color={colors.accent} height={6} />
      </View>

      <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
        Confirm Daily Targets
      </Text>
      <Text style={[Typography.body, styles.subtitle, { color: colors.textSecondary }]}>
        Review your recommended daily energy and macronutrient splits. You can fine-tune these anytime in Settings.
      </Text>

      {/* Target Breakdown Card */}
      <Card style={styles.overviewCard} padding="lg">
        <View style={styles.calorieRow}>
          <View>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Daily Calorie Target
            </Text>
            <Text style={[Typography.numberLarge, { color: colors.calorie }]}>
              {formatNumber(calNumber)}{' '}
              <Text style={[Typography.h3, { color: colors.calorie }]}>kcal</Text>
            </Text>
          </View>
          <View style={[styles.iconCircle, { backgroundColor: colors.calorieLight }]}>
            <Ionicons name="flame" size={28} color={colors.calorie} />
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.macrosRow}>
          <View style={styles.macroCol}>
            <Text style={[Typography.caption, { color: colors.protein }]}>Protein</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {pGrams}g
            </Text>
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
              {Math.round(((pGrams * 4) / (calculatedKcal || 1)) * 100)}%
            </Text>
          </View>

          <View style={styles.macroCol}>
            <Text style={[Typography.caption, { color: colors.carbs }]}>Carbs</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {cGrams}g
            </Text>
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
              {Math.round(((cGrams * 4) / (calculatedKcal || 1)) * 100)}%
            </Text>
          </View>

          <View style={styles.macroCol}>
            <Text style={[Typography.caption, { color: colors.fat }]}>Fat</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {fGrams}g
            </Text>
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
              {Math.round(((fGrams * 9) / (calculatedKcal || 1)) * 100)}%
            </Text>
          </View>
        </View>
      </Card>

      {/* Editable Inputs Section */}
      <Card style={styles.editCard} padding="lg">
        <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
          Adjust Targets Manually
        </Text>

        <Input
          label="Daily Calorie Goal"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          unit="kcal"
        />

        <Input
          label="Daily Protein Goal"
          value={protein}
          onChangeText={setProtein}
          keyboardType="numeric"
          unit="grams"
        />

        <View style={styles.rowInputs}>
          <View style={{ flex: 1 }}>
            <Input
              label="Carbohydrates"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
              unit="g"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Healthy Fat"
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
              unit="g"
            />
          </View>
        </View>
      </Card>

      <View style={styles.footer}>
        <Button
          title="Finish Setup & Go to Dashboard"
          onPress={handleFinishSetup}
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
  overviewCard: {
    marginBottom: Spacing.lg,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroCol: {
    alignItems: 'center',
  },
  editCard: {
    marginBottom: Spacing.lg,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footer: {
    marginTop: Spacing.base,
  },
});
