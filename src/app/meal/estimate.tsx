import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { sampleAIMealScans } from '../../data/mockMeals';
import { FoodItem, MealType } from '../../types/meal';
import { formatNumber } from '../../utils/formatting';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { ConfidenceBadge } from '../../components/meal/ConfidenceBadge';
import { FoodItemRow } from '../../components/meal/FoodItemRow';

export default function AIMealEstimateScreen() {
  const { colors } = useTheme();
  const { addMeal } = useNutrition();
  const router = useRouter();
  const params = useLocalSearchParams<{ sampleIndex?: string; imageUri?: string; aiResult?: string }>();

  const aiResultParsed = React.useMemo(() => {
    if (params.aiResult) {
      try {
        return JSON.parse(params.aiResult);
      } catch {}
    }
    return null;
  }, [params.aiResult]);

  const sampleIndex = Number(params.sampleIndex || '0');
  const sample = aiResultParsed || sampleAIMealScans[sampleIndex] || sampleAIMealScans[0];
  const imageUri = params.imageUri || sample.imageUri;

  const [mealType, setMealType] = useState<MealType>(sample.suggestedMealType || 'lunch');
  const [isSaving, setIsSaving] = useState(false);

  const mealTypeOptions: { value: MealType; label: string }[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ];

  const handleEdit = () => {
    router.push({
      pathname: '/meal/edit',
      params: { sampleIndex: String(sampleIndex), imageUri, aiResult: params.aiResult },
    });
  };

  const handleConfirmAndSave = async () => {
    try {
      setIsSaving(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      await addMeal(
        {
          name: sample.detectedMealName,
          mealType,
          imageUri,
          nutrition: sample.totals,
          foods: sample.foods,
          consumedAt: timeStr,
          confidence: sample.confidence,
        },
        imageUri
      );

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Save meal error:', err);
      Alert.alert('Error', 'Unable to save meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Top Banner with Image thumbnail and confidence */}
      <Card style={styles.topCard} padding="base">
        <View style={styles.topRow}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.mealThumb} />
          ) : null}
          <View style={styles.titleCol}>
            <ConfidenceBadge confidence={sample.confidence} />
            <Text style={[Typography.h2, { color: colors.textPrimary, marginTop: 4 }]}>
              {sample.detectedMealName}
            </Text>
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
              Estimated automatically by AI Vision
            </Text>
          </View>
        </View>
      </Card>

      {/* Meal Type Classification Selector (Section 23) */}
      <View style={styles.section}>
        <Text style={[Typography.captionMedium, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
          Meal Category
        </Text>
        <SegmentedControl
          options={mealTypeOptions}
          selectedValue={mealType}
          onSelect={setMealType}
        />
      </View>

      {/* Total Macros Summary Card */}
      <Card style={styles.totalsCard} padding="lg">
        <View style={styles.totalsHeader}>
          <View>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              Estimated Energy
            </Text>
            <Text style={[Typography.numberLarge, { color: colors.calorie }]}>
              {formatNumber(sample.totals.calories)}{' '}
              <Text style={[Typography.h3, { color: colors.calorie }]}>kcal</Text>
            </Text>
          </View>
          <View style={[styles.calBadge, { backgroundColor: colors.calorieLight }]}>
            <Ionicons name="flame" size={24} color={colors.calorie} />
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.macroColumns}>
          <View style={styles.macroCol}>
            <Text style={[Typography.caption, { color: colors.protein }]}>Protein</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {sample.totals.protein} g
            </Text>
          </View>

          <View style={styles.macroCol}>
            <Text style={[Typography.caption, { color: colors.carbs }]}>Carbs</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {sample.totals.carbs} g
            </Text>
          </View>

          <View style={styles.macroCol}>
            <Text style={[Typography.caption, { color: colors.fat }]}>Fat</Text>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {sample.totals.fat} g
            </Text>
          </View>
        </View>
      </Card>

      {/* Detected Food Items Breakdown */}
      <View style={styles.breakdownHeader}>
        <Text style={[Typography.h3, { color: colors.textPrimary }]}>
          Identified Food Items ({sample.foods.length})
        </Text>
        <Button
          title="Edit Details"
          onPress={handleEdit}
          variant="outline"
          size="sm"
          icon={<Ionicons name="create-outline" size={14} color={colors.accent} />}
        />
      </View>

      <View style={styles.foodList}>
        {sample.foods.map((food: FoodItem) => (
          <FoodItemRow key={food.id} item={food} />
        ))}
      </View>

      {/* Disclaimer notice */}
      <Text style={[Typography.tiny, styles.disclaimer, { color: colors.textSecondary }]}>
        ⚠️ Nutritional values are computer vision estimates. You can fine-tune portion sizes or add missing items before confirming.
      </Text>

      {/* Bottom CTA Actions */}
      <View style={styles.actionsRow}>
        <Button
          title="Edit Meal"
          onPress={handleEdit}
          variant="secondary"
          size="lg"
          style={styles.actionBtn}
        />
        <Button
          title="Confirm & Save"
          onPress={handleConfirmAndSave}
          variant="primary"
          size="lg"
          loading={isSaving}
          icon={<Ionicons name="checkmark-sharp" size={20} color="#FFFFFF" />}
          style={styles.actionBtn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  topCard: {
    marginBottom: Spacing.base,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  mealThumb: {
    width: 74,
    height: 74,
    borderRadius: BorderRadius.md,
  },
  titleCol: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.base,
  },
  totalsCard: {
    marginBottom: Spacing.base,
  },
  totalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  macroColumns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroCol: {
    alignItems: 'center',
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  foodList: {
    marginBottom: Spacing.base,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: Spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
});
