import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { sampleAIMealScans } from '../../data/mockMeals';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function PhotoReviewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ sampleIndex?: string; imageUri?: string }>();

  const sampleIndex = Number(params.sampleIndex || '0');
  const sample = sampleAIMealScans[sampleIndex] || sampleAIMealScans[0];
  const imageUri = params.imageUri || sample.imageUri;

  const handleRetake = () => {
    router.back();
  };

  const handleUsePhoto = () => {
    // Navigate to AI Analyzing screen (Screen 12)
    router.push({
      pathname: '/meal/analyze',
      params: { sampleIndex: String(sampleIndex), imageUri },
    });
  };

  return (
    <ScreenContainer scrollable={false} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: colors.textPrimary }]}>
          Review Meal Photo
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          Make sure the entire plate is clearly visible for accurate estimation.
        </Text>
      </View>

      {/* Image Preview Box */}
      <View style={[styles.imageContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        <View style={styles.badgeOverlay}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
          <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 4, fontWeight: '600' }]}>
            High Quality Photo
          </Text>
        </View>
      </View>

      {/* Quality Tip Card */}
      <Card style={styles.tipCard} padding="md">
        <View style={styles.tipRow}>
          <Ionicons name="bulb-outline" size={20} color={colors.warning} />
          <Text style={[Typography.caption, { color: colors.textSecondary, flex: 1, marginLeft: Spacing.sm }]}>
            Good lighting and visible side dishes significantly improve AI portion accuracy.
          </Text>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Button
          title="Retake"
          onPress={handleRetake}
          variant="secondary"
          size="lg"
          icon={<Ionicons name="arrow-back" size={18} color={colors.textPrimary} />}
          style={styles.button}
        />
        <Button
          title="Use Photo"
          onPress={handleUsePhoto}
          variant="primary"
          size="lg"
          icon={<Ionicons name="sparkles" size={18} color="#FFFFFF" />}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    marginTop: Spacing.base,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    maxHeight: 440,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipCard: {
    marginVertical: Spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  button: {
    flex: 1,
  },
});
