import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  unit?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  unit,
  error,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[Typography.captionMedium, styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            Typography.body,
            { color: colors.textPrimary },
            style,
          ]}
          {...rest}
        />
        {unit ? (
          <Text style={[Typography.captionMedium, styles.unit, { color: colors.textSecondary }]}>
            {unit}
          </Text>
        ) : null}
      </View>
      {error ? (
        <Text style={[Typography.tiny, styles.error, { color: colors.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  unit: {
    marginLeft: Spacing.sm,
  },
  error: {
    marginTop: 4,
  },
});
