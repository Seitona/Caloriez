import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { FoodItem } from '../../types/meal';
import { Badge } from '../common/Badge';

interface FoodItemRowProps {
  item: FoodItem;
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FoodItemRow({ item, editable = false, onEdit, onDelete }: FoodItemRowProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftCol}>
        <Text style={[Typography.bodySemiBold, { color: colors.textPrimary }]}>
          {item.name}
        </Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          {item.portion} {item.grams ? `(${item.grams} g)` : ''}
        </Text>
      </View>

      <View style={styles.rightCol}>
        <View style={styles.macroInfo}>
          <Text style={[Typography.bodySemiBold, { color: colors.calorie }]}>
            {item.calories} kcal
          </Text>
          <Text style={[Typography.caption, { color: colors.protein }]}>
            {item.protein}g P • {item.carbs}g C • {item.fat}g F
          </Text>
        </View>

        {editable && onDelete ? (
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  macroInfo: {
    alignItems: 'flex-end',
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
});
