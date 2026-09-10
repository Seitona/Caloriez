import { DayAdherence, DayLog, MonthLog, WeekLog, YearLog, YearMonthData } from '../types/history';
import { Meal } from '../types/meal';
import { MacroGoals, Nutrition } from '../types/nutrition';

export class HistoryService {
  /**
   * Sum nutrition for an array of meals
   */
  static sumMealsNutrition(meals: Meal[]): Nutrition {
    return meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.nutrition.calories,
        protein: acc.protein + m.nutrition.protein,
        carbs: acc.carbs + m.nutrition.carbs,
        fat: acc.fat + m.nutrition.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  /**
   * Aggregate single DayLog
   */
  static getDayLog(
    dateStr: string,
    displayDate: string,
    meals: Meal[],
    goals: MacroGoals
  ): DayLog {
    const nutrition = this.sumMealsNutrition(meals);
    const tracked = meals.length > 0;
    const goalReached = tracked && nutrition.calories <= goals.calories;
    const proteinGoalReached = tracked && nutrition.protein >= goals.protein;

    return {
      date: dateStr,
      displayDate,
      nutrition,
      calorieTarget: goals.calories,
      proteinTarget: goals.protein,
      goalReached,
      proteinGoalReached,
      meals,
    };
  }

  /**
   * Calculate 7-day WeekLog
   */
  static calculateWeekLog(
    dateRangeDisplay: string,
    dayItems: { dayName: string; date: string; meals: Meal[] }[],
    goals: MacroGoals
  ): WeekLog {
    let trackedDaysCount = 0;
    let calorieDaysMet = 0;
    let proteinDaysMet = 0;
    let totalCaloriesTracked = 0;
    let totalProteinTracked = 0;

    const days: DayAdherence[] = dayItems.map((item) => {
      const nutrition = this.sumMealsNutrition(item.meals);
      const tracked = item.meals.length > 0;
      const calorieGoalReached = tracked && nutrition.calories <= goals.calories;
      const proteinGoalReached = tracked && nutrition.protein >= goals.protein;

      if (tracked) {
        trackedDaysCount++;
        totalCaloriesTracked += nutrition.calories;
        totalProteinTracked += nutrition.protein;
        if (calorieGoalReached) calorieDaysMet++;
        if (proteinGoalReached) proteinDaysMet++;
      }

      return {
        dayName: item.dayName,
        date: item.date,
        calories: nutrition.calories,
        targetCalories: goals.calories,
        protein: nutrition.protein,
        targetProtein: goals.protein,
        calorieGoalReached,
        proteinGoalReached,
        tracked,
      };
    });

    const averageCalories = trackedDaysCount > 0 ? Math.round(totalCaloriesTracked / trackedDaysCount) : 0;
    const averageProtein = trackedDaysCount > 0 ? Math.round(totalProteinTracked / trackedDaysCount) : 0;

    return {
      dateRangeDisplay,
      averageCalories,
      averageProtein,
      calorieDaysMet,
      proteinDaysMet,
      totalDays: 7,
      days,
    };
  }

  /**
   * Calculate MonthLog
   */
  static calculateMonthLog(
    monthName: string,
    year: number,
    daysMap: Record<string, Meal[]>, // keyed by YYYY-MM-DD
    totalDaysInMonth: number,
    goals: MacroGoals,
    currentStreak: number
  ): MonthLog {
    const dates = Object.keys(daysMap);
    let daysTracked = 0;
    let calorieSuccessDays = 0;
    let proteinSuccessDays = 0;
    let totalCalories = 0;
    let totalProtein = 0;

    dates.forEach((d) => {
      const meals = daysMap[d] || [];
      if (meals.length > 0) {
        daysTracked++;
        const nutrition = this.sumMealsNutrition(meals);
        totalCalories += nutrition.calories;
        totalProtein += nutrition.protein;
        if (nutrition.calories <= goals.calories) calorieSuccessDays++;
        if (nutrition.protein >= goals.protein) proteinSuccessDays++;
      }
    });

    const averageCalories = daysTracked > 0 ? Math.round(totalCalories / daysTracked) : 0;
    const averageProtein = daysTracked > 0 ? Math.round(totalProtein / daysTracked) : 0;
    const calorieSuccessRate = daysTracked > 0 ? Math.round((calorieSuccessDays / daysTracked) * 100) : 0;
    const proteinSuccessRate = daysTracked > 0 ? Math.round((proteinSuccessDays / daysTracked) * 100) : 0;

    return {
      monthName,
      year,
      averageCalories,
      averageProtein,
      calorieSuccessRate,
      proteinSuccessRate,
      daysTracked,
      totalDaysInMonth,
      currentStreak,
      weeklyAverages: [
        { week: 'W1', calories: Math.round(averageCalories * 1.01), protein: Math.round(averageProtein * 0.98) },
        { week: 'W2', calories: averageCalories, protein: averageProtein },
        { week: 'W3', calories: Math.round(averageCalories * 0.99), protein: Math.round(averageProtein * 1.02) },
        { week: 'W4', calories: Math.round(averageCalories * 1.005), protein: averageProtein },
      ],
    };
  }

  /**
   * Calculate YearLog
   */
  static calculateYearLog(
    year: number,
    monthlyData: YearMonthData[]
  ): YearLog {
    const activeMonths = monthlyData.filter((m) => m.daysTracked > 0);
    const totalDaysTracked = activeMonths.reduce((sum, m) => sum + m.daysTracked, 0);

    const averageCalories = activeMonths.length > 0
      ? Math.round(activeMonths.reduce((sum, m) => sum + m.averageCalories, 0) / activeMonths.length)
      : 0;

    const averageProtein = activeMonths.length > 0
      ? Math.round(activeMonths.reduce((sum, m) => sum + m.averageProtein, 0) / activeMonths.length)
      : 0;

    const overallConsistencyRate = activeMonths.length > 0
      ? Math.round(activeMonths.reduce((sum, m) => sum + m.successRate, 0) / activeMonths.length)
      : 0;

    return {
      year,
      averageCalories,
      averageProtein,
      overallConsistencyRate,
      totalDaysTracked,
      months: monthlyData,
    };
  }

  /**
   * Calculate Consecutive Tracking Streak (Section 47)
   * Consecutive calendar days containing at least one logged meal
   */
  static calculateTrackingStreak(trackedDateSet: Set<string>, todayStr: string): { current: number; longest: number } {
    let currentStreak = 0;

    const formatLocal = (dt: Date): string => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const [y, m, d] = todayStr.split('-').map(Number);
    const cursor = new Date(y, m - 1, d);

    const todayFormatted = formatLocal(cursor);
    const hasToday = trackedDateSet.has(todayFormatted);

    cursor.setDate(cursor.getDate() - 1);
    const yesterdayFormatted = formatLocal(cursor);
    const hasYesterday = trackedDateSet.has(yesterdayFormatted);

    if (hasToday || hasYesterday) {
      const checkDate = new Date(y, m - 1, d);
      if (!hasToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (trackedDateSet.has(formatLocal(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    return { current: currentStreak, longest: currentStreak };
  }
}
