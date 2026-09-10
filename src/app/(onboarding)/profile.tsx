import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MeasurementUnit, Sex } from '../../types/user';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SegmentedControl } from '../../components/common/SegmentedControl';

export default function BasicProfileScreen() {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Hadji');
  const [age, setAge] = useState(user?.age ? String(user.age) : '28');
  const [sex, setSex] = useState<Sex>(user?.sex || 'male');
  const [units, setUnits] = useState<MeasurementUnit>(user?.units || 'metric');
  const [height, setHeight] = useState(user?.heightCm ? String(user.heightCm) : '175');
  const [weight, setWeight] = useState(user?.weightKg ? String(user.weightKg) : '76');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) newErrors.displayName = 'Name is required';
    if (!age || isNaN(Number(age)) || Number(age) < 14) newErrors.age = 'Enter a valid age (14+)';
    if (!height || isNaN(Number(height))) newErrors.height = 'Enter a valid height';
    if (!weight || isNaN(Number(weight))) newErrors.weight = 'Enter a valid weight';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateProfile({
      displayName: displayName.trim(),
      age: Number(age),
      sex,
      units,
      heightCm: Number(height),
      weightKg: Number(weight),
    });

    router.push('/(onboarding)/goal');
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Onboarding Progress Header */}
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <Text style={[Typography.captionMedium, { color: colors.accent }]}>
            Step 1 of 5
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Basic Profile
          </Text>
        </View>
        <ProgressBar progress={0.2} color={colors.accent} height={6} />
      </View>

      <Text style={[Typography.hero, styles.title, { color: colors.textPrimary }]}>
        Tell us about yourself
      </Text>
      <Text style={[Typography.body, styles.subtitle, { color: colors.textSecondary }]}>
        This helps our AI calibrate your baseline metabolic rate accurately.
      </Text>

      {/* Measurement Unit Selector */}
      <View style={styles.section}>
        <Text style={[Typography.captionMedium, styles.sectionLabel, { color: colors.textSecondary }]}>
          Measurement System
        </Text>
        <SegmentedControl
          options={[
            { value: 'metric' as const, label: 'Metric (kg, cm)' },
            { value: 'imperial' as const, label: 'Imperial (lbs, ft)' },
          ]}
          selectedValue={units}
          onSelect={setUnits}
        />
      </View>

      {/* Display Name Input */}
      <Input
        label="Preferred Name"
        value={displayName}
        onChangeText={(text) => {
          setDisplayName(text);
          if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: '' }));
        }}
        placeholder="e.g. Alex"
        error={errors.displayName}
      />

      {/* Sex Selector */}
      <View style={styles.section}>
        <Text style={[Typography.captionMedium, styles.sectionLabel, { color: colors.textSecondary }]}>
          Biological Sex (for metabolic calculations)
        </Text>
        <View style={styles.sexRow}>
          <TouchableOpacity
            onPress={() => setSex('male')}
            style={[
              styles.sexButton,
              {
                backgroundColor: sex === 'male' ? colors.surfaceSecondary : colors.surface,
                borderColor: sex === 'male' ? colors.accent : colors.border,
              },
            ]}
          >
            <Ionicons
              name="male"
              size={20}
              color={sex === 'male' ? colors.accent : colors.textSecondary}
            />
            <Text
              style={[
                Typography.bodyMedium,
                { color: sex === 'male' ? colors.textPrimary : colors.textSecondary, marginLeft: 6 },
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSex('female')}
            style={[
              styles.sexButton,
              {
                backgroundColor: sex === 'female' ? colors.surfaceSecondary : colors.surface,
                borderColor: sex === 'female' ? colors.accent : colors.border,
              },
            ]}
          >
            <Ionicons
              name="female"
              size={20}
              color={sex === 'female' ? colors.accent : colors.textSecondary}
            />
            <Text
              style={[
                Typography.bodyMedium,
                { color: sex === 'female' ? colors.textPrimary : colors.textSecondary, marginLeft: 6 },
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Age, Height, Weight row */}
      <View style={styles.inputsRow}>
        <View style={{ flex: 1 }}>
          <Input
            label="Age"
            value={age}
            onChangeText={(text) => {
              setAge(text);
              if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
            }}
            keyboardType="numeric"
            placeholder="28"
            error={errors.age}
          />
        </View>

        <View style={{ flex: 1.2 }}>
          <Input
            label="Height"
            value={height}
            onChangeText={(text) => {
              setHeight(text);
              if (errors.height) setErrors((prev) => ({ ...prev, height: '' }));
            }}
            keyboardType="numeric"
            unit={units === 'metric' ? 'cm' : 'in'}
            placeholder={units === 'metric' ? '175' : '69'}
            error={errors.height}
          />
        </View>

        <View style={{ flex: 1.2 }}>
          <Input
            label="Current Weight"
            value={weight}
            onChangeText={(text) => {
              setWeight(text);
              if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
            }}
            keyboardType="numeric"
            unit={units === 'metric' ? 'kg' : 'lbs'}
            placeholder={units === 'metric' ? '76' : '168'}
            error={errors.weight}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue to Fitness Goals"
          onPress={handleContinue}
          size="lg"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.base,
  },
  sectionLabel: {
    marginBottom: Spacing.xs,
  },
  sexRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sexButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.xl,
  },
});
