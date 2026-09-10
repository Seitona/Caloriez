import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { AIAnalysisResult, FoodItem, MealType } from '../../types/meal';
import { formatNumber } from '../../utils/formatting';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { ConfidenceBadge } from '../../components/meal/ConfidenceBadge';
import { FoodItemRow } from '../../components/meal/FoodItemRow';

const DEFAULT_ANALYSIS: AIAnalysisResult = {
  detectedMealName: 'Custom Food Dish',
  confidence: 0.9,
  suggestedMealType: 'lunch',
  foods: [
    {
      id: 'food_1',
      name: 'Estimated Meal Plate',
      portion: '1 serving (250g)',
      grams: 250,
      calories: 380,
      protein: 28,
      carbs: 45,
      fat: 10,
    },
  ],
  totals: {
    calories: 380,
    protein: 28,
    carbs: 45,
    fat: 10,
  },
};

export default function AIMealEstimateScreen() {
  const { colors } = useTheme();
  const { addMeal } = useNutrition();
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri?: string; aiResult?: string }>();

  const aiResultParsed: AIAnalysisResult = React.useMemo(() => {
    if (params.aiResult) {
      try {
        return JSON.parse(params.aiResult);
      } catch {}
    }
    return DEFAULT_ANALYSIS;
  }, [params.aiResult]);

  const sample = aiResultParsed;
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
      params: { imageUri, aiResult: params.aiResult },
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
            <Image source={{ uri: imageUri }} style={styles.mealThumb} resizeMode="cover" />
          ) : (
            <View style={[styles.mealThumb, { backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name="fast-food-outline" size={24} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.titleCol}>
            <ConfidenceBadge confidence={sample.confidence} />
            <Text style={[Typography.h2, { color: colors.textPrimary, marginTop: 4 }]} numberOfLines={2}>
              {sample.detectedMealName}
            </Text>
            <Text style={[Typography.tiny, { color: colors.textSecondary }]}>
              Analyzed with AI Calorie Lens
            </Text>
          </View>
        </View>
      </Card>

      {/* Meal Type Classification Selector */}
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

      {/* Breakdown Items List */}
      <View style={styles.section}>
        <View style={styles.breakdownHeader}>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>
            Detected Foods ({sample.foods.length})
          </Text>
          <Button
            title="Adjust / Add"
            onPress={handleEdit}
            variant="ghost"
            size="sm"
            icon={<Ionicons name="create-outline" size={16} color={colors.accent} />}
          />
        </View>

        <Card padding="sm" style={styles.foodsCard}>
          {sample.foods.map((food, index) => (
            <FoodItemRow
              key={food.id || index}
              item={food}
            />
          ))}
        </Card>
      </View>

      {/* Bottom Save Action */}
      <View style={styles.bottomActions}>
        <Button
          title="Save to Daily Log"
          onPress={handleConfirmAndSave}
          loading={isSaving}
          size="lg"
          icon={<Ionicons name="checkmark-sharp" size={20} color="#FFFFFF" />}
          style={styles.saveButton}
        />
        <Button
          title="Edit Details First"
          onPress={handleEdit}
          variant="outline"
          size="md"
          style={styles.editSecondaryBtn}
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
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealThumb: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  titleCol: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.md,
  },
  totalsCard: {
    marginBottom: Spacing.md,
  },
  totalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  foodsCard: {
    overflow: 'hidden',
  },
  bottomActions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  saveButton: {
    backgroundColor: '#F97316',
  },
  editSecondaryBtn: {
    borderWidth: 1,
  },
});
