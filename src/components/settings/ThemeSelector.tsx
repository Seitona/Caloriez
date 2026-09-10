import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { ThemeMode, useTheme } from '../../context/ThemeContext';

export function ThemeSelector() {
  const { themeMode, setThemeMode, colors } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'system', label: 'System', icon: 'phone-portrait-outline' },
    { mode: 'light', label: 'Light', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
      {options.map((opt) => {
        const isSelected = themeMode === opt.mode;
        return (
          <TouchableOpacity
            key={opt.mode}
            activeOpacity={0.7}
            onPress={() => setThemeMode(opt.mode)}
            style={[
              styles.optionBtn,
              isSelected && {
                backgroundColor: colors.card,
                borderColor: colors.accent,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons
              name={opt.icon}
              size={18}
              color={isSelected ? colors.accent : colors.textSecondary}
            />
            <Text
              style={[
                Typography.captionMedium,
                {
                  color: isSelected ? colors.textPrimary : colors.textSecondary,
                  fontWeight: isSelected ? '600' : '400',
                  marginTop: 4,
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
});
