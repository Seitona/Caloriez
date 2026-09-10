import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { AiService } from '../../services/aiService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { RotatingMessage } from '../../components/meal/RotatingMessage';

export default function AIAnalyzingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri?: string; imageBase64?: string }>();

  const imageUri = params.imageUri;
  const imageBase64 = params.imageBase64;

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function executeAIInference() {
      try {
        setHasError(false);
        const result = await AiService.estimateMealFromImage(imageUri || '', imageBase64);
        if (isMounted) {
          setAnalysisResult(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setHasError(true);
          setErrorMessage(err.message || 'We could not analyze this meal.');
        }
      }
    }

    executeAIInference();

    return () => {
      isMounted = false;
    };
  }, [imageUri, imageBase64]);

  const handleAnalysisComplete = () => {
    router.replace({
      pathname: '/meal/estimate',
      params: {
        imageUri: imageUri || '',
        aiResult: analysisResult ? JSON.stringify(analysisResult) : undefined,
      },
    });
  };

  const handleRetry = () => {
    setHasError(false);
    AiService.estimateMealFromImage(imageUri || '', imageBase64)
      .then((res) => {
        setAnalysisResult(res);
      })
      .catch((err) => {
        setHasError(true);
        setErrorMessage(err.message || 'We could not analyze this meal.');
      });
  };

  return (
    <ScreenContainer scrollable={false} contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Scanning Food Photo Card */}
        <View style={[styles.photoCard, { borderColor: colors.accent }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={[styles.photo, styles.placeholderBox]}>
              <Ionicons name="fast-food-outline" size={64} color="rgba(255,255,255,0.3)" />
            </View>
          )}

          {/* Animated Scanning Line overlay */}
          <View style={[styles.scanBeam, { backgroundColor: '#F97316' }]} />

          <View style={styles.aiPill}>
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 4, fontWeight: '700' }]}>
              VISION AI PROCESSING
            </Text>
          </View>
        </View>

        {!hasError ? (
          <>
            <ActivityIndicator size="large" color="#F97316" style={styles.spinner} />
            <RotatingMessage onComplete={handleAnalysisComplete} intervalMs={1100} />

            <Button
              title="Skip to Results →"
              onPress={handleAnalysisComplete}
              variant="ghost"
              size="sm"
              style={styles.skipButton}
            />
          </>
        ) : (
          /* Error recovery state */
          <Card style={styles.errorCard} padding="lg">
            <Ionicons name="alert-circle" size={36} color={colors.danger} />
            <Text style={[Typography.h3, { color: colors.danger, marginTop: Spacing.sm }]}>
              Analysis Failed
            </Text>
            <Text
              style={[
                Typography.caption,
                { color: colors.textSecondary, textAlign: 'center', marginVertical: Spacing.sm },
              ]}
            >
              {errorMessage || "We couldn't analyze this meal. Try another photo or check your connection."}
            </Text>
            <View style={styles.errorButtonsRow}>
              <Button
                title="Try Another Photo"
                onPress={() => router.back()}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                title="Retry"
                onPress={handleRetry}
                variant="secondary"
                size="sm"
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  photoCard: {
    width: 260,
    height: 260,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    position: 'relative',
    marginBottom: Spacing.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBeam: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.9,
  },
  aiPill: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginVertical: Spacing.lg,
  },
  skipButton: {
    marginTop: Spacing.lg,
  },
  errorCard: {
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.md,
  },
  errorButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    marginTop: Spacing.md,
  },
});
