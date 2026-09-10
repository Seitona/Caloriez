import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface ProteinCardProps {
  goal: number;
  consumed: number;
  remaining: number;
  progress: number;
}

export function ProteinCard({ goal, consumed, remaining, progress }: ProteinCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} padding="lg">
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.proteinLight }]}>
            <Ionicons name="barbell" size={18} color={colors.protein} />
          </View>
          <View>
            <Text style={[Typography.h3, { color: colors.textPrimary }]}>Protein</Text>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              {remaining > 0 ? `${remaining} g remaining` : 'Target reached! 🎉'}
            </Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[Typography.numberMedium, { color: colors.protein }]}>
            {consumed}
            <Text style={[Typography.bodyMedium, { color: colors.textSecondary }]}>
              {' '}/ {goal} g
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          color={colors.protein}
          height={10}
        />
        <View style={styles.footerRow}>
          <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
            {Math.round(progress * 100)}% achieved
          </Text>
          <Text style={[Typography.tiny, { color: colors.protein, fontWeight: '600' }]}>
            {remaining} g left
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    marginTop: Spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
});
