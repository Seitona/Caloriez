import { describe, expect, test } from '@jest/globals';
import { HistoryService } from '../src/services/historyService';
import { AiService } from '../src/services/aiService';
import { Meal } from '../src/types/meal';
import { MacroGoals } from '../src/types/nutrition';

describe('History Aggregation & Streak Logic', () => {
  const goals: MacroGoals = {
    calories: 1950,
    protein: 130,
    carbs: 220,
    fat: 65,
  };

  const createDummyMeal = (calories: number, protein: number): Meal => ({
    id: `m_${Math.random()}`,
    mealType: 'lunch',
    name: 'Test Meal',
    foods: [],
    nutrition: { calories, protein, carbs: 40, fat: 10 },
    consumedAt: '12:00 PM',
  });

  describe('Week Log Calculation', () => {
    test('accurately calculates weekly averages over tracked days without penalizing future days', () => {
      const days = [
        { dayName: 'Mon', date: 'Sep 7', meals: [createDummyMeal(1800, 125)] }, // met
        { dayName: 'Tue', date: 'Sep 8', meals: [createDummyMeal(1900, 135)] }, // met
        { dayName: 'Wed', date: 'Sep 9', meals: [createDummyMeal(2100, 110)] }, // over calorie target
        { dayName: 'Thu', date: 'Sep 10', meals: [] }, // untracked
        { dayName: 'Fri', date: 'Sep 11', meals: [] }, // untracked
        { dayName: 'Sat', date: 'Sep 12', meals: [] }, // untracked
        { dayName: 'Sun', date: 'Sep 13', meals: [] }, // untracked
      ];

      const weekLog = HistoryService.calculateWeekLog('Sep 7 - 13', days, goals);

      // Average should be over the 3 tracked days (1800 + 1900 + 2100) / 3 = 1933
      expect(weekLog.averageCalories).toBe(1933);
      // Calorie goal met 2 of 3 tracked days
      expect(weekLog.calorieDaysMet).toBe(2);
      // Protein goal met 1 of 3 tracked days (Tue: 135g)
      expect(weekLog.proteinDaysMet).toBe(1);
    });
  });

  describe('Consecutive Tracking Streak', () => {
    test('counts consecutive calendar days correctly', () => {
      const trackedDates = new Set(['2026-09-08', '2026-09-09', '2026-09-10']);
      const streak = HistoryService.calculateTrackingStreak(trackedDates, '2026-09-10');
      expect(streak.current).toBe(3);
    });

    test('maintains streak if today is not yet logged but yesterday was logged', () => {
      const trackedDates = new Set(['2026-09-08', '2026-09-09']); // yesterday was Sep 9
      const streak = HistoryService.calculateTrackingStreak(trackedDates, '2026-09-10');
      expect(streak.current).toBe(2);
    });
  });

  describe('AI Response Schema Validation', () => {
    test('validates and normalizes well-formed AI response', () => {
      const raw = {
        foods: [
          { name: 'Chicken Breast', grams: 150, calories: 248, protein: 46, carbs: 0, fat: 5 },
          { name: 'White Rice', grams: 180, calories: 234, protein: 4, carbs: 52, fat: 1 },
        ],
        confidence: 0.88,
        detectedDishName: 'Chicken with Rice',
      };

      const normalized = AiService.validateResponse(raw);
      expect(normalized.foods.length).toBe(2);
      expect(normalized.total.calories).toBe(482);
      expect(normalized.total.protein).toBe(50);
      expect(normalized.confidence).toBe(0.88);
    });

    test('clamps confidence score between 0.1 and 1.0', () => {
      const raw = {
        foods: [{ name: 'Salad', calories: 100, protein: 2, carbs: 10, fat: 5 }],
        confidence: 1.5, // out of range
      };

      const normalized = AiService.validateResponse(raw);
      expect(normalized.confidence).toBe(1.0);
    });

    test('rejects empty or non-object responses', () => {
      expect(() => AiService.validateResponse(null)).toThrow();
      expect(() => AiService.validateResponse({ foods: [] })).toThrow();
    });
  });
});
