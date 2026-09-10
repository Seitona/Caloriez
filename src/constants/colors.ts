export interface ColorTokens {
  background: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  borderLight: string;
  accent: string;
  accentLight: string;
  success: string;
  warning: string;
  danger: string;
  calorie: string;
  calorieLight: string;
  protein: string;
  proteinLight: string;
  carbs: string;
  carbsLight: string;
  fat: string;
  fatLight: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export const lightColors: ColorTokens = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F8FAFC',
  accent: '#10B981',
  accentLight: '#ECFDF5',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  calorie: '#F97316',
  calorieLight: '#FFF7ED',
  protein: '#3B82F6',
  proteinLight: '#EFF6FF',
  carbs: '#EAB308',
  carbsLight: '#FEFCE8',
  fat: '#8B5CF6',
  fatLight: '#F5F3FF',
  tint: '#10B981',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#10B981',
};

export const darkColors: ColorTokens = {
  background: '#090D16',
  surface: '#131B2E',
  surfaceSecondary: '#1E293B',
  card: '#131B2E',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#1E293B',
  borderLight: '#131B2E',
  accent: '#34D399',
  accentLight: 'rgba(52, 211, 153, 0.15)',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  calorie: '#FB923C',
  calorieLight: 'rgba(251, 146, 60, 0.15)',
  protein: '#60A5FA',
  proteinLight: 'rgba(96, 165, 250, 0.15)',
  carbs: '#FACC15',
  carbsLight: 'rgba(250, 204, 21, 0.15)',
  fat: '#A78BFA',
  fatLight: 'rgba(167, 139, 250, 0.15)',
  tint: '#34D399',
  tabIconDefault: '#64748B',
  tabIconSelected: '#34D399',
};
