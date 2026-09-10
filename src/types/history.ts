import { Meal } from './meal';
import { Nutrition } from './nutrition';

export interface DayLog {
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Thursday, Sep 10"
  nutrition: Nutrition;
  calorieTarget: number;
  proteinTarget: number;
  goalReached: boolean;
  proteinGoalReached: boolean;
  meals: Meal[];
}

export interface DayAdherence {
  dayName: string; // Mon, Tue, etc.
  date: string;
  calories: number;
  targetCalories: number;
  protein: number;
  targetProtein: number;
  calorieGoalReached: boolean;
  proteinGoalReached: boolean;
  tracked: boolean;
}

export interface WeekLog {
  dateRangeDisplay: string; // e.g. "Sep 7 - 13"
  averageCalories: number;
  averageProtein: number;
  calorieDaysMet: number;
  proteinDaysMet: number;
  totalDays: number;
  days: DayAdherence[];
}

export interface MonthLog {
  monthName: string; // e.g. "September"
  year: number;
  averageCalories: number;
  averageProtein: number;
  calorieSuccessRate: number; // e.g. 78%
  proteinSuccessRate: number; // e.g. 68%
  daysTracked: number;
  totalDaysInMonth: number;
  currentStreak: number;
  weeklyAverages: { week: string; calories: number; protein: number }[];
}

export interface YearMonthData {
  monthAbbr: string; // Jan, Feb, ...
  averageCalories: number;
  averageProtein: number;
  successRate: number;
  daysTracked: number;
}

export interface YearLog {
  year: number;
  averageCalories: number;
  averageProtein: number;
  overallConsistencyRate: number;
  totalDaysTracked: number;
  months: YearMonthData[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: { current: number; total: number };
}
