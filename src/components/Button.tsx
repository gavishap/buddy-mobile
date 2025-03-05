import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Colors } from '../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[size];
    const variantStyle = styles[variant];
    const disabledStyle = disabled ? styles.disabled : {};

    return [baseStyle, sizeStyle, variantStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const baseTextStyle = styles.text;
    const variantTextStyle = styles[`${variant}Text`];
    const disabledTextStyle = disabled ? styles.disabledText : {};

    return [baseTextStyle, variantTextStyle, disabledTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#fff' : Colors.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  text: {
    fontWeight: 'bold'
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32
  },
  primary: {
    backgroundColor: Colors.primary
  },
  primaryText: {
    color: '#fff'
  },
  secondary: {
    backgroundColor: Colors.secondary
  },
  secondaryText: {
    color: '#fff'
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary
  },
  outlineText: {
    color: Colors.primary
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  ghostText: {
    color: Colors.primary
  },
  disabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc'
  },
  disabledText: {
    color: '#888'
  }
});
