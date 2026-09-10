import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

interface ConfidenceBadgeProps {
  confidence: number; // 0 to 1
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const { colors, isDark } = useTheme();
  const percentage = Math.round(confidence * 100);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(52, 211, 153, 0.15)' : '#ECFDF5',
          borderColor: colors.accent,
        },
      ]}
    >
      <Ionicons name="sparkles" size={14} color={colors.accent} />
      <Text style={[Typography.tiny, { color: colors.accent, fontWeight: '700', marginLeft: 4 }]}>
        AI Confidence: {percentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
