import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

const MESSAGES = [
  'Identifying foods & dishes...',
  'Estimating portion sizes...',
  'Calculating calorie density...',
  'Estimating protein and macronutrients...',
  'Finalizing meal breakdown...',
];

interface RotatingMessageProps {
  onComplete?: () => void;
  intervalMs?: number;
}

export function RotatingMessage({ onComplete, intervalMs = 1200 }: RotatingMessageProps) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev < MESSAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 600);
          }
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, onComplete]);

  return (
    <View style={styles.container}>
      <Text style={[Typography.bodyMedium, styles.messageText, { color: colors.textPrimary }]}>
        {MESSAGES[index]}
      </Text>
      <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
        Step {index + 1} of {MESSAGES.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  messageText: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});
