import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as UIButton, ButtonProps } from '@ui-kitten/components';

// Custom button component (extends UI Kitten Button)
export const Button: React.FC<ButtonProps> = (props) => {
  return <UIButton {...props} style={[styles.button, props.style]} />;
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
});
