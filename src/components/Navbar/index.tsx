import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import { navigateScreen } from 'navigation/RootNavigation';
import { STACK_NAVIGATOR } from 'navigation/types';
import LanguageSelector from '../LanguageSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IContainerProps = {
  style?: object;
  children?: React.ReactNode;
  onScroll?: (event: any) => void;
};

const Navbar: React.FC<IContainerProps> = ({ 
  style = {}, 
  children = <></>, 
  onScroll 
}) => {
  const insets = useSafeAreaInsets();
  const [scrollY] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(true);
  
  const onLanguagePress = () => {
    navigateScreen(STACK_NAVIGATOR.LANGUAGE_SETTING);
  };
  
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setIsVisible(value < 50);
    });
    
    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY]);
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 5],
    extrapolate: 'clamp',
  });
  
  const shadowOpacity = headerElevation.interpolate({
    inputRange: [0, 5],
    outputRange: [0, 0.25],
  });
  
  const handleScroll = onScroll ? 
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], 
    { useNativeDriver: false, listener: onScroll }) : 
    undefined;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={[
          styles.container,
          style,
          { 
            paddingTop: Platform.OS === 'ios' ? insets.top : 16,
            opacity: headerOpacity,
            elevation: headerElevation,
            shadowOpacity,
          }
        ]}
      >
        {children}
        <View style={styles.languageSelectorWrapper}>
          <LanguageSelector 
            onPress={onLanguagePress}
            containerStyle={styles.languageSelector}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 0,
    shadowColor: '#43108F',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  languageSelectorWrapper: {
    marginLeft: 'auto',
  },
  languageSelector: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 8,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  }
});

export default Navbar;
