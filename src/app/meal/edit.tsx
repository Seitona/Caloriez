import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { FoodItem, MealType } from '../../types/meal';
import { formatNumber } from '../../utils/formatting';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { FoodItemRow } from '../../components/meal/FoodItemRow';

export default function EditEstimateScreen() {
  const { colors } = useTheme();
  const { addMeal } = useNutrition();
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUri?: string;
    isNewManual?: string;
    aiResult?: string;
  }>();

  const isManual = params.isNewManual === 'true';

  const aiResultParsed = useMemo(() => {
    if (params.aiResult) {
      try {
        return JSON.parse(params.aiResult);
      } catch {}
    }
    return null;
  }, [params.aiResult]);

  const initialData = isManual
    ? {
        detectedMealName: '',
        confidence: 1.0,
        suggestedMealType: 'lunch' as MealType,
        imageUri: undefined,
        foods: [] as FoodItem[],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      }
    : aiResultParsed || {
        detectedMealName: 'Custom Meal',
        confidence: 1.0,
        suggestedMealType: 'lunch' as MealType,
        imageUri: params.imageUri,
        foods: [
          {
            id: 'item_1',
            name: 'Meal Serving',
            portion: '1 plate',
            grams: 200,
            calories: 350,
            protein: 25,
            carbs: 40,
            fat: 10,
          },
        ],
        totals: { calories: 350, protein: 25, carbs: 40, fat: 10 },
      };

  const [mealName, setMealName] = useState(initialData.detectedMealName);
  const [mealType, setMealType] = useState<MealType>(initialData.suggestedMealType || 'lunch');
  const [foods, setFoods] = useState<FoodItem[]>(initialData.foods);

  // New Item Modal states
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPortion, setNewItemPortion] = useState('');
  const [newItemGrams, setNewItemGrams] = useState('');
  const [newItemKcal, setNewItemKcal] = useState('');
  const [newItemProtein, setNewItemProtein] = useState('');
  const [newItemCarbs, setNewItemCarbs] = useState('');
  const [newItemFat, setNewItemFat] = useState('');

  // Save success state (Section 24)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dynamically recalculate totals from foods array
  const totals = useMemo(() => {
    return foods.reduce(
      (acc, item) => ({
        calories: acc.calories + (Number(item.calories) || 0),
        protein: acc.protein + (Number(item.protein) || 0),
        carbs: acc.carbs + (Number(item.carbs) || 0),
        fat: acc.fat + (Number(item.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [foods]);

  const handleDeleteItem = (id: string) => {
    if (foods.length === 1) {
      Alert.alert('Cannot delete', 'A meal must contain at least one food item.');
      return;
    }
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the food item.');
      return;
    }
    const newItem: FoodItem = {
      id: `food_${Date.now()}`,
      name: newItemName.trim(),
      portion: newItemPortion.trim() || '1 serving',
      grams: Number(newItemGrams) || 100,
      calories: Number(newItemKcal) || 100,
      protein: Number(newItemProtein) || 5,
      carbs: Number(newItemCarbs) || 10,
      fat: Number(newItemFat) || 2,
    };

    setFoods((prev) => [...prev, newItem]);
    setIsAddItemModalVisible(false);
    // Reset form
    setNewItemName('');
    setNewItemPortion('');
    setNewItemGrams('');
    setNewItemKcal('');
    setNewItemProtein('');
    setNewItemCarbs('');
    setNewItemFat('');
  };

  const handleSaveMeal = async () => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      await addMeal({
        name: mealName.trim() || 'Logged Meal',
        mealType,
        imageUri: params.imageUri || initialData.imageUri,
        nutrition: totals,
        foods,
        consumedAt: timeStr,
        confidence: initialData.confidence,
      });

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to save meal:', err);
      Alert.alert('Error', 'Unable to save meal. Please try again.');
    }
  };

  const handleFinishAndGoHome = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)');
  };

  const mealTypeOptions: { value: MealType; label: string }[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ];

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, flex: 1, marginLeft: Spacing.sm }]}>
          Edit Meal Details
        </Text>
      </View>

      {/* Meal Name Input */}
      <Input
        label="Meal Title"
        value={mealName}
        onChangeText={setMealName}
        placeholder="e.g. Chicken Rice Bowl"
      />

      {/* Meal Classification (Section 23) */}
      <View style={styles.section}>
        <Text style={[Typography.captionMedium, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
          Meal Type
        </Text>
        <SegmentedControl
          options={mealTypeOptions}
          selectedValue={mealType}
          onSelect={setMealType}
        />
      </View>

      {/* Real-time Recalculated Summary Card */}
      <Card style={styles.summaryCard} padding="lg">
        <View style={styles.summaryTop}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Recalculated Energy
          </Text>
          <Text style={[Typography.numberMedium, { color: colors.calorie }]}>
            {formatNumber(totals.calories)} kcal
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.summaryMacros}>
          <Text style={[Typography.caption, { color: colors.protein }]}>
            Protein: <Text style={{ fontWeight: '700' }}>{totals.protein}g</Text>
          </Text>
          <Text style={[Typography.caption, { color: colors.carbs }]}>
            Carbs: <Text style={{ fontWeight: '700' }}>{totals.carbs}g</Text>
          </Text>
          <Text style={[Typography.caption, { color: colors.fat }]}>
            Fat: <Text style={{ fontWeight: '700' }}>{totals.fat}g</Text>
          </Text>
        </View>
      </Card>

      {/* Foods List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[Typography.h3, { color: colors.textPrimary }]}>
          Food Items ({foods.length})
        </Text>
        <Button
          title="+ Add Item"
          onPress={() => setIsAddItemModalVisible(true)}
          variant="outline"
          size="sm"
          icon={<Ionicons name="add" size={16} color={colors.accent} />}
        />
      </View>

      <View style={styles.itemsList}>
        {foods.map((food) => (
          <FoodItemRow
            key={food.id}
            item={food}
            editable
            onDelete={() => handleDeleteItem(food.id)}
          />
        ))}
      </View>

      {/* Bottom Save Action */}
      <View style={styles.footer}>
        <Button
          title="Save to Today's Log"
          onPress={handleSaveMeal}
          variant="primary"
          size="lg"
          icon={<Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />}
        />
      </View>

      {/* Modal: Add Food Item */}
      <Modal visible={isAddItemModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[Typography.h2, { color: colors.textPrimary }]}>
                Add Food Item
              </Text>
              <TouchableOpacity onPress={() => setIsAddItemModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Food Name"
                placeholder="e.g. Avocado"
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Portion Description"
                    placeholder="1/2 avocado"
                    value={newItemPortion}
                    onChangeText={setNewItemPortion}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Weight (grams)"
                    placeholder="80"
                    keyboardType="numeric"
                    value={newItemGrams}
                    onChangeText={setNewItemGrams}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Calories (kcal)"
                    placeholder="160"
                    keyboardType="numeric"
                    value={newItemKcal}
                    onChangeText={setNewItemKcal}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Protein (g)"
                    placeholder="2"
                    keyboardType="numeric"
                    value={newItemProtein}
                    onChangeText={setNewItemProtein}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Carbs (g)"
                    placeholder="9"
                    keyboardType="numeric"
                    value={newItemCarbs}
                    onChangeText={setNewItemCarbs}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Fat (g)"
                    placeholder="15"
                    keyboardType="numeric"
                    value={newItemFat}
                    onChangeText={setNewItemFat}
                  />
                </View>
              </View>

              <Button
                title="Add to Meal"
                onPress={handleAddNewItem}
                size="lg"
                style={{ marginTop: Spacing.sm }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Screen 24: Save Confirmation Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successBackdrop}>
          <View style={[styles.successCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.successCheckCircle, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.accent} />
            </View>
            <Text style={[Typography.h1, { color: colors.textPrimary, marginTop: Spacing.md }]}>
              Meal Added!
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs }]}>
              {totals.calories} kcal logged • {totals.protein}g protein
            </Text>
            <Button
              title="Return to Dashboard"
              onPress={handleFinishAndGoHome}
              size="lg"
              style={{ width: '100%', marginTop: Spacing.xl }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  backBtn: {
    padding: 4,
  },
  section: {
    marginBottom: Spacing.base,
  },
  summaryCard: {
    marginBottom: Spacing.base,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  summaryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  itemsList: {
    marginBottom: Spacing.lg,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footer: {
    marginTop: Spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  successBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  successCheckCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
