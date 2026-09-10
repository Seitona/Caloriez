import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { ScreenContainer } from '../components/common/ScreenContainer';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || 'User');
  const [editAge, setEditAge] = useState(String(user?.age || 25));
  const [editWeight, setEditWeight] = useState(String(user?.weightKg || 70));
  const [editTargetWeight, setEditTargetWeight] = useState(String(user?.targetWeightKg || 65));

  const handleSaveProfile = () => {
    updateProfile({
      displayName: editName.trim() || 'User',
      age: Number(editAge) || 25,
      weightKg: Number(editWeight) || 70,
      targetWeightKg: Number(editTargetWeight) || 65,
    });
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile details have been updated successfully.');
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, marginLeft: Spacing.sm, flex: 1 }]}>
          User Profile
        </Text>
        <Button
          title="Edit"
          onPress={() => setIsEditing(true)}
          variant="outline"
          size="sm"
          icon={<Ionicons name="create-outline" size={14} color={colors.accent} />}
        />
      </View>

      {/* User Info Header Card */}
      <Card style={styles.profileCard} padding="lg">
        <View style={styles.profileRow}>
          <Avatar uri={user?.avatarUrl} name={user?.displayName || 'User'} size={72} />
          <View style={styles.nameCol}>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              {user?.email || ''}
            </Text>
            <View style={[styles.googlePill, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="logo-google" size={12} color={colors.textSecondary} />
              <Text style={[Typography.tiny, { color: colors.textSecondary, marginLeft: 4 }]}>
                Google Verified
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Physical Stats Grid */}
      <Text style={[Typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
        Biometric Information
      </Text>

      <View style={styles.statsGrid}>
        <Card style={styles.statBox} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Age</Text>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>
            {user?.age || 28} <Text style={[Typography.caption, { color: colors.textSecondary }]}>yrs</Text>
          </Text>
        </Card>

        <Card style={styles.statBox} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Biological Sex</Text>
          <Text style={[Typography.h2, { color: colors.textPrimary, textTransform: 'capitalize' }]}>
            {user?.sex || 'male'}
          </Text>
        </Card>

        <Card style={styles.statBox} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Height</Text>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>
            {user?.heightCm || 175} <Text style={[Typography.caption, { color: colors.textSecondary }]}>cm</Text>
          </Text>
        </Card>

        <Card style={styles.statBox} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Current Weight</Text>
          <Text style={[Typography.h2, { color: colors.calorie }]}>
            {user?.weightKg || 76} <Text style={[Typography.caption, { color: colors.calorie }]}>kg</Text>
          </Text>
        </Card>

        <Card style={styles.statBox} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Goal Weight</Text>
          <Text style={[Typography.h2, { color: colors.accent }]}>
            {user?.targetWeightKg || 70} <Text style={[Typography.caption, { color: colors.accent }]}>kg</Text>
          </Text>
        </Card>

        <Card style={styles.statBox} padding="md">
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>Activity Level</Text>
          <Text style={[Typography.bodySemiBold, { color: colors.textPrimary, textTransform: 'capitalize', marginTop: 4 }]}>
            {user?.activityLevel || 'moderate'}
          </Text>
        </Card>
      </View>

      {/* Fitness Program Summary */}
      <Card style={styles.programCard} padding="lg">
        <View style={styles.programHeader}>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>
            Current Fitness Strategy
          </Text>
          <Ionicons name="sparkles" size={18} color={colors.accent} />
        </View>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
          Calorie deficit geared for fat loss at ~0.5 kg/week with high protein preservation (130g/day target).
        </Text>
      </Card>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[Typography.h2, { color: colors.textPrimary }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Display Name"
              value={editName}
              onChangeText={setEditName}
            />
            <Input
              label="Age"
              value={editAge}
              onChangeText={setEditAge}
              keyboardType="numeric"
            />
            <Input
              label="Current Weight (kg)"
              value={editWeight}
              onChangeText={setEditWeight}
              keyboardType="numeric"
            />
            <Input
              label="Target Goal Weight (kg)"
              value={editTargetWeight}
              onChangeText={setEditTargetWeight}
              keyboardType="numeric"
            />

            <Button
              title="Save Changes"
              onPress={handleSaveProfile}
              size="lg"
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  backBtn: {
    padding: 4,
  },
  profileCard: {
    marginBottom: Spacing.base,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  nameCol: {
    flex: 1,
  },
  googlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statBox: {
    width: '48%',
  },
  programCard: {
    marginBottom: Spacing.lg,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
});
