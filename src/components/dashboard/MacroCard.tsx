import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface MacroItemProps {
  label: string;
  consumed: number;
  target: number;
  remaining: number;
  progress: number;
  color: string;
  lightBg: string;
  icon?: React.ReactNode;
}

export function MacroItem({
  label,
  consumed,
  target,
  remaining,
  progress,
  color,
  lightBg,
  icon,
}: MacroItemProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.macroCard} padding="md">
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: lightBg }]}>
            {icon}
          </View>
          <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
            {label}
          </Text>
        </View>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          {remaining > 0 ? `${remaining}g left` : 'Met'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={[Typography.h3, { color: colors.textPrimary }]}>
          {consumed}
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            {' '}/ {target}g
          </Text>
        </Text>
        <Text style={[Typography.tiny, { color, fontWeight: '700' }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        color={color}
        height={6}
        style={styles.progressBar}
      />
    </Card>
  );
}

interface MacroRowProps {
  carbsConsumed: number;
  carbsTarget: number;
  carbsRemaining: number;
  carbsProgress: number;
  fatConsumed: number;
  fatTarget: number;
  fatRemaining: number;
  fatProgress: number;
}

export function MacroRow({
  carbsConsumed,
  carbsTarget,
  carbsRemaining,
  carbsProgress,
  fatConsumed,
  fatTarget,
  fatRemaining,
  fatProgress,
}: MacroRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <MacroItem
          label="Carbohydrates"
          consumed={carbsConsumed}
          target={carbsTarget}
          remaining={carbsRemaining}
          progress={carbsProgress}
          color={colors.carbs}
          lightBg={colors.carbsLight}
          icon={<Text style={{ fontSize: 13 }}>🌾</Text>}
        />
      </View>
      <View style={styles.col}>
        <MacroItem
          label="Healthy Fat"
          consumed={fatConsumed}
          target={fatTarget}
          remaining={fatRemaining}
          progress={fatProgress}
          color={colors.fat}
          lightBg={colors.fatLight}
          icon={<Text style={{ fontSize: 13 }}>🥑</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  col: {
    flex: 1,
  },
  macroCard: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginVertical: Spacing.xs,
  },
  progressBar: {
    marginTop: 2,
  },
});
