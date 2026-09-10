import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Meal } from '../../types/meal';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
  onDelete?: () => void;
}

export function MealCard({ meal, onPress, onDelete }: MealCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} padding="md" onPress={onPress}>
      <View style={styles.row}>
        {meal.imageUri ? (
          <Image source={{ uri: meal.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="fast-food-outline" size={24} color={colors.textSecondary} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.topLine}>
            <Text
              style={[Typography.bodySemiBold, { color: colors.textPrimary, flex: 1 }]}
              numberOfLines={1}
            >
              {meal.name}
            </Text>
            {onDelete ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
            {meal.consumedAt}
          </Text>

          <View style={styles.badgesRow}>
            <Badge
              label={`${meal.nutrition.calories} kcal`}
              variant="calorie"
            />
            <Badge
              label={`${meal.nutrition.protein}g protein`}
              variant="protein"
            />
            <Text style={[Typography.tiny, { color: colors.textSecondary, marginLeft: 'auto' }]}>
              {meal.nutrition.carbs}C • {meal.nutrition.fat}F
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    padding: 4,
    marginLeft: Spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
