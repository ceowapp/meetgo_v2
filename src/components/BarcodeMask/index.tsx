import React, {FC, memo} from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  BarcodeMaskProps,
  EdgePosition,
  DimensionUnit,
} from './type';
import styles from './styles';

const noop = () => {};

// Define default props
const defaultProps = {
  width: 280,
  height: 230,
  edgeWidth: 20,
  edgeHeight: 20,
  edgeColor: '#fff',
  edgeBorderWidth: 4,
  edgeRadius: 0,
  backgroundColor: '#eee',
  maskOpacity: 1,
  animatedLineColor: '#fff',
  animatedLineOrientation: 'horizontal',
  animatedLineThickness: 2,
  animationDuration: 2000,
  showAnimatedLine: true,
};

const BarcodeMask: FC<BarcodeMaskProps> = memo(
  ({
    width = defaultProps.width,
    height = defaultProps.height,
    startValue = 0,
    destinationValue,
    backgroundColor = defaultProps.backgroundColor,
    edgeBorderWidth = defaultProps.edgeBorderWidth,
    edgeColor = defaultProps.edgeColor,
    edgeHeight = defaultProps.edgeHeight,
    edgeWidth = defaultProps.edgeWidth,
    edgeRadius = defaultProps.edgeRadius,
    maskOpacity = defaultProps.maskOpacity,
    animatedComponent,
    animatedLineColor = defaultProps.animatedLineColor,
    animatedLineOrientation = defaultProps.animatedLineOrientation,
    animatedLineThickness = defaultProps.animatedLineThickness,
    animationDuration = defaultProps.animationDuration,
    showAnimatedLine = defaultProps.showAnimatedLine,
    onLayoutChange,
    outerBoundingRect,
    onOuterLayout,
  }) => {
    const edgeBorderStyle = React.useRef<{
      [position in EdgePosition]: ViewStyle;
    }>({
      topRight: {
        borderRightWidth: edgeBorderWidth as number,
        borderTopWidth: edgeBorderWidth as number,
        borderTopRightRadius: edgeRadius,
        top: -(edgeBorderWidth as number),
        right: -(edgeBorderWidth as number),
      },
      topLeft: {
        borderTopWidth: edgeBorderWidth as number,
        borderLeftWidth: edgeBorderWidth as number,
        borderTopLeftRadius: edgeRadius,
        top: -(edgeBorderWidth as number),
        left: -(edgeBorderWidth as number),
      },
      bottomRight: {
        borderBottomWidth: edgeBorderWidth as number,
        borderRightWidth: edgeBorderWidth as number,
        borderBottomRightRadius: edgeRadius,
        bottom: -(edgeBorderWidth as number),
        right: -(edgeBorderWidth as number),
      },
      bottomLeft: {
        borderBottomWidth: edgeBorderWidth as number,
        borderLeftWidth: edgeBorderWidth as number,
        borderBottomLeftRadius: edgeRadius,
        bottom: -(edgeBorderWidth as number),
        left: -(edgeBorderWidth as number),
      },
    });

    // Calculate dimensions outside of worklets
    const getAnimatedLineDimension = (
      dimension: DimensionUnit | undefined,
      outerDimension: 'width' | 'height',
    ) => {
      const outer = outerBoundingRect?.[outerDimension] ?? 0;
      if (dimension) {
        if (typeof dimension === 'number') {
          return dimension * 0.9;
        }
        return dimension.endsWith('%')
          ? (Number(dimension.split('%')[0]) / 100) * (outer || 1) * 0.9
          : Number(dimension.split(/\d+/)[0]) * (outer || 1) * 0.9;
      }
      return outer * 0.9;
    };

    const getAnimatedValue = (
      dimension: DimensionUnit | undefined,
      outerDimension: 'width' | 'height',
    ) => {
      const calculatedDimension = getAnimatedLineDimension(
        dimension,
        outerDimension,
      );
      const fullDimension = calculatedDimension / 0.9;
      return fullDimension - (animatedLineThickness as number);
    };

    // Pre-calculate values to avoid calling non-worklet functions in worklets
    const widthDimension = getAnimatedLineDimension(width, 'width');
    const heightDimension = getAnimatedLineDimension(height, 'height');
    const maxAnimatedWidth = getAnimatedValue(width, 'width');
    const maxAnimatedHeight = getAnimatedValue(height, 'height');
    const finderWidth = widthDimension / 0.9;
    const finderHeight = heightDimension / 0.9;

    // Create animated values using Reanimated hooks
    const animationPosition = useSharedValue(startValue);
    
    // Start the animation when component mounts
    React.useEffect(() => {
      const destination = animatedLineOrientation === 'horizontal' 
        ? maxAnimatedHeight
        : maxAnimatedWidth;
      
      animationPosition.value = startValue;
      
      // Set up the repeating animation
      animationPosition.value = withRepeat(
        withTiming(
          destinationValue || destination, 
          { 
            duration: animationDuration,
            easing: Easing.inOut(Easing.ease)
          }
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    }, [maxAnimatedWidth, maxAnimatedHeight, animationDuration, animatedLineOrientation, startValue, destinationValue]);

    // Create animated style as a worklet function
    const animatedLineStyle = useAnimatedStyle(() => {
      if (animatedLineOrientation === 'horizontal') {
        return {
          ...styles.animatedLine,
          height: animatedLineThickness,
          width: widthDimension,
          backgroundColor: animatedLineColor,
          top: animationPosition.value,
        };
      }
      return {
        ...styles.animatedLine,
        width: animatedLineThickness,
        height: heightDimension,
        backgroundColor: animatedLineColor,
        left: animationPosition.value,
      };
    });

    const renderEdge = (edgePosition: EdgePosition) => {
      const defaultStyle = {
        width: edgeWidth,
        height: edgeHeight,
        borderColor: edgeColor,
        zIndex: 2,
      };
      return (
        <View
          style={{
            ...defaultStyle,
            ...styles[edgePosition],
            ...edgeBorderStyle.current[edgePosition],
          }}
        />
      );
    };

    const renderAnimated = () => {
      if (showAnimatedLine) {
        if (animatedComponent) {
          return animatedComponent(finderWidth, finderHeight);
        }

        return <Animated.View style={animatedLineStyle} />;
      }

      return null;
    };

    const edgeStyle = {
      backgroundColor,
      opacity: maskOpacity,
      flex: 1,
    };

    return (
      <View style={styles.container}>
        <View
          onLayout={onLayoutChange || noop}
          style={{
            ...styles.finder,
            width: finderWidth,
            height: finderHeight,
          }}>
          {renderEdge('topLeft')}
          {renderEdge('topRight')}
          {renderEdge('bottomLeft')}
          {renderEdge('bottomRight')}
          {renderAnimated()}
        </View>
        <View style={styles.maskOuter} onLayout={onOuterLayout || noop}>
          <View
            style={{
              ...styles.maskRow,
              ...edgeStyle,
            }}
          />
          <View style={{height, ...styles.maskCenter}}>
            <View style={edgeStyle} />
            <View
              style={{
                ...styles.maskInner,
                width,
                height,
                borderRadius: edgeRadius,
              }}
            />
            <View style={edgeStyle} />
          </View>
          <View
            style={{
              ...styles.maskRow,
              ...edgeStyle,
            }}
          />
        </View>
      </View>
    );
  }
);

export default BarcodeMask;