import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

interface SettingRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export function SettingRow({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  onPress,
  showChevron = true,
  destructive = false,
}: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {icon ? (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: destructive
                ? 'rgba(239, 68, 68, 0.1)'
                : colors.surfaceSecondary,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={destructive ? colors.danger : iconColor || colors.textPrimary}
          />
        </View>
      ) : null}

      <View style={styles.textContainer}>
        <Text
          style={[
            Typography.bodyMedium,
            { color: destructive ? colors.danger : colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text style={[Typography.body, { color: colors.textSecondary, marginRight: Spacing.xs }]}>
          {value}
        </Text>
      ) : null}

      {showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
});
