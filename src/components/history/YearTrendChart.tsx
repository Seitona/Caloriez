import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { YearLog } from '../../types/history';
import { Card } from '../common/Card';
import { SegmentedControl } from '../common/SegmentedControl';

interface YearTrendChartProps {
  yearLog: YearLog;
}

type TrendMetric = 'calories' | 'protein' | 'goals';

export function YearTrendChart({ yearLog }: YearTrendChartProps) {
  const { colors } = useTheme();
  const [metric, setMetric] = useState<TrendMetric>('calories');

  const metricOptions = [
    { value: 'calories' as const, label: 'Calories' },
    { value: 'protein' as const, label: 'Protein' },
    { value: 'goals' as const, label: 'Goal %' },
  ];

  const getMetricValue = (month: typeof yearLog.months[0]) => {
    switch (metric) {
      case 'calories':
        return month.averageCalories;
      case 'protein':
        return month.averageProtein;
      case 'goals':
        return month.successRate;
    }
  };

  const getMetricMax = () => {
    switch (metric) {
      case 'calories':
        return 2200;
      case 'protein':
        return 150;
      case 'goals':
        return 100;
    }
  };

  const getMetricColor = () => {
    switch (metric) {
      case 'calories':
        return colors.calorie;
      case 'protein':
        return colors.protein;
      case 'goals':
        return colors.accent;
    }
  };

  const getUnitSuffix = () => {
    switch (metric) {
      case 'calories':
        return 'kcal';
      case 'protein':
        return 'g';
      case 'goals':
        return '%';
    }
  };

  const maxVal = getMetricMax();
  const barColor = getMetricColor();

  return (
    <View style={styles.container}>
      {/* High-level year summaries */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Consistency
          </Text>
          <Text style={[Typography.numberMedium, { color: colors.accent }]}>
            {yearLog.overallConsistencyRate}%
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
            {yearLog.totalDaysTracked} days logged
          </Text>
        </Card>

        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Yearly Avg Calories
          </Text>
          <Text style={[Typography.numberMedium, { color: colors.calorie }]}>
            {yearLog.averageCalories}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>kcal / day</Text>
        </Card>

        <Card style={styles.statCard} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Yearly Avg Protein
          </Text>
          <Text style={[Typography.numberMedium, { color: colors.protein }]}>
            {yearLog.averageProtein}
          </Text>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>g / day</Text>
        </Card>
      </View>

      {/* Metric Switcher */}
      <SegmentedControl
        options={metricOptions}
        selectedValue={metric}
        onSelect={(m) => setMetric(m)}
        style={styles.segmented}
      />

      {/* Trend Chart Card */}
      <Card style={styles.chartCard} padding="lg">
        <View style={styles.chartHeader}>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>
            2026 Monthly Trend
          </Text>
          <Text style={[Typography.captionMedium, { color: barColor }]}>
            Viewing {metric.toUpperCase()}
          </Text>
        </View>

        <View style={styles.chartArea}>
          <View style={styles.barsRow}>
            {yearLog.months.map((month) => {
              const val = getMetricValue(month);
              const heightPercent = val > 0 ? (val / maxVal) * 100 : 0;
              const hasData = val > 0;

              return (
                <View key={month.monthAbbr} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    {hasData ? (
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
                      <View style={[styles.emptyBar, { backgroundColor: colors.surfaceSecondary }]} />
                    )}
                  </View>
                  <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 6 }]}>
                    {month.monthAbbr}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Card>

      {/* Month-by-month table */}
      <Card style={styles.tableCard} padding="lg">
        <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
          Monthly Breakdown
        </Text>

        {yearLog.months
          .filter((m) => m.daysTracked > 0)
          .map((m) => (
            <View
              key={m.monthAbbr}
              style={[styles.tableRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            >
              <Text style={[Typography.bodySemiBold, { color: colors.textPrimary, width: 60 }]}>
                {m.monthAbbr}
              </Text>
              <Text style={[Typography.caption, { color: colors.calorie, flex: 1 }]}>
                {m.averageCalories} kcal
              </Text>
              <Text style={[Typography.caption, { color: colors.protein, flex: 1 }]}>
                {m.averageProtein}g protein
              </Text>
              <Text style={[Typography.captionMedium, { color: colors.accent, width: 70, textAlign: 'right' }]}>
                {m.successRate}% met
              </Text>
            </View>
          ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  segmented: {
    marginBottom: Spacing.base,
  },
  chartCard: {
    marginBottom: Spacing.base,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  chartArea: {
    height: 160,
    justifyContent: 'flex-end',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 16,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.xs,
  },
  emptyBar: {
    width: 6,
    height: 3,
    borderRadius: 1.5,
  },
  tableCard: {
    marginBottom: Spacing.lg,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
});
