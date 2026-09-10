import { Nutrition } from './nutrition';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  userId?: string;
  mealType: MealType;
  name: string;
  imageUri?: string;
  foods: FoodItem[];
  nutrition: Nutrition;
  consumedAt: string; // ISO date string or human readable
  date?: string; // YYYY-MM-DD
  confidence?: number;
}

export interface AIAnalysisResult {
  detectedMealName: string;
  confidence: number;
  foods: FoodItem[];
  totals: Nutrition;
  suggestedMealType: MealType;
  imageUri?: string;
}
