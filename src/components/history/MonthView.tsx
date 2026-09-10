import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { MonthLog } from '../../types/history';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface MonthViewProps {
  monthLog: MonthLog;
}

export function MonthView({ monthLog }: MonthViewProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Month Title & Streak */}
      <View style={styles.monthHeader}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>
          {monthLog.monthName} {monthLog.year}
        </Text>
        <View style={[styles.streakPill, { backgroundColor: colors.accentLight }]}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            🔥 {monthLog.currentStreak} Day Streak
          </Text>
        </View>
      </View>

      {/* Goal Success Metrics */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard} padding="lg">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Calorie Goal Success
          </Text>
          <Text style={[Typography.numberLarge, { color: colors.accent }]}>
            {monthLog.calorieSuccessRate}%
          </Text>
          <ProgressBar
            progress={monthLog.calorieSuccessRate / 100}
            color={colors.accent}
            height={6}
            style={styles.metricBar}
          />
          <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 4 }]}>
            Target: ≤ 1,950 kcal
          </Text>
        </Card>

        <Card style={styles.metricCard} padding="lg">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Protein Goal Success
          </Text>
          <Text style={[Typography.numberLarge, { color: colors.protein }]}>
            {monthLog.proteinSuccessRate}%
          </Text>
          <ProgressBar
            progress={monthLog.proteinSuccessRate / 100}
            color={colors.protein}
            height={6}
            style={styles.metricBar}
          />
          <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 4 }]}>
            Target: ≥ 130 g
          </Text>
        </Card>
      </View>

      {/* Averages & Days Tracked */}
      <View style={styles.statsGrid}>
        <Card style={styles.smallStat} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Average Calories
          </Text>
          <Text style={[Typography.h2, { color: colors.calorie }]}>
            {monthLog.averageCalories}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>kcal / day</Text>
        </Card>

        <Card style={styles.smallStat} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Average Protein
          </Text>
          <Text style={[Typography.h2, { color: colors.protein }]}>
            {monthLog.averageProtein}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>grams / day</Text>
        </Card>

        <Card style={styles.smallStat} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Days Tracked
          </Text>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>
            {monthLog.daysTracked}{' '}
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              / {monthLog.totalDaysInMonth}
            </Text>
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
            {Math.round((monthLog.daysTracked / monthLog.totalDaysInMonth) * 100)}% consistency
          </Text>
        </Card>
      </View>

      {/* Weekly Breakdown Chart / Progression */}
      <Card style={styles.weeklyCard} padding="lg">
        <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
          Weekly Intake Progression
        </Text>

        {monthLog.weeklyAverages.map((wk, idx) => {
          const calorieRatio = Math.min(1, wk.calories / 2200);
          return (
            <View key={wk.week} style={styles.weekRow}>
              <View style={styles.weekLabelCol}>
                <Text style={[Typography.bodyMedium, { color: colors.textPrimary }]}>
                  {wk.week}
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  {wk.protein}g protein avg
                </Text>
              </View>

              <View style={styles.weekBarCol}>
                <ProgressBar
                  progress={calorieRatio}
                  color={wk.calories <= 1950 ? colors.accent : colors.warning}
                  height={8}
                />
                <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 3 }]}>
                  {wk.calories} kcal/day
                </Text>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  streakPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  metricCard: {
    flex: 1,
  },
  metricBar: {
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  smallStat: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyCard: {
    marginBottom: Spacing.lg,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
  },
  weekLabelCol: {
    flex: 1,
  },
  weekBarCol: {
    width: 140,
    alignItems: 'flex-end',
  },
});
