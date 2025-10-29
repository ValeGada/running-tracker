import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Spinner as UISpinner, SpinnerProps, Text } from '@ui-kitten/components';

interface CustomSpinnerProps extends Omit<SpinnerProps, 'size'> {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  text?: string;
  overlay?: boolean;
  containerStyle?: ViewStyle;
}

export const Spinner: React.FC<CustomSpinnerProps> = ({
  size = 'medium',
  text,
  overlay = false,
  containerStyle,
  ...props
}) => {
  const spinnerContent = (
    <View style={[styles.container, containerStyle]}>
      <UISpinner size={size} {...props} />
      {text && (
        <Text style={styles.text} category="s1" appearance="hint">
          {text}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlay}>
        {spinnerContent}
      </View>
    );
  }

  return spinnerContent;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    marginTop: 12,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});