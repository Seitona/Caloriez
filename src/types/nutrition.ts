export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type DeficitType = 'maintain' | 'mild' | 'moderate' | 'custom';

export interface DeficitCalculation {
  bmr: number;
  tdee: number;
  targetCalories: number;
  dailyDeficit: number;
  weeklyDeficit: number;
  estimatedWeeklyWeightChangeKg: number;
  deficitType: DeficitType;
}
