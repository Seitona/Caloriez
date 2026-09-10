import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockAchievements } from '../data/mockAchievements';
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
  calorieProgress: number;
  proteinProgress: number;
  carbsProgress: number;
  fatProgress: number;
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

const getTodayLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalDate());

  // Subscribe to real-time meal updates from Firestore for authenticated user
  useEffect(() => {
    if (!user?.id) {
      setTodayMeals([]);
      return;
    }

    const unsubscribe = MealService.subscribeToMeals(user.id, (meals) => {
      setTodayMeals(meals || []);
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

  const getMealDate = (m: Meal): string => {
    if (m.date) return m.date;
    if (m.consumedAt) {
      if (m.consumedAt.includes('T')) return m.consumedAt.split('T')[0];
      if (m.consumedAt.match(/^\d{4}-\d{2}-\d{2}/)) return m.consumedAt.substring(0, 10);
    }
    return getTodayLocalDate();
  };

  // Calculate consumed totals for today
  const consumedNutrition = useMemo<Nutrition>(() => {
    const today = getTodayLocalDate();
    const todaysMeals = todayMeals.filter((m) => getMealDate(m) === today);
    return HistoryService.sumMealsNutrition(todaysMeals);
  }, [todayMeals]);

  const remainingCalories = Math.max(0, macroGoals.calories - consumedNutrition.calories);
  const remainingProtein = Math.max(0, macroGoals.protein - consumedNutrition.protein);
  const remainingCarbs = Math.max(0, macroGoals.carbs - consumedNutrition.carbs);
  const remainingFat = Math.max(0, macroGoals.fat - consumedNutrition.fat);

  const calorieProgress = Math.min(1, consumedNutrition.calories / (macroGoals.calories || 1));
  const proteinProgress = Math.min(1, consumedNutrition.protein / (macroGoals.protein || 1));
  const carbsProgress = Math.min(1, consumedNutrition.carbs / (macroGoals.carbs || 1));
  const fatProgress = Math.min(1, consumedNutrition.fat / (macroGoals.fat || 1));

  // Dynamically compute dayLogs from user's actual logged meals
  const dayLogs: DayLog[] = useMemo(() => {
    const today = getTodayLocalDate();
    const map: Record<string, Meal[]> = {};
    map[today] = [];

    todayMeals.forEach((m) => {
      const d = getMealDate(m);
      if (!map[d]) map[d] = [];
      map[d].push(m);
    });

    const dates = Object.keys(map).sort().reverse();
    return dates.map((dateStr) => {
      const dObj = new Date(dateStr);
      const displayDate = dObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return HistoryService.getDayLog(dateStr, displayDate, map[dateStr], macroGoals);
    });
  }, [todayMeals, macroGoals]);

  const selectedDayLog = useMemo(() => {
    const found = dayLogs.find((d) => d.date === selectedDate);
    if (found) return found;
    return dayLogs[0] || HistoryService.getDayLog(selectedDate, selectedDate, [], macroGoals);
  }, [dayLogs, selectedDate, macroGoals]);

  // Deterministically compute streaks from user's actual logged meal dates
  const streakData = useMemo(() => {
    const dateSet = new Set<string>(todayMeals.map((m) => getMealDate(m)));
    return HistoryService.calculateTrackingStreak(dateSet, getTodayLocalDate());
  }, [todayMeals]);

  const daysTrackedCount = useMemo(() => {
    return new Set(todayMeals.map((m) => getMealDate(m))).size;
  }, [todayMeals]);

  // Dynamically compute achievements from real user tracking stats
  const achievements: Achievement[] = useMemo(() => {
    return mockAchievements.map((ach) => {
      let unlocked = false;
      let progress = ach.progress;

      if (ach.id === 'ach_1') {
        unlocked = daysTrackedCount >= 1;
      } else if (ach.id === 'ach_2') {
        unlocked = streakData.longest >= 3;
        progress = { current: Math.min(3, streakData.longest), total: 3 };
      } else if (ach.id === 'ach_3') {
        const proteinDays = dayLogs.filter((d) => d.proteinGoalReached).length;
        unlocked = proteinDays >= 5;
        progress = { current: Math.min(5, proteinDays), total: 5 };
      } else if (ach.id === 'ach_4') {
        unlocked = streakData.longest >= 7;
        progress = { current: Math.min(7, streakData.longest), total: 7 };
      } else if (ach.id === 'ach_5') {
        const calorieDays = dayLogs.filter((d) => d.goalReached).length;
        unlocked = calorieDays >= 10;
        progress = { current: Math.min(10, calorieDays), total: 10 };
      } else if (ach.id === 'ach_6') {
        unlocked = streakData.longest >= 14;
        progress = { current: Math.min(14, streakData.longest), total: 14 };
      } else if (ach.id === 'ach_7') {
        unlocked = daysTrackedCount >= 30;
        progress = { current: Math.min(30, daysTrackedCount), total: 30 };
      } else if (ach.id === 'ach_8') {
        unlocked = dayLogs.some((d) => d.goalReached && d.proteinGoalReached);
      }

      return {
        ...ach,
        unlocked,
        progress,
      };
    });
  }, [daysTrackedCount, streakData.longest, dayLogs]);

  // Compute dynamic week log from user's actual meals
  const weekLog = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const dayItems = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dateStr = `${y}-${m}-${String(d.getDate()).padStart(2, '0')}`;
      const dayMeals = todayMeals.filter((meal) => getMealDate(meal) === dateStr);
      return {
        dayName,
        date: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`,
        meals: dayMeals,
      };
    });

    return HistoryService.calculateWeekLog(
      `${dayItems[0].date} - ${dayItems[6].date}`,
      dayItems,
      macroGoals
    );
  }, [todayMeals, macroGoals]);

  const monthLog = useMemo(() => {
    const now = new Date();
    const daysMap: Record<string, Meal[]> = {};
    todayMeals.forEach((meal) => {
      const d = getMealDate(meal);
      if (!daysMap[d]) daysMap[d] = [];
      daysMap[d].push(meal);
    });
    return HistoryService.calculateMonthLog(
      now.toLocaleString('default', { month: 'long' }),
      now.getFullYear(),
      daysMap,
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      macroGoals,
      streakData.current
    );
  }, [todayMeals, macroGoals, streakData.current]);

  const yearLog = useMemo(() => {
    const now = new Date();
    const monthlyData = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ].map((monthAbbr, idx) => {
      const monthPrefix = `${now.getFullYear()}-${String(idx + 1).padStart(2, '0')}`;
      const monthMeals = todayMeals.filter((m) => getMealDate(m).startsWith(monthPrefix));
      const daysTracked = new Set(monthMeals.map((m) => getMealDate(m))).size;
      const totalCalories = monthMeals.reduce((acc, m) => acc + (m.nutrition?.calories || 0), 0);
      const totalProtein = monthMeals.reduce((acc, m) => acc + (m.nutrition?.protein || 0), 0);
      return {
        monthAbbr,
        averageCalories: daysTracked > 0 ? Math.round(totalCalories / daysTracked) : 0,
        averageProtein: daysTracked > 0 ? Math.round(totalProtein / daysTracked) : 0,
        successRate: daysTracked > 0 ? 100 : 0,
        daysTracked,
      };
    });

    return {
      year: now.getFullYear(),
      averageCalories: 0,
      averageProtein: 0,
      overallConsistencyRate: 0,
      totalDaysTracked: daysTrackedCount,
      months: monthlyData,
    };
  }, [todayMeals, daysTrackedCount]);

  const addMeal = async (mealData: Omit<Meal, 'id'>, localImageUri?: string): Promise<Meal> => {
    const uid = user?.id || 'usr_google_authenticated';
    const newMeal = await MealService.addMeal(uid, mealData, localImageUri);
    setTodayMeals((prev) => [newMeal, ...prev.filter((m) => m.id !== newMeal.id)]);
    return newMeal;
  };

  const updateMeal = async (id: string, updates: Partial<Meal>): Promise<void> => {
    const uid = user?.id || 'usr_google_authenticated';
    await MealService.updateMeal(uid, id, updates);
    setTodayMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, nutrition: updates.nutrition || m.nutrition } : m))
    );
  };

  const deleteMeal = async (id: string): Promise<void> => {
    const uid = user?.id || 'usr_google_authenticated';
    const mealToDelete = todayMeals.find((m) => m.id === id);
    await MealService.deleteMeal(uid, id, mealToDelete?.imageUri);
    setTodayMeals((prev) => prev.filter((m) => m.id !== id));
  };

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
        weekLog,
        monthLog,
        yearLog,
        achievements,
        currentStreak: streakData.current,
        longestStreak: streakData.longest,
        daysTrackedCount,
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
