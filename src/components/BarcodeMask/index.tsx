import React, {FC, memo} from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, {EasingNode} from 'react-native-reanimated';
import {
  BarcodeMaskProps,
  RunTimingFn,
  EdgePosition,
  DimensionUnit,
} from './type';
import styles from './styles';

const {Value, Clock, block, cond, set, startClock, timing, eq} = Animated;

const runTiming: RunTimingFn = (
  clock: Animated.Clock,
  value: number,
  destination: number,
  duration: number,
) => {
  const timingState: Animated.TimingState = {
    finished: new Value(0),
    position: new Value(value),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const timingConfig: Animated.TimingConfig = {
    duration,
    toValue: new Value(destination),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    easing: EasingNode.inOut(EasingNode.ease),
  };

  return block([
    startClock(clock),
    timing(clock, timingState, timingConfig),
    cond(timingState.finished, [
      set(timingState.finished, 0),
      set(timingState.time, 0),
      set(timingState.frameTime, 0),
      set(
        timingState.position,
        cond(eq(timingState.position, destination), destination, value),
      ),
      set(
        timingConfig.toValue as Animated.Value<number>,
        cond(eq(timingState.position, destination), value, destination),
      ),
    ]),
    timingState.position,
  ]);
};

const noop = () => {};

const BarcodeMask: FC<BarcodeMaskProps> = memo(
  ({
    width,
    height,
    startValue,
    destinationValue,
    backgroundColor,
    edgeBorderWidth,
    edgeColor,
    edgeHeight,
    edgeWidth,
    edgeRadius,
    maskOpacity,
    animatedComponent,
    animatedLineColor,
    animatedLineOrientation,
    animatedLineThickness,
    animationDuration,
    showAnimatedLine,
    runTimingFn,
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

    const selfAnimatedLineDimension = (
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

    const selfAnimatedValue = (
      dimension: DimensionUnit | undefined,
      outerDimension: 'width' | 'height',
    ) => {
      const calculatedDimension = selfAnimatedLineDimension(
        dimension,
        outerDimension,
      );
      const fullDimension = calculatedDimension / 0.9;

      return fullDimension - (animatedLineThickness as number);
    };

    const seftAnimatedLineStyle = () => {
      if (animatedLineOrientation === 'horizontal') {
        const seftwidth = selfAnimatedLineDimension(width, 'width');
        const destination = selfAnimatedValue(height, 'height');
        return {
          ...styles.animatedLine,
          height: animatedLineThickness,
          width: seftwidth,
          backgroundColor: animatedLineColor,
          top: runTimingFn?.(
            new Clock(),
            startValue || 0,
            destinationValue || destination,
            animationDuration as number,
          ),
        };
      }
      const seftheight = selfAnimatedLineDimension(height, 'height');
      const destination = selfAnimatedValue(width, 'width');
      return {
        ...styles.animatedLine,
        width: animatedLineThickness,
        height: seftheight,
        backgroundColor: animatedLineColor,
        left: runTimingFn?.(
          new Clock(),
          startValue || 0,
          destinationValue || destination,
          animationDuration as number,
        ),
      };
    };

    const seftRenderEdge = (edgePosition: EdgePosition) => {
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

    const seftwidth = selfAnimatedLineDimension(width, 'width') / 0.9;
    const seftheight = selfAnimatedLineDimension(height, 'height') / 0.9;

    const seftRenderAnimated = () => {
      if (showAnimatedLine) {
        if (animatedComponent) {
          return animatedComponent(seftwidth, seftheight);
        }

        return <Animated.View style={seftAnimatedLineStyle()} />;
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
            width: seftwidth,
            height: seftheight,
          }}>
          {seftRenderEdge('topLeft')}
          {seftRenderEdge('topRight')}
          {seftRenderEdge('bottomLeft')}
          {seftRenderEdge('bottomRight')}
          {seftRenderAnimated()}
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
  },
);

BarcodeMask.defaultProps = {
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
  runTimingFn: runTiming,
  showAnimatedLine: true,
};

export default BarcodeMask;
