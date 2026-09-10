import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { sampleAIMealScans } from '../../data/mockMeals';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export default function AddMealModalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loadingGallery, setLoadingGallery] = useState(false);

  const handleTakePhoto = () => {
    router.push('/meal/camera');
  };

  const handleChooseFromGallery = async () => {
    try {
      setLoadingGallery(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        router.push({
          pathname: '/meal/preview',
          params: { imageUri: selectedUri, sampleIndex: '0' },
        });
      } else {
        // If cancelled or permissions not granted in simulator, fallback to sample dish
        router.push({
          pathname: '/meal/preview',
          params: { sampleIndex: '0' },
        });
      }
    } catch (e) {
      // Fallback
      router.push({
        pathname: '/meal/preview',
        params: { sampleIndex: '0' },
      });
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleQuickSampleDish = (index: number) => {
    router.push({
      pathname: '/meal/preview',
      params: { sampleIndex: String(index) },
    });
  };

  const handleAddManually = () => {
    router.push({
      pathname: '/meal/edit',
      params: { isNewManual: 'true' },
    });
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>
          Log a Meal
        </Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
          Choose how you'd like to add your meal record.
        </Text>
      </View>

      {/* Main Options List */}
      <View style={styles.optionsList}>
        {/* Option 1: Camera */}
        <Card
          style={styles.optionCard}
          padding="lg"
          onPress={handleTakePhoto}
          highlightBorderColor={colors.accent}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="camera" size={28} color={colors.accent} />
            </View>
            <View style={styles.textCol}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                Take Photo
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Snap with camera for automated AI recognition
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </Card>

        {/* Option 2: Gallery */}
        <Card
          style={styles.optionCard}
          padding="lg"
          onPress={handleChooseFromGallery}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.proteinLight }]}>
              <Ionicons name="images" size={28} color={colors.protein} />
            </View>
            <View style={styles.textCol}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                Choose from Gallery
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Upload a photo from your camera roll
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </Card>

        {/* Option 3: Manual */}
        <Card
          style={styles.optionCard}
          padding="lg"
          onPress={handleAddManually}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.carbsLight }]}>
              <Ionicons name="create-outline" size={28} color={colors.carbs} />
            </View>
            <View style={styles.textCol}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                Add Manually
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Type foods, portions, and custom calories directly
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </Card>
      </View>

      {/* Quick Demo Samples for convenient testing */}
      <View style={styles.samplesSection}>
        <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>
          Quick Demo Foods (Simulate AI Camera)
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.md }]}>
          Tap any preset meal below to test instant recognition:
        </Text>

        <View style={styles.sampleChipsGrid}>
          {sampleAIMealScans.map((sample, idx) => (
            <TouchableOpacity
              key={sample.detectedMealName}
              activeOpacity={0.7}
              onPress={() => handleQuickSampleDish(idx)}
              style={[
                styles.sampleChip,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="sparkles-outline" size={14} color={colors.accent} />
              <Text
                style={[
                  Typography.captionMedium,
                  { color: colors.textPrimary, marginLeft: 6, flex: 1 },
                ]}
                numberOfLines={1}
              >
                {sample.detectedMealName}
              </Text>
              <Text style={[Typography.tiny, { color: colors.calorie, fontWeight: '700' }]}>
                {sample.totals.calories} kcal
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  optionsList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    marginBottom: Spacing.xs,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  samplesSection: {
    marginTop: Spacing.md,
  },
  sampleChipsGrid: {
    gap: Spacing.sm,
  },
  sampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
});
