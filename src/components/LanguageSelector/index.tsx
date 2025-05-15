import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: () => void;
  containerStyle?: any;
};

const LanguageSelector: React.FC<Props> = ({ onPress, containerStyle }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.container, containerStyle]}
      activeOpacity={0.7}
    >
      <Icon name="translate" size={22} color="#FFFFFF" style={styles.icon} /> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(132, 0, 222, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#43108F',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icon: {
    marginRight: 4,
  }
});

export default LanguageSelector;