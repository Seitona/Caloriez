import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { sampleAIMealScans } from '../../data/mockMeals';

export default function CameraMockScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [flash, setFlash] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  const currentSample = sampleAIMealScans[selectedSampleIndex];

  const handleCapture = () => {
    // Navigate to Photo Review (Screen 11) with captured photo
    router.push({
      pathname: '/meal/preview',
      params: { sampleIndex: String(selectedSampleIndex) },
    });
  };

  const handleOpenGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        router.push({
          pathname: '/meal/preview',
          params: { imageUri: result.assets[0].uri, sampleIndex: '0' },
        });
      }
    } catch {
      // Fallback to sample
      router.push({
        pathname: '/meal/preview',
        params: { sampleIndex: String(selectedSampleIndex) },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Viewfinder Preview with sample dish mockup */}
      <View style={styles.viewfinder}>
        <Image
          source={{ uri: currentSample.imageUri }}
          style={styles.cameraImage}
          resizeMode="cover"
        />

        {/* Viewfinder focus reticle frame */}
        <View style={styles.reticleContainer}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <View style={styles.focusPill}>
            <Ionicons name="scan-outline" size={16} color="#FFFFFF" />
            <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 4 }]}>
              Food in viewfinder
            </Text>
          </View>
        </View>

        {/* Top Controls Overlay */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.circleBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.titleBadge}>
            <Text style={[Typography.captionMedium, { color: '#FFFFFF' }]}>
              AI Food Scanner
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setFlash(!flash)}
            style={[styles.circleBtn, flash && { backgroundColor: '#FBBF24' }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={flash ? 'flash' : 'flash-off'}
              size={20}
              color={flash ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Sample Food Switcher (convenient interactive switcher in camera preview) */}
        <View style={styles.sampleBar}>
          <Text style={[Typography.tiny, { color: 'rgba(255,255,255,0.8)', marginBottom: 6 }]}>
            TAP TO SWITCH DETECTED DISH:
          </Text>
          <View style={styles.samplePills}>
            {sampleAIMealScans.map((s, idx) => {
              const isSelected = selectedSampleIndex === idx;
              return (
                <TouchableOpacity
                  key={s.detectedMealName}
                  onPress={() => setSelectedSampleIndex(idx)}
                  style={[
                    styles.samplePill,
                    isSelected && { backgroundColor: colors.accent, borderColor: colors.accent },
                  ]}
                >
                  <Text
                    style={[
                      Typography.tiny,
                      { color: '#FFFFFF', fontWeight: isSelected ? '700' : '400' },
                    ]}
                  >
                    {s.detectedMealName.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Bottom Controls Bar */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          onPress={handleOpenGallery}
          style={styles.galleryShortcut}
        >
          <Ionicons name="images-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Shutter Button */}
        <TouchableOpacity
          onPress={handleCapture}
          activeOpacity={0.7}
          style={styles.shutterOuter}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <View style={{ width: 48 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewfinder: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  reticleContainer: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '30%',
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#FFFFFF',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  sampleBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  samplePills: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  samplePill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomControls: {
    height: 110,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  galleryShortcut: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});
