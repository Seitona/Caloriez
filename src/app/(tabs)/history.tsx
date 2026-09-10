import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { DaySummary } from '../../components/history/DaySummary';
import { MonthView } from '../../components/history/MonthView';
import { WeekChart } from '../../components/history/WeekChart';
import { YearTrendChart } from '../../components/history/YearTrendChart';

type HistoryPeriod = 'day' | 'week' | 'month' | 'year';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { dayLogs, selectedDate, setSelectedDate, weekLog, monthLog, yearLog } = useNutrition();
  const [period, setPeriod] = useState<HistoryPeriod>('day');

  const periodOptions: { value: HistoryPeriod; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>
          Nutrition History
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          Track your trends, adherence, and long-term habits.
        </Text>
      </View>

      {/* Segmented Period Switcher */}
      <View style={styles.switcherContainer}>
        <SegmentedControl
          options={periodOptions}
          selectedValue={period}
          onSelect={setPeriod}
        />
      </View>

      {/* Views according to selected period */}
      {period === 'day' && (
        <DaySummary
          dayLogs={dayLogs}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {period === 'week' && <WeekChart weekLog={weekLog} />}

      {period === 'month' && <MonthView monthLog={monthLog} />}

      {period === 'year' && <YearTrendChart yearLog={yearLog} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  switcherContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
});
