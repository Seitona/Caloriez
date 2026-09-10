import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon = 'restaurant-outline',
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSecondary }]}>
        <Ionicons name={icon} size={36} color={colors.textSecondary} />
      </View>
      <Text style={[Typography.h3, styles.title, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[Typography.body, styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
      {actionTitle && onAction ? (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
          style={styles.actionButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
  },
  actionButton: {
    marginTop: Spacing.base,
  },
});
