import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name = 'User', size = 42 }: AvatarProps) {
  const { colors } = useTheme();

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.border,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.surfaceSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      {initials ? (
        <Text style={[Typography.captionMedium, { color: colors.textPrimary, fontWeight: '700' }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color={colors.textSecondary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 1.5,
  },
  fallback: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
