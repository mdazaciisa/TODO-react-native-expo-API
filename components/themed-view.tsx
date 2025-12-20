import { Colors } from '@/constants/theme';
import React from 'react';
import { View, type ViewProps, useColorScheme } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const scheme = useColorScheme() ?? 'light';
  const backgroundColor =
    scheme === 'dark' ? (darkColor ?? Colors.dark.background) : (lightColor ?? Colors.light.background);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
