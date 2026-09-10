import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Nutrition } from '../../types/nutrition';
import { Card } from '../common/Card';

interface DailySummaryProps {
  nutrition: Nutrition;
  mealsCount: number;
}

export function DailySummary({ nutrition, mealsCount }: DailySummaryProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.container} padding="md">
      <View style={styles.header}>
        <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
          Daily Nutrition Intake
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          {mealsCount} {mealsCount === 1 ? 'meal' : 'meals'} logged
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={[styles.metricBox, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Energy</Text>
          <Text style={[Typography.h3, { color: colors.calorie }]}>
            {Math.round(nutrition.calories)}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>kcal</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Protein</Text>
          <Text style={[Typography.h3, { color: colors.protein }]}>
            {Math.round(nutrition.protein)}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>grams</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Carbs</Text>
          <Text style={[Typography.h3, { color: colors.carbs }]}>
            {Math.round(nutrition.carbs)}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>grams</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Fat</Text>
          <Text style={[Typography.h3, { color: colors.fat }]}>
            {Math.round(nutrition.fat)}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>grams</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metricBox: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
});
