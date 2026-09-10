import { describe, expect, test } from '@jest/globals';
import {
  calculateBMR,
  calculateDeficit,
  calculateDefaultMacros,
  calculateTDEE,
  cmToFtIn,
  ftInToCm,
  getDailyNutrition,
  kgToLbs,
  lbsToKg,
} from '../src/utils/calculations';

describe('Deterministic Nutrition Engine Calculations', () => {
  describe('BMR (Mifflin-St Jeor)', () => {
    test('calculates male BMR correctly', () => {
      // Male: 10 * weight(76) + 6.25 * height(175) - 5 * age(28) + 5
      // 760 + 1093.75 - 140 + 5 = 1718.75 -> 1719
      const bmr = calculateBMR(76, 175, 28, 'male');
      expect(bmr).toBe(1719);
    });

    test('calculates female BMR correctly', () => {
      // Female: 10 * weight(60) + 6.25 * height(165) - 5 * age(30) - 161
      // 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
      const bmr = calculateBMR(60, 165, 30, 'female');
      expect(bmr).toBe(1320);
    });
  });

  describe('TDEE Multipliers', () => {
    const bmr = 1719;

    test('calculates sedentary TDEE (1.2)', () => {
      expect(calculateTDEE(bmr, 'sedentary')).toBe(Math.round(1719 * 1.2));
    });

    test('calculates moderately active TDEE (1.55)', () => {
      expect(calculateTDEE(bmr, 'moderate')).toBe(Math.round(1719 * 1.55));
    });

    test('calculates very active TDEE (1.725)', () => {
      expect(calculateTDEE(bmr, 'very')).toBe(Math.round(1719 * 1.725));
    });
  });

  describe('Calorie Deficits & Safety Boundaries', () => {
    const tdee = 2450;

    test('maintain mode sets 0 deficit', () => {
      const res = calculateDeficit(tdee, 'maintain');
      expect(res.dailyDeficit).toBe(0);
      expect(res.targetCalories).toBe(2450);
      expect(res.estimatedWeeklyWeightChangeKg).toBe(0);
    });

    test('mild deficit sets 250 kcal/day (~0.23 kg/wk)', () => {
      const res = calculateDeficit(tdee, 'mild');
      expect(res.dailyDeficit).toBe(250);
      expect(res.targetCalories).toBe(2200);
      expect(res.weeklyDeficit).toBe(1750);
      expect(res.estimatedWeeklyWeightChangeKg).toBeCloseTo(0.23, 1);
    });

    test('moderate deficit sets 500 kcal/day (~0.45 kg/wk)', () => {
      const res = calculateDeficit(tdee, 'moderate');
      expect(res.dailyDeficit).toBe(500);
      expect(res.targetCalories).toBe(1950);
      expect(res.weeklyDeficit).toBe(3500);
      expect(res.estimatedWeeklyWeightChangeKg).toBeCloseTo(0.45, 1);
    });

    test('clamps target calories to minimum safe floor of 1200 kcal', () => {
      const lowTDEE = 1400;
      const res = calculateDeficit(lowTDEE, 'moderate'); // 1400 - 500 = 900 -> clamped to 1200
      expect(res.targetCalories).toBe(1200);
      expect(res.dailyDeficit).toBe(200);
    });
  });

  describe('Macro Splits', () => {
    test('calculates balanced macro targets for 1950 kcal at 76kg', () => {
      const macros = calculateDefaultMacros(1950, 76);
      expect(macros.calories).toBe(1950);
      expect(macros.protein).toBeGreaterThanOrEqual(130);
      expect(macros.fat).toBeGreaterThanOrEqual(50);
      expect(macros.carbs).toBeGreaterThan(150);
    });
  });

  describe('Daily Nutrition Aggregation', () => {
    test('aggregates consumed vs remaining calories and macros', () => {
      const sampleMeals = [
        { nutrition: { calories: 420, protein: 25, carbs: 50, fat: 10 } },
        { nutrition: { calories: 600, protein: 45, carbs: 65, fat: 15 } },
      ];
      const goals = { calories: 1950, protein: 130, carbs: 220, fat: 65 };

      const daily = getDailyNutrition(sampleMeals, goals);
      expect(daily.caloriesConsumed).toBe(1020);
      expect(daily.caloriesRemaining).toBe(930);
      expect(daily.proteinConsumed).toBe(70);
      expect(daily.proteinRemaining).toBe(60);
      expect(daily.carbsConsumed).toBe(115);
      expect(daily.fatConsumed).toBe(25);
      expect(daily.mealsLogged).toBe(2);
    });
  });

  describe('Unit Conversions', () => {
    test('converts kg and lbs bidirectionally', () => {
      expect(kgToLbs(70)).toBe(154);
      expect(lbsToKg(154)).toBe(70);
    });

    test('converts cm and feet/inches bidirectionally', () => {
      const ftIn = cmToFtIn(175);
      expect(ftIn.feet).toBe(5);
      expect(ftIn.inches).toBe(9);
      expect(ftInToCm(5, 9)).toBe(175);
    });
  });
});
