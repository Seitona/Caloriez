import { UserProfile } from '../types/user';

export const initialMockUser: UserProfile = {
  id: 'usr_mock_001',
  displayName: 'Hadji',
  email: 'hadji.developer@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  age: 28,
  sex: 'male',
  heightCm: 175,
  weightKg: 76,
  targetWeightKg: 70,
  weeklyRateKg: 0.5,
  units: 'metric',
  fitnessGoal: 'lose',
  activityLevel: 'moderate',
  macroGoals: {
    calories: 1950,
    protein: 130,
    carbs: 220,
    fat: 65,
  },
  isOnboarded: true,
};
