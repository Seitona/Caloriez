import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { DayLog } from '../../types/history';
import { Meal } from '../../types/meal';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ProgressBar } from '../common/ProgressBar';
import { MealCard } from '../dashboard/MealCard';

interface DaySummaryProps {
  dayLogs: DayLog[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DaySummary({ dayLogs, selectedDate, onSelectDate }: DaySummaryProps) {
  const { colors } = useTheme();

  if (!dayLogs || dayLogs.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="calendar-outline"
          title="No history recorded yet"
          description="Log your daily meals to start tracking trends, adherence, and streaks."
        />
      </View>
    );
  }

  const currentLog = dayLogs.find((d) => d.date === selectedDate) || dayLogs[0];

  const calorieRatio = currentLog.nutrition.calories / (currentLog.calorieTarget || 1);
  const proteinRatio = currentLog.nutrition.protein / (currentLog.proteinTarget || 1);

  return (
    <View style={styles.container}>
      {/* Horizontal Date Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelector}
      >
        {dayLogs.map((log) => {
          const isSelected = log.date === selectedDate;
          const [year, month, day] = log.date.split('-');
          const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = dateObj.getDate();

          return (
            <TouchableOpacity
              key={log.date}
              activeOpacity={0.7}
              onPress={() => onSelectDate(log.date)}
              style={[
                styles.datePill,
                {
                  backgroundColor: isSelected ? colors.accent : colors.surface,
                  borderColor: isSelected ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  Typography.tiny,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: '600' },
                ]}
              >
                {dayName}
              </Text>
              <Text
                style={[
                  Typography.h3,
                  { color: isSelected ? '#FFFFFF' : colors.textPrimary, marginTop: 2 },
                ]}
              >
                {dayNumber}
              </Text>
              {log.goalReached ? (
                <View
                  style={[
                    styles.indicatorDot,
                    { backgroundColor: isSelected ? '#FFFFFF' : colors.success },
                  ]}
                />
              ) : (
                <View style={[styles.indicatorDot, { backgroundColor: 'transparent' }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Day Stats Card */}
      <Card style={styles.summaryCard} padding="lg">
        <View style={styles.cardHeader}>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>
            {currentLog.displayDate}
          </Text>
          {currentLog.goalReached ? (
            <Badge label="Goal Reached ✅" variant="success" />
          ) : (
            <Badge label="Over Target ⚠️" variant="warning" />
          )}
        </View>

        {/* Calories Progress */}
        <View style={styles.statBlock}>
          <View style={styles.labelRow}>
            <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
              Calories
            </Text>
            <Text style={[Typography.bodySemiBold, { color: colors.calorie }]}>
              {currentLog.nutrition.calories}{' '}
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                / {currentLog.calorieTarget} kcal
              </Text>
            </Text>
          </View>
          <ProgressBar
            progress={calorieRatio}
            color={colors.calorie}
            height={8}
            style={styles.bar}
          />
        </View>

        {/* Protein Progress */}
        <View style={styles.statBlock}>
          <View style={styles.labelRow}>
            <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
              Protein
            </Text>
            <Text style={[Typography.bodySemiBold, { color: colors.protein }]}>
              {currentLog.nutrition.protein}{' '}
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                / {currentLog.proteinTarget} g
              </Text>
            </Text>
          </View>
          <ProgressBar
            progress={proteinRatio}
            color={colors.protein}
            height={8}
            style={styles.bar}
          />
        </View>

        {/* Macro breakdown summary */}
        <View style={[styles.macroRow, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Carbohydrates: {currentLog.nutrition.carbs}g
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Fat: {currentLog.nutrition.fat}g
          </Text>
        </View>
      </Card>

      {/* Meals Logged on this Day */}
      <View style={styles.mealsHeader}>
        <Text style={[Typography.h3, { color: colors.textPrimary }]}>
          Meals Consumed ({currentLog.meals.length})
        </Text>
      </View>

      {currentLog.meals.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No meals logged"
          description="Start tracking today's meals to see your history here."
        />
      ) : (
        currentLog.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  dateSelector: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  datePill: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 54,
  },
  indicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
  summaryCard: {
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  statBlock: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  bar: {
    marginTop: 2,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  mealsHeader: {
    paddingHorizontal: Spacing.base,
    marginVertical: Spacing.sm,
  },
});
