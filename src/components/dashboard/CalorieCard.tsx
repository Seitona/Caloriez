import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { formatNumber } from '../../utils/formatting';
import { Card } from '../common/Card';
import { ProgressRing } from '../common/ProgressRing';

interface CalorieCardProps {
  goal: number;
  consumed: number;
  remaining: number;
  progress: number;
}

export function CalorieCard({ goal, consumed, remaining, progress }: CalorieCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} padding="lg">
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.calorieLight }]}>
            <Ionicons name="flame" size={18} color={colors.calorie} />
          </View>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>Calories</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
            Goal: {formatNumber(goal)} kcal
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <ProgressRing
          progress={progress}
          size={190}
          strokeWidth={14}
          color={colors.calorie}
        >
          <View style={styles.ringCenter}>
            <Text style={[Typography.numberLarge, { color: colors.textPrimary }]}>
              {formatNumber(remaining)}
            </Text>
            <Text style={[Typography.tiny, styles.unitText, { color: colors.calorie }]}>
              KCAL REMAINING
            </Text>
          </View>
        </ProgressRing>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>Consumed</Text>
            <Text style={[Typography.h3, { color: colors.textPrimary }]}>
              {formatNumber(consumed)} <Text style={[Typography.caption, { color: colors.textSecondary }]}>kcal</Text>
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statItem}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>Remaining</Text>
            <Text style={[Typography.h3, { color: colors.calorie }]}>
              {formatNumber(remaining)} <Text style={[Typography.caption, { color: colors.calorie }]}>kcal</Text>
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statItem}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>Daily Goal</Text>
            <Text style={[Typography.h3, { color: colors.textPrimary }]}>
              {formatNumber(goal)} <Text style={[Typography.caption, { color: colors.textSecondary }]}>kcal</Text>
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  content: {
    alignItems: 'center',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: {
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 30,
  },
});
