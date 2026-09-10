import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  daysTracked: number;
}

export function StreakCard({ currentStreak, longestStreak, daysTracked }: StreakCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} padding="lg">
      <View style={styles.topRow}>
        <View style={[styles.flameCircle, { backgroundColor: colors.calorieLight }]}>
          <Ionicons name="flame" size={32} color={colors.calorie} />
        </View>
        <View style={styles.streakTextCol}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Current Streak
          </Text>
          <Text style={[Typography.hero, { color: colors.textPrimary }]}>
            {currentStreak}{' '}
            <Text style={[Typography.h3, { color: colors.calorie }]}>DAYS</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.subStatsRow}>
        <View style={styles.subStat}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Longest Streak
          </Text>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>
            {longestStreak} days
          </Text>
        </View>

        <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />

        <View style={styles.subStat}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            This Month
          </Text>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>
            {daysTracked} days tracked
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginBottom: Spacing.base,
  },
  flameCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextCol: {
    flex: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: Spacing.md,
  },
  subStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  subStat: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 30,
  },
});
