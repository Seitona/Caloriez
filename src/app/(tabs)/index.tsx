import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';
import { useTheme } from '../../context/ThemeContext';
import { MealType } from '../../types/meal';
import { formatTodayHeader, getGreeting } from '../../utils/formatting';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { EmptyState } from '../../components/common/EmptyState';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { CalorieCard } from '../../components/dashboard/CalorieCard';
import { DailySummary } from '../../components/dashboard/DailySummary';
import { MacroRow } from '../../components/dashboard/MacroCard';
import { MealCard } from '../../components/dashboard/MealCard';
import { ProteinCard } from '../../components/dashboard/ProteinCard';

export default function HomeDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    todayMeals,
    consumedNutrition,
    macroGoals,
    remainingCalories,
    remainingProtein,
    remainingCarbs,
    remainingFat,
    calorieProgress,
    proteinProgress,
    carbsProgress,
    fatProgress,
    deleteMeal,
    currentStreak,
  } = useNutrition();
  const router = useRouter();

  const [activeMealTypeFilter, setActiveMealTypeFilter] = useState<'all' | MealType>('all');
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);

  const greeting = getGreeting();
  const dateFormatted = formatTodayHeader();

  const mealFilterTabs: { id: 'all' | MealType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snacks' },
  ];

  const filteredMeals = activeMealTypeFilter === 'all'
    ? todayMeals
    : todayMeals.filter((m) => m.mealType === activeMealTypeFilter);

  const confirmDeleteMeal = () => {
    if (mealToDelete) {
      deleteMeal(mealToDelete);
      setMealToDelete(null);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={styles.avatarTouchable}
          >
            <Avatar uri={user?.avatarUrl} name={user?.displayName || 'Hadji'} size={44} />
          </TouchableOpacity>
          <View style={styles.greetingCol}>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {greeting}, {user?.displayName || 'Hadji'}
            </Text>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              {dateFormatted}
            </Text>
          </View>
        </View>

        {/* Streak Pill */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/progress')}
          style={[styles.streakBadge, { backgroundColor: colors.calorieLight, borderColor: colors.calorie }]}
        >
          <Ionicons name="flame" size={16} color={colors.calorie} />
          <Text style={[Typography.tiny, { color: colors.calorie, fontWeight: '700', marginLeft: 3 }]}>
            {currentStreak}d
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Main Calorie Widget (Primary Visually Dominant Card) */}
      <CalorieCard
        goal={macroGoals.calories}
        consumed={consumedNutrition.calories}
        remaining={remainingCalories}
        progress={calorieProgress}
      />

      {/* 3. Protein Widget with specialized accent */}
      <ProteinCard
        goal={macroGoals.protein}
        consumed={consumedNutrition.protein}
        remaining={remainingProtein}
        progress={proteinProgress}
      />

      {/* 4. Macronutrients (Carbs & Fat) */}
      <MacroRow
        carbsConsumed={consumedNutrition.carbs}
        carbsTarget={macroGoals.carbs}
        carbsRemaining={remainingCarbs}
        carbsProgress={carbsProgress}
        fatConsumed={consumedNutrition.fat}
        fatTarget={macroGoals.fat}
        fatRemaining={remainingFat}
        fatProgress={fatProgress}
      />

      {/* 5. Daily Summary Card */}
      <DailySummary
        nutrition={consumedNutrition}
        mealsCount={todayMeals.length}
      />

      {/* 6. Prominent Quick Add Meal CTA Button */}
      <Button
        title="+ Log New Meal"
        onPress={() => router.push('/(tabs)/add')}
        size="lg"
        variant="primary"
        icon={<Ionicons name="camera-outline" size={20} color="#FFFFFF" />}
        style={styles.ctaButton}
      />

      {/* 7. Today's Meals Section */}
      <View style={styles.mealsSectionHeader}>
        <View>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>
            Today's Logged Meals
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            {todayMeals.length} records logged today
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            History →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersScroll}>
        {mealFilterTabs.map((tab) => {
          const isSelected = activeMealTypeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveMealTypeFilter(tab.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? colors.accent : colors.surfaceSecondary,
                  borderColor: isSelected ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  Typography.tiny,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <EmptyState
          icon="restaurant-outline"
          title="No meals in this category"
          description="Track your food by taking a quick photo or choosing an image."
          actionTitle="+ Add Meal"
          onAction={() => router.push('/(tabs)/add')}
        />
      ) : (
        filteredMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onDelete={() => setMealToDelete(meal.id)}
          />
        ))
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={!!mealToDelete}
        title="Remove Meal Record?"
        message="This meal will be removed from today's intake calculations."
        confirmTitle="Delete"
        cancelTitle="Keep"
        isDestructive
        onConfirm={confirmDeleteMeal}
        onCancel={() => setMealToDelete(null)}
      />
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
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarTouchable: {
    padding: 2,
  },
  greetingCol: {
    justifyContent: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  ctaButton: {
    marginBottom: Spacing.lg,
  },
  mealsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  filtersScroll: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
});
