import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'calorie' | 'protein' | 'carbs' | 'fat' | 'neutral';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ label, variant = 'neutral', icon, style, textStyle }: BadgeProps) {
  const { colors, isDark } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'accent':
      case 'success':
        return {
          bg: isDark ? 'rgba(52, 211, 153, 0.2)' : '#ECFDF5',
          text: colors.success,
        };
      case 'warning':
        return {
          bg: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7',
          text: colors.warning,
        };
      case 'danger':
        return {
          bg: isDark ? 'rgba(248, 113, 113, 0.2)' : '#FEE2E2',
          text: colors.danger,
        };
      case 'calorie':
        return {
          bg: isDark ? 'rgba(251, 146, 60, 0.2)' : '#FFF7ED',
          text: colors.calorie,
        };
      case 'protein':
        return {
          bg: isDark ? 'rgba(96, 165, 250, 0.2)' : '#EFF6FF',
          text: colors.protein,
        };
      case 'carbs':
        return {
          bg: isDark ? 'rgba(250, 204, 21, 0.2)' : '#FEFCE8',
          text: colors.carbs,
        };
      case 'fat':
        return {
          bg: isDark ? 'rgba(167, 139, 250, 0.2)' : '#F5F3FF',
          text: colors.fat,
        };
      case 'neutral':
      default:
        return {
          bg: colors.surfaceSecondary,
          text: colors.textSecondary,
        };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <Text style={[Typography.tiny, { color: text, fontWeight: '600' }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
});
