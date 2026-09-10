import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

export default function CameraScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [flash, setFlash] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const handleCapture = async () => {
    if (capturing) return;
    try {
      setCapturing(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access in your device settings to photograph your food.'
        );
        setCapturing(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        router.push({
          pathname: '/meal/preview',
          params: {
            imageUri: result.assets[0].uri,
            imageBase64: result.assets[0].base64 || undefined,
          },
        });
      }
    } catch (e: any) {
      console.warn('Camera launch failed:', e);
      Alert.alert(
        'Camera Notice',
        'Camera could not be launched. You can also pick an existing food photo from your gallery.',
        [
          { text: 'Pick from Gallery', onPress: handleOpenGallery },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setCapturing(false);
    }
  };

  const handleOpenGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        router.push({
          pathname: '/meal/preview',
          params: {
            imageUri: result.assets[0].uri,
            imageBase64: result.assets[0].base64 || undefined,
          },
        });
      }
    } catch (e: any) {
      console.warn('Gallery pick error:', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Viewfinder Frame */}
      <View style={styles.viewfinder}>
        {/* Background Dark Canvas */}
        <View style={styles.darkCanvas}>
          <Ionicons name="restaurant-outline" size={72} color="rgba(255,255,255,0.15)" />
          <Text style={[Typography.body, styles.instructionsText]}>
            Position your meal in the frame
          </Text>
          <Text style={[Typography.caption, styles.subInstructionsText]}>
            Tap the shutter button below to snap a photo with your device camera
          </Text>
        </View>

        {/* Viewfinder Focus Reticle Frame */}
        <View style={styles.reticleContainer}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <View style={styles.focusPill}>
            <Ionicons name="scan-outline" size={16} color="#FFFFFF" />
            <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 6, fontWeight: '600' }]}>
              AI Calorie Lens
            </Text>
          </View>
        </View>

        {/* Top Controls Overlay */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.circleBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.titleBadge}>
            <Text style={[Typography.captionMedium, { color: '#FFFFFF' }]}>
              Food Scanner
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setFlash(!flash)}
            style={[styles.circleBtn, flash && { backgroundColor: '#FBBF24' }]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={flash ? 'flash' : 'flash-off'}
              size={20}
              color={flash ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Tips Footer in Viewfinder */}
        <View style={styles.tipsBar}>
          <View style={styles.tipPill}>
            <Ionicons name="sparkles" size={14} color="#FBBF24" />
            <Text style={[Typography.tiny, { color: '#FFFFFF', marginLeft: 6 }]}>
              Detects proteins, carbs, fats, & portions instantly
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Controls Bar */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          onPress={handleOpenGallery}
          style={styles.galleryShortcut}
          activeOpacity={0.7}
        >
          <Ionicons name="images-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Real Shutter Button */}
        <TouchableOpacity
          onPress={handleCapture}
          activeOpacity={0.7}
          disabled={capturing}
          style={styles.shutterOuter}
        >
          <View style={[styles.shutterInner, capturing && { opacity: 0.6 }]} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpenGallery}
          style={styles.galleryShortcut}
          activeOpacity={0.7}
        >
          <Ionicons name="folder-open-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
  darkCanvas: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  instructionsText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  subInstructionsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: Spacing.xs,
    textAlign: 'center',
    maxWidth: 280,
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  reticleContainer: {
    position: 'absolute',
    top: '22%',
    left: '10%',
    right: '10%',
    bottom: '26%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#F97316',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
  },
  tipsBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  bottomControls: {
    height: 120,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 24,
  },
  galleryShortcut: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F97316',
  },
});
