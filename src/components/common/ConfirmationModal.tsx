import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmationModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[Typography.h2, styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
              <Text style={[Typography.body, styles.message, { color: colors.textSecondary }]}>
                {message}
              </Text>
              <View style={styles.actions}>
                <Button
                  title={cancelTitle}
                  onPress={onCancel}
                  variant="secondary"
                  style={styles.button}
                />
                <Button
                  title={confirmTitle}
                  onPress={onConfirm}
                  variant={isDestructive ? 'danger' : 'primary'}
                  style={styles.button}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  message: {
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
