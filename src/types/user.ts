import { MacroGoals } from './nutrition';

export type Sex = 'male' | 'female' | 'other';
export type MeasurementUnit = 'metric' | 'imperial';
export type FitnessGoal = 'lose' | 'maintain' | 'gain';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very'
  | 'extra';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  weeklyRateKg?: number; // e.g. 0.25, 0.5, 0.75, 1.0
  units: MeasurementUnit;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  macroGoals: MacroGoals;
  isOnboarded: boolean;
}
