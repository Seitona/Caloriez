import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { WeekLog } from '../../types/history';
import { Card } from '../common/Card';

interface WeekChartProps {
  weekLog: WeekLog;
}

export function WeekChart({ weekLog }: WeekChartProps) {
  const { colors } = useTheme();

  // Max calorie for scaling bar heights
  const maxCalories = Math.max(...weekLog.days.map((d) => d.calories), 2400);

  return (
    <View style={styles.container}>
      {/* Overview Cards */}
      <View style={styles.overviewGrid}>
        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Avg Calories
          </Text>
          <Text style={[Typography.numberMedium, { color: colors.calorie }]}>
            {weekLog.averageCalories}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>kcal / day</Text>
        </Card>

        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Avg Protein
          </Text>
          <Text style={[Typography.numberMedium, { color: colors.protein }]}>
            {weekLog.averageProtein}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>g / day</Text>
        </Card>
      </View>

      <View style={styles.overviewGrid}>
        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Calorie Goal
          </Text>
          <Text style={[Typography.h2, { color: colors.accent }]}>
            {weekLog.calorieDaysMet} / {weekLog.totalDays}{' '}
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>days</Text>
          </Text>
        </Card>

        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Protein Goal
          </Text>
          <Text style={[Typography.h2, { color: colors.protein }]}>
            {weekLog.proteinDaysMet} / {weekLog.totalDays}{' '}
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>days</Text>
          </Text>
        </Card>
      </View>

      {/* Bar Chart Card */}
      <Card style={styles.chartCard} padding="lg">
        <View style={styles.chartHeader}>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>
            Daily Calorie Adherence
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Target: 1,950 kcal
          </Text>
        </View>

        <View style={styles.chartArea}>
          {/* Target Reference Line */}
          <View
            style={[
              styles.referenceLine,
              {
                bottom: `${(1950 / maxCalories) * 100}%`,
                borderColor: colors.border,
              },
            ]}
          />

          <View style={styles.barsRow}>
            {weekLog.days.map((day) => {
              const heightPercent = day.tracked ? (day.calories / maxCalories) * 100 : 0;
              const barColor = !day.tracked
                ? colors.surfaceSecondary
                : day.calorieGoalReached
                ? colors.accent
                : colors.warning;

              return (
                <View key={day.dayName} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    {day.tracked ? (
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPercent}%`,
                            backgroundColor: barColor,
                          },
                        ]}
                      />
                    ) : (
                      <View style={[styles.emptyIndicator, { backgroundColor: colors.surfaceSecondary }]} />
                    )}
                  </View>
                  <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 6 }]}>
                    {day.dayName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>Within Deficit</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>Over Target</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.surfaceSecondary }]} />
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>Not Tracked</Text>
          </View>
        </View>
      </Card>

      {/* Daily Adherence List */}
      <Card style={styles.adherenceCard} padding="lg">
        <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
          Adherence Log ({weekLog.dateRangeDisplay})
        </Text>

        {weekLog.days.map((day) => {
          let statusText = '—';
          let statusColor = colors.textSecondary;
          if (day.tracked) {
            statusText = day.calorieGoalReached ? '✅ On Target' : '❌ Over Target';
            statusColor = day.calorieGoalReached ? colors.success : colors.danger;
          }

          return (
            <View
              key={day.dayName}
              style={[
                styles.adherenceRow,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
            >
              <View style={styles.dayCol}>
                <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
                  {day.dayName}
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  {day.date}
                </Text>
              </View>

              <View style={styles.intakeCol}>
                {day.tracked ? (
                  <>
                    <Text style={[Typography.bodySemiBold, { color: colors.calorie }]}>
                      {day.calories} kcal
                    </Text>
                    <Text style={[Typography.caption, { color: colors.protein }]}>
                      {day.protein}g protein
                    </Text>
                  </>
                ) : (
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                    No logs
                  </Text>
                )}
              </View>

              <View style={styles.statusCol}>
                <Text style={[Typography.captionMedium, { color: statusColor }]}>
                  {statusText}
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
  overviewGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  chartCard: {
    marginBottom: Spacing.base,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  chartArea: {
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  referenceLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    zIndex: 2,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 22,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.xs,
  },
  emptyIndicator: {
    width: 8,
    height: 4,
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.base,
    paddingTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  adherenceCard: {
    marginBottom: Spacing.lg,
  },
  adherenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  dayCol: {
    width: 70,
  },
  intakeCol: {
    flex: 1,
    alignItems: 'center',
  },
  statusCol: {
    width: 100,
    alignItems: 'flex-end',
  },
});
