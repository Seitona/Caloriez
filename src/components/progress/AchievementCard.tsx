import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Achievement } from '../../types/history';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { colors } = useTheme();

  return (
    <Card
      style={[
        styles.card,
        !achievement.unlocked && { opacity: 0.75 },
      ]}
      padding="md"
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: achievement.unlocked
                ? colors.accentLight
                : colors.surfaceSecondary,
            },
          ]}
        >
          <Ionicons
            name={achievement.icon as any}
            size={22}
            color={achievement.unlocked ? colors.accent : colors.textSecondary}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
              {achievement.title}
            </Text>
            {achievement.unlocked ? (
              <Text style={[Typography.tiny, { color: colors.accent, fontWeight: '700' }]}>
                UNLOCKED
              </Text>
            ) : (
              <Ionicons name="lock-closed" size={14} color={colors.textSecondary} />
            )}
          </View>

          <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            {achievement.description}
          </Text>

          {achievement.progress ? (
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={achievement.progress.current / achievement.progress.total}
                color={colors.accent}
                height={5}
              />
              <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 3 }]}>
                {achievement.progress.current} / {achievement.progress.total}
              </Text>
            </View>
          ) : achievement.unlockedDate ? (
            <Text style={[Typography.tiny, { color: colors.textSecondary, marginTop: 4 }]}>
              Achieved on {achievement.unlockedDate}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    marginTop: Spacing.xs,
  },
});
