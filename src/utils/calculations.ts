import { ActivityLevel, FitnessGoal, MeasurementUnit, Sex } from '../types/user';
import { DeficitCalculation, DeficitType, MacroGoals } from '../types/nutrition';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export const DEFICIT_VALUES: Record<Exclude<DeficitType, 'custom'>, number> = {
  maintain: 0,
  mild: 250,
  moderate: 500,
};

export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  if (sex === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.375;
  return Math.round(bmr * multiplier);
}

export function calculateDeficit(
  tdee: number,
  deficitType: DeficitType,
  customDeficit: number = 0,
  bmr: number = 1500
): DeficitCalculation {
  let dailyDeficit = 0;
  if (deficitType === 'maintain') {
    dailyDeficit = 0;
  } else if (deficitType === 'mild') {
    dailyDeficit = 250;
  } else if (deficitType === 'moderate') {
    dailyDeficit = 500;
  } else {
    dailyDeficit = customDeficit;
  }

  // Safety floor: minimum safe intake 1200 kcal
  const targetCalories = Math.max(1200, tdee - dailyDeficit);
  const actualDailyDeficit = tdee - targetCalories;
  const weeklyDeficit = actualDailyDeficit * 7;
  // 7,700 kcal is roughly 1 kg fat
  const estimatedWeeklyWeightChangeKg = Number((weeklyDeficit / 7700).toFixed(2));

  return {
    bmr,
    tdee,
    targetCalories,
    dailyDeficit: actualDailyDeficit,
    weeklyDeficit,
    estimatedWeeklyWeightChangeKg,
    deficitType,
  };
}

export function calculateDefaultMacros(targetCalories: number, weightKg: number): MacroGoals {
  // Protein: ~1.8g to 2.0g per kg of body weight
  const proteinGrams = Math.round(Math.min(targetCalories * 0.35 / 4, weightKg * 1.8));
  // Fat: ~25% of calories (9 kcal/g)
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);
  // Remainder: Carbs (4 kcal/g)
  const remainingCalories = Math.max(0, targetCalories - (proteinGrams * 4 + fatGrams * 9));
  const carbsGrams = Math.round(remainingCalories / 4);

  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  };
}

// Unit conversion helpers
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462);
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function ftInToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function getDailyNutrition(
  meals: { nutrition: { calories: number; protein: number; carbs: number; fat: number } }[],
  goals: MacroGoals
) {
  const caloriesConsumed = meals.reduce((acc, m) => acc + m.nutrition.calories, 0);
  const proteinConsumed = meals.reduce((acc, m) => acc + m.nutrition.protein, 0);
  const carbsConsumed = meals.reduce((acc, m) => acc + m.nutrition.carbs, 0);
  const fatConsumed = meals.reduce((acc, m) => acc + m.nutrition.fat, 0);

  const caloriesRemaining = goals.calories - caloriesConsumed;
  const proteinRemaining = goals.protein - proteinConsumed;

  return {
    caloriesConsumed,
    calorieGoal: goals.calories,
    caloriesRemaining,
    proteinConsumed,
    proteinGoal: goals.protein,
    proteinRemaining,
    carbsConsumed,
    carbGoal: goals.carbs,
    fatConsumed,
    fatGoal: goals.fat,
    mealsLogged: meals.length,
  };
}
