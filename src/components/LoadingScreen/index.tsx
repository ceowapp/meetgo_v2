import React, { useEffect } from 'react';
import {View, ActivityIndicator, Text, StyleSheet, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from 'services/themes/colors';

const LoadingScreen = () => {
  const pulseAnim = new Animated.Value(0);
  const floatAnim = new Animated.Value(0);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  return (
    <LinearGradient 
      colors={COLORS.bgRadient} 
      style={styles.container}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
    >
      <Animated.View 
        style={[
          styles.contentContainer,
          { transform: [{ translateY }] }
        ]}
      >
        <Animated.View 
          style={[
            styles.loaderWrapper,
            { transform: [{ scale: pulseScale }] }
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.white} />
        </Animated.View>
        <Text style={styles.text}>Loading...</Text>
      </Animated.View>
      <View style={styles.bottomGlow} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    marginTop: 20,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    height: 100,
    width: '100%',
    backgroundColor: COLORS.tertiary,
    opacity: 0.05,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  }
});

export default LoadingScreen;