import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialTodayMeals } from '../data/mockMeals';
import { mockAchievements } from '../data/mockAchievements';
import { mockDayLogs, mockMonthLog, mockWeekLog, mockYearLog } from '../data/mockHistory';
import { HistoryService } from '../services/historyService';
import { MealService } from '../services/mealService';
import { Achievement, DayLog, MonthLog, WeekLog, YearLog } from '../types/history';
import { Meal } from '../types/meal';
import { MacroGoals, Nutrition } from '../types/nutrition';
import { useAuth } from './AuthContext';

interface NutritionContextType {
  todayMeals: Meal[];
  consumedNutrition: Nutrition;
  macroGoals: MacroGoals;
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  calorieProgress: number; // 0 to 1
  proteinProgress: number; // 0 to 1
  carbsProgress: number; // 0 to 1
  fatProgress: number; // 0 to 1
  addMeal: (mealData: Omit<Meal, 'id'>, localImageUri?: string) => Promise<Meal>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  dayLogs: DayLog[];
  selectedDayLog: DayLog;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weekLog: WeekLog;
  monthLog: MonthLog;
  yearLog: YearLog;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  daysTrackedCount: number;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState<Meal[]>(initialTodayMeals);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-10');
  const [dayLogs, setDayLogs] = useState<DayLog[]>(mockDayLogs);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);

  // Subscribe to real-time meal updates from Firestore for authenticated user
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = MealService.subscribeToMeals(user.id, (meals) => {
      if (meals && meals.length > 0) {
        setTodayMeals(meals);
      }
    });

    return () => unsubscribe();
  }, [user?.id]);

  const macroGoals: MacroGoals = useMemo(() => {
    return user?.macroGoals || {
      calories: 1950,
      protein: 130,
      carbs: 220,
      fat: 65,
    };
  }, [user]);

  // Calculate consumed totals for today
  const consumedNutrition = useMemo<Nutrition>(() => {
    return HistoryService.sumMealsNutrition(todayMeals);
  }, [todayMeals]);

  const remainingCalories = Math.max(0, macroGoals.calories - consumedNutrition.calories);
  const remainingProtein = Math.max(0, macroGoals.protein - consumedNutrition.protein);
  const remainingCarbs = Math.max(0, macroGoals.carbs - consumedNutrition.carbs);
  const remainingFat = Math.max(0, macroGoals.fat - consumedNutrition.fat);

  const calorieProgress = Math.min(1, consumedNutrition.calories / (macroGoals.calories || 1));
  const proteinProgress = Math.min(1, consumedNutrition.protein / (macroGoals.protein || 1));
  const carbsProgress = Math.min(1, consumedNutrition.carbs / (macroGoals.carbs || 1));
  const fatProgress = Math.min(1, consumedNutrition.fat / (macroGoals.fat || 1));

  const addMeal = async (mealData: Omit<Meal, 'id'>, localImageUri?: string): Promise<Meal> => {
    const uid = user?.id || 'usr_google_authenticated';
    const newMeal = await MealService.addMeal(uid, mealData, localImageUri);
    setTodayMeals((prev) => [newMeal, ...prev.filter((m) => m.id !== newMeal.id)]);

    // Update today's entry in dayLogs
    setDayLogs((prev) =>
      prev.map((log) => {
        if (log.date === '2026-09-10' || log.date === selectedDate) {
          const updatedMeals = [newMeal, ...log.meals.filter((m) => m.id !== newMeal.id)];
          const updatedNutrition = HistoryService.sumMealsNutrition(updatedMeals);
          return {
            ...log,
            meals: updatedMeals,
            nutrition: updatedNutrition,
            goalReached: updatedNutrition.calories <= log.calorieTarget,
            proteinGoalReached: updatedNutrition.protein >= log.proteinTarget,
          };
        }
        return log;
      })
    );

    return newMeal;
  };

  const updateMeal = async (id: string, updates: Partial<Meal>): Promise<void> => {
    const uid = user?.id || 'usr_google_authenticated';
    await MealService.updateMeal(uid, id, updates);

    setTodayMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, nutrition: updates.nutrition || m.nutrition } : m))
    );

    setDayLogs((prev) =>
      prev.map((log) => ({
        ...log,
        meals: log.meals.map((m) => (m.id === id ? { ...m, ...updates, nutrition: updates.nutrition || m.nutrition } : m)),
      }))
    );
  };

  const deleteMeal = async (id: string): Promise<void> => {
    const uid = user?.id || 'usr_google_authenticated';
    const mealToDelete = todayMeals.find((m) => m.id === id);
    await MealService.deleteMeal(uid, id, mealToDelete?.imageUri);

    setTodayMeals((prev) => prev.filter((m) => m.id !== id));

    setDayLogs((prev) =>
      prev.map((log) => {
        const remaining = log.meals.filter((m) => m.id !== id);
        const updatedNutrition = HistoryService.sumMealsNutrition(remaining);
        return {
          ...log,
          meals: remaining,
          nutrition: updatedNutrition,
          goalReached: remaining.length > 0 && updatedNutrition.calories <= log.calorieTarget,
          proteinGoalReached: remaining.length > 0 && updatedNutrition.protein >= log.proteinTarget,
        };
      })
    );
  };

  const selectedDayLog = useMemo(() => {
    const found = dayLogs.find((d) => d.date === selectedDate);
    if (found) return found;
    return dayLogs[0];
  }, [dayLogs, selectedDate]);

  // Deterministically compute streaks (Section 47)
  const streakData = useMemo(() => {
    const dateSet = new Set<string>(['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10']);
    return HistoryService.calculateTrackingStreak(dateSet, '2026-09-10');
  }, [todayMeals]);

  return (
    <NutritionContext.Provider
      value={{
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
        addMeal,
        updateMeal,
        deleteMeal,
        dayLogs,
        selectedDayLog,
        selectedDate,
        setSelectedDate,
        weekLog: mockWeekLog,
        monthLog: mockMonthLog,
        yearLog: mockYearLog,
        achievements,
        currentStreak: streakData.current,
        longestStreak: streakData.longest,
        daysTrackedCount: 23,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
