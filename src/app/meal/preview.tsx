import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function PhotoReviewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri?: string; imageBase64?: string }>();

  const imageUri = params.imageUri;
  const imageBase64 = params.imageBase64;

  const handleRetake = () => {
    router.back();
  };

  const handleUsePhoto = () => {
    router.push({
      pathname: '/meal/analyze',
      params: {
        imageUri: imageUri || '',
        imageBase64: imageBase64 || '',
      },
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
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.emptyImageBox}>
            <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
            <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.sm }]}>
              No photo captured
            </Text>
          </View>
        )}
        <View style={styles.badgeOverlay}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
          <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 4, fontWeight: '600' }]}>
            Photo Ready
          </Text>
        </View>
      </View>

      {/* Quality Tip Card */}
      <Card style={styles.tipCard} padding="md">
        <View style={styles.tipRow}>
          <Ionicons name="bulb-outline" size={20} color={colors.warning} />
          <Text style={[Typography.caption, { color: colors.textSecondary, flex: 1, marginLeft: Spacing.sm }]}>
            Good lighting and visible plate boundaries improve calorie accuracy.
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
          title="Analyze Food"
          onPress={handleUsePhoto}
          disabled={!imageUri}
          size="lg"
          icon={<Ionicons name="sparkles" size={18} color="#FFFFFF" />}
          style={[styles.button, styles.primaryButton]}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: Spacing.base,
    flex: 1,
  },
  header: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  emptyImageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tipCard: {
    marginBottom: Spacing.lg,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#F97316',
  },
});
