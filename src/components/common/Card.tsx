import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BorderRadius, Shadows, Spacing } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  bordered?: boolean;
  padding?: keyof typeof Spacing;
  highlightBorderColor?: string;
}

export function Card({
  children,
  style,
  onPress,
  bordered = true,
  padding = 'base',
  highlightBorderColor,
}: CardProps) {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing[padding],
    borderColor: highlightBorderColor || (bordered ? colors.border : 'transparent'),
    borderWidth: bordered || highlightBorderColor ? 1 : 0,
    ...(isDark ? {} : Shadows.sm),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.base, containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, containerStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
