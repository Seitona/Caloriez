import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface GoalStatsProps {
  calorieGoalRate: number;
  proteinGoalRate: number;
}

export function GoalStats({ calorieGoalRate, proteinGoalRate }: GoalStatsProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} padding="lg">
      <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
        Overall Goal Completion
      </Text>

      <View style={styles.metricBlock}>
        <View style={styles.metricLabelRow}>
          <Text style={[Typography.bodyMedium, { color: colors.textPrimary }]}>
            Calorie Deficit Target
          </Text>
          <Text style={[Typography.bodySemiBold, { color: colors.calorie }]}>
            {calorieGoalRate}%
          </Text>
        </View>
        <ProgressBar
          progress={calorieGoalRate / 100}
          color={colors.calorie}
          height={8}
        />
      </View>

      <View style={styles.metricBlock}>
        <View style={styles.metricLabelRow}>
          <Text style={[Typography.bodyMedium, { color: colors.textPrimary }]}>
            Daily Protein Target
          </Text>
          <Text style={[Typography.bodySemiBold, { color: colors.protein }]}>
            {proteinGoalRate}%
          </Text>
        </View>
        <ProgressBar
          progress={proteinGoalRate / 100}
          color={colors.protein}
          height={8}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
  },
  metricBlock: {
    marginBottom: Spacing.md,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
});
