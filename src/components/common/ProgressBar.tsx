import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 1 (or can exceed 1)
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color,
  trackColor,
  height = 8,
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const barColor = color || colors.accent;
  const bgTrack = trackColor || colors.surfaceSecondary;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: bgTrack,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: barColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
