import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AchievementCard } from '../../components/progress/AchievementCard';
import { GoalStats } from '../../components/progress/GoalStats';
import { StreakCard } from '../../components/progress/StreakCard';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const {
    currentStreak,
    longestStreak,
    daysTrackedCount,
    achievements,
    monthLog,
  } = useNutrition();

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>
          Progress & Streaks
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          Consistency is key to sustainable body composition.
        </Text>
      </View>

      {/* Streak Summary */}
      <StreakCard
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        daysTracked={daysTrackedCount}
      />

      {/* Goal Stats Percentages */}
      <GoalStats
        calorieGoalRate={monthLog.calorieSuccessRate}
        proteinGoalRate={monthLog.proteinSuccessRate}
      />

      {/* Achievements Section */}
      <View style={styles.achievementsHeader}>
        <Text style={[Typography.h2, { color: colors.textPrimary }]}>
          Habit Milestones
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
        </Text>
      </View>

      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
});
