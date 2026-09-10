import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import { initialTodayMeals } from '../data/mockMeals';
import { FoodItem, Meal, MealType } from '../types/meal';
import { Nutrition } from '../types/nutrition';

export interface FirestoreMealDocument {
  id: string;
  mealType: MealType;
  name: string;
  imageUrl?: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence?: number;
  aiEstimated: boolean;
  consumedAt: any;
  createdAt: any;
  updatedAt: any;
}

const LOCAL_MEALS_KEY = '@caloriez_meals_cache';

export class MealService {
  /**
   * Upload meal photo to Firebase Storage
   */
  static async uploadMealImage(uid: string, mealId: string, imageUri: string): Promise<string> {
    if (!imageUri || imageUri.startsWith('http')) {
      return imageUri; // Already remote URL
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${uid}/meals/${mealId}/meal.jpg`);
      await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.warn('Storage upload error, retaining original URI:', err);
      return imageUri;
    }
  }

  /**
   * Create a new meal record in Firestore
   */
  static async addMeal(
    uid: string,
    mealData: Omit<Meal, 'id'>,
    localImageUri?: string
  ): Promise<Meal> {
    const mealId = `meal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    let finalImageUrl = mealData.imageUri;

    if (localImageUri) {
      finalImageUrl = await this.uploadMealImage(uid, mealId, localImageUri);
    }

    const firestoreData: FirestoreMealDocument = {
      id: mealId,
      mealType: mealData.mealType,
      name: mealData.name,
      imageUrl: finalImageUrl,
      foods: mealData.foods,
      totalCalories: Math.round(mealData.nutrition.calories),
      totalProtein: Math.round(mealData.nutrition.protein),
      totalCarbs: Math.round(mealData.nutrition.carbs),
      totalFat: Math.round(mealData.nutrition.fat),
      confidence: mealData.confidence ?? 0.88,
      aiEstimated: mealData.confidence !== undefined,
      consumedAt: mealData.consumedAt || new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const mealRef = doc(db, 'users', uid, 'meals', mealId);
      await setDoc(mealRef, firestoreData);
    } catch (err) {
      console.warn('Firestore write failed, persisting to local storage:', err);
    }

    const createdMeal: Meal = {
      id: mealId,
      userId: uid,
      mealType: mealData.mealType,
      name: mealData.name,
      imageUri: finalImageUrl,
      foods: mealData.foods,
      nutrition: mealData.nutrition,
      consumedAt: mealData.consumedAt || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      confidence: mealData.confidence,
    };

    // Update local cache
    const cached = await this.getLocalMeals();
    const updated = [createdMeal, ...cached];
    await AsyncStorage.setItem(LOCAL_MEALS_KEY, JSON.stringify(updated));

    return createdMeal;
  }

  /**
   * Update an existing meal
   */
  static async updateMeal(uid: string, mealId: string, updates: Partial<Meal>): Promise<void> {
    const updatePayload: any = {
      updatedAt: serverTimestamp(),
      ...(updates.name && { name: updates.name }),
      ...(updates.mealType && { mealType: updates.mealType }),
      ...(updates.foods && { foods: updates.foods }),
      ...(updates.nutrition && {
        totalCalories: Math.round(updates.nutrition.calories),
        totalProtein: Math.round(updates.nutrition.protein),
        totalCarbs: Math.round(updates.nutrition.carbs),
        totalFat: Math.round(updates.nutrition.fat),
      }),
    };

    try {
      const mealRef = doc(db, 'users', uid, 'meals', mealId);
      await updateDoc(mealRef, updatePayload);
    } catch (err) {
      console.warn('Firestore updateDoc failed, updating local cache:', err);
    }

    // Update local cache
    const cached = await this.getLocalMeals();
    const updated = cached.map((m) =>
      m.id === mealId
        ? {
            ...m,
            ...updates,
            nutrition: updates.nutrition ? { ...m.nutrition, ...updates.nutrition } : m.nutrition,
          }
        : m
    );
    await AsyncStorage.setItem(LOCAL_MEALS_KEY, JSON.stringify(updated));
  }

  /**
   * Delete a meal from Firestore and delete image from Storage
   */
  static async deleteMeal(uid: string, mealId: string, imageUri?: string): Promise<void> {
    try {
      const mealRef = doc(db, 'users', uid, 'meals', mealId);
      await deleteDoc(mealRef);

      if (imageUri && imageUri.includes('firebasestorage')) {
        const storageRef = ref(storage, `users/${uid}/meals/${mealId}/meal.jpg`);
        await deleteObject(storageRef);
      }
    } catch (err) {
      console.warn('Firestore deleteDoc failed, removing from local cache:', err);
    }

    const cached = await this.getLocalMeals();
    const filtered = cached.filter((m) => m.id !== mealId);
    await AsyncStorage.setItem(LOCAL_MEALS_KEY, JSON.stringify(filtered));
  }

  /**
   * Subscribe to real-time meals for a given user (Section 51)
   */
  static subscribeToMeals(uid: string, onUpdate: (meals: Meal[]) => void) {
    try {
      const mealsCol = collection(db, 'users', uid, 'meals');
      const q = query(mealsCol, orderBy('createdAt', 'desc'));

      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const meals: Meal[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data() as FirestoreMealDocument;
              return {
                id: data.id,
                userId: uid,
                name: data.name,
                mealType: data.mealType,
                imageUri: data.imageUrl,
                foods: data.foods || [],
                nutrition: {
                  calories: data.totalCalories,
                  protein: data.totalProtein,
                  carbs: data.totalCarbs,
                  fat: data.totalFat,
                },
                consumedAt: typeof data.consumedAt === 'string' ? data.consumedAt : '12:00 PM',
                confidence: data.confidence,
              };
            });
            AsyncStorage.setItem(LOCAL_MEALS_KEY, JSON.stringify(meals));
            onUpdate(meals);
          }
        },
        (error) => {
          console.warn('Meals onSnapshot listener error, using local cache:', error.message);
          this.getLocalMeals().then(onUpdate);
        }
      );
    } catch (err) {
      console.warn('Failed to attach meals listener, falling back to local storage:', err);
      this.getLocalMeals().then(onUpdate);
      return () => {};
    }
  }

  /**
   * Get cached meals from local storage
   */
  static async getLocalMeals(): Promise<Meal[]> {
    const cached = await AsyncStorage.getItem(LOCAL_MEALS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    // Return baseline initial meals if cache is empty
    return initialTodayMeals;
  }
}
