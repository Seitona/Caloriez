import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
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
    if (loadingGallery) return;
    try {
      setLoadingGallery(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        router.push({
          pathname: '/meal/preview',
          params: {
            imageUri: asset.uri,
            imageBase64: asset.base64 || undefined,
          },
        });
      }
    } catch (e: any) {
      console.warn('Gallery pick failed:', e);
      Alert.alert('Gallery Error', 'Could not access device photos.');
    } finally {
      setLoadingGallery(false);
    }
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
          Photograph your meal or log custom items and macros.
        </Text>
      </View>

      {/* Main Options List */}
      <View style={styles.optionsList}>
        {/* Option 1: Camera */}
        <Card
          style={styles.optionCard}
          padding="lg"
          onPress={handleTakePhoto}
          highlightBorderColor="#F97316"
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFEDD5' }]}>
              <Ionicons name="camera" size={28} color="#F97316" />
            </View>
            <View style={styles.textCol}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                Take Photo
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Snap a picture of your dish for instant AI calorie estimation
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
              <Ionicons name="images-outline" size={28} color={colors.protein} />
            </View>
            <View style={styles.textCol}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                Upload from Gallery
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Select an existing food photo from your camera roll
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
                Type foods, custom portions, and exact macronutrients directly
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </Card>
      </View>

      {/* Helpful Tip Card */}
      <Card padding="md" style={styles.tipCard}>
        <View style={styles.tipRow}>
          <Ionicons name="sparkles" size={20} color="#F97316" />
          <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: Spacing.sm, flex: 1 }]}>
            Tip: Photographing your meal from a top-down angle gives the highest calorie and portion accuracy!
          </Text>
        </View>
      </Card>
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
  tipCard: {
    marginTop: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
