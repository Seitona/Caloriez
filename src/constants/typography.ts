import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  hero: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
  bodySemiBold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  tiny: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  numberLarge: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -1,
  },
  numberMedium: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
};
