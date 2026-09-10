import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from '../types/user';

export interface FirestoreUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  weeklyRateKg?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  fitnessGoal: 'lose' | 'maintain' | 'gain';
  units: 'metric' | 'imperial';
  themePreference: 'system' | 'light' | 'dark';
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number;
  dailyFatGoal: number;
  calorieDeficit: number;
  onboardingCompleted: boolean;
  createdAt: any;
  updatedAt: any;
}

const LOCAL_USER_KEY = '@caloriez_user_profile';

export class UserService {
  /**
   * Fetch user profile from Firestore with AsyncStorage cache fallback
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        const data = snap.data() as FirestoreUserProfile;
        const profile: UserProfile = {
          id: data.uid,
          displayName: data.displayName || 'User',
          email: data.email || '',
          avatarUrl: data.photoURL,
          age: data.age || 28,
          sex: data.sex || 'male',
          heightCm: data.heightCm || 175,
          weightKg: data.weightKg || 76,
          targetWeightKg: data.targetWeightKg,
          weeklyRateKg: data.weeklyRateKg,
          units: data.units || 'metric',
          fitnessGoal: data.fitnessGoal || 'lose',
          activityLevel: data.activityLevel || 'moderate',
          macroGoals: {
            calories: data.dailyCalorieGoal || 1950,
            protein: data.dailyProteinGoal || 130,
            carbs: data.dailyCarbGoal || 220,
            fat: data.dailyFatGoal || 65,
          },
          isOnboarded: data.onboardingCompleted ?? false,
        };

        // Cache locally for instant next startup
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        return profile;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, checking local cache:', err);
    }

    // Fallback to local storage
    const cached = await AsyncStorage.getItem(LOCAL_USER_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    return null;
  }

  /**
   * Create or update user profile document in Firestore
   */
  static async saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    const firestoreData: Partial<FirestoreUserProfile> = {
      uid,
      ...(profile.displayName && { displayName: profile.displayName }),
      ...(profile.email && { email: profile.email }),
      ...(profile.avatarUrl && { photoURL: profile.avatarUrl }),
      ...(profile.age !== undefined && { age: profile.age }),
      ...(profile.sex && { sex: profile.sex }),
      ...(profile.heightCm !== undefined && { heightCm: profile.heightCm }),
      ...(profile.weightKg !== undefined && { weightKg: profile.weightKg }),
      ...(profile.targetWeightKg !== undefined && { targetWeightKg: profile.targetWeightKg }),
      ...(profile.weeklyRateKg !== undefined && { weeklyRateKg: profile.weeklyRateKg }),
      ...(profile.units && { units: profile.units }),
      ...(profile.fitnessGoal && { fitnessGoal: profile.fitnessGoal }),
      ...(profile.activityLevel && { activityLevel: profile.activityLevel }),
      ...(profile.macroGoals && {
        dailyCalorieGoal: profile.macroGoals.calories,
        dailyProteinGoal: profile.macroGoals.protein,
        dailyCarbGoal: profile.macroGoals.carbs,
        dailyFatGoal: profile.macroGoals.fat,
      }),
      ...(profile.isOnboarded !== undefined && { onboardingCompleted: profile.isOnboarded }),
      updatedAt: serverTimestamp(),
    };

    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, { ...firestoreData, createdAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.warn('Firestore save failed, saving to local cache:', err);
    }

    // Update local cache
    const existing = await this.getUserProfile(uid);
    const merged = { ...(existing || {}), ...profile, id: uid } as UserProfile;
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(merged));
  }
}
