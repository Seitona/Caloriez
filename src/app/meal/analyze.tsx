import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { sampleAIMealScans } from '../../data/mockMeals';
import { AiService } from '../../services/aiService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { RotatingMessage } from '../../components/meal/RotatingMessage';

export default function AIAnalyzingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ sampleIndex?: string; imageUri?: string }>();

  const sampleIndex = Number(params.sampleIndex || '0');
  const sample = sampleAIMealScans[sampleIndex] || sampleAIMealScans[0];
  const imageUri = params.imageUri || sample.imageUri;

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function executeAIInference() {
      try {
        setHasError(false);
        const result = await AiService.estimateMealFromImage(imageUri || '', sampleIndex);
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
  }, [imageUri, sampleIndex]);

  const handleAnalysisComplete = () => {
    router.replace({
      pathname: '/meal/estimate',
      params: {
        sampleIndex: String(sampleIndex),
        imageUri,
        aiResult: analysisResult ? JSON.stringify(analysisResult) : undefined,
      },
    });
  };

  const handleRetry = () => {
    setHasError(false);
    AiService.estimateMealFromImage(imageUri || '', sampleIndex)
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
          <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />

          {/* Animated Scanning Line overlay */}
          <View style={[styles.scanBeam, { backgroundColor: colors.accent }]} />

          <View style={styles.aiPill}>
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 4, fontWeight: '700' }]}>
              VISION AI PROCESSING
            </Text>
          </View>
        </View>

        {!hasError ? (
          <>
            <ActivityIndicator size="large" color={colors.accent} style={styles.spinner} />
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
          /* Production error recovery state (Section 33) */
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

      <Text style={[Typography.tiny, styles.footerNote, { color: colors.textSecondary }]}>
        Authenticated AI inference endpoint with client-side rate protection.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  photoCard: {
    width: 240,
    height: 240,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    marginBottom: Spacing.xl,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  scanBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '48%',
    height: 3,
    opacity: 0.85,
  },
  aiPill: {
    position: 'absolute',
    bottom: Spacing.sm,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginVertical: Spacing.sm,
  },
  skipButton: {
    marginTop: Spacing.sm,
  },
  errorCard: {
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.base,
  },
  errorButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  footerNote: {
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
});
