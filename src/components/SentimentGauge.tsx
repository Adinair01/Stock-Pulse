import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SentimentLabel } from '../types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SentimentGaugeProps {
  score: number; // 0 to 100
  label: SentimentLabel;
  summary: string;
}

export default function SentimentGauge({ score, label, summary }: SentimentGaugeProps) {
  // Dimensions
  const size = 250;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 30; // Shift down a bit since it's a semicircle

  // Gauge Path (Semicircle)
  // Arc length for semicircle is Math.PI * radius
  const arcLength = Math.PI * radius;

  // Colors
  const getColor = (val: number) => {
    if (val <= 40) return '#FF4757'; // Bearish
    if (val <= 60) return '#FFA502'; // Neutral
    return '#00D09C'; // Bullish
  };

  const currentColor = getColor(score);

  // Animation values
  const animatedScore = useSharedValue(50); // Start at neutral

  useEffect(() => {
    // Animate needle to final score
    animatedScore.value = withSpring(score, {
      damping: 12,
      stiffness: 90,
    });
  }, [score]);

  // Needle Props
  const animatedNeedleProps = useAnimatedProps(() => {
    // Map score (0-100) to angle (-90 to +90) + offset by 180 to point up start
    // A score of 0 should point left (-90 deg), 100 should point right (90 deg)
    const angle = ((animatedScore.value / 100) * 180) - 90;
    
    // Convert angle to radians for coordinates
    const angleRad = (angle * Math.PI) / 180;
    
    const needleLength = radius - 15;
    
    // Base of needle
    const x1 = cx - 5 * Math.cos(angleRad);
    const y1 = cy - 5 * Math.sin(angleRad);
    const x2 = cx + 5 * Math.cos(angleRad);
    const y2 = cy + 5 * Math.sin(angleRad);
    
    // Tip of needle (points along angle, minus 90 deg offset because it's pointing up)
    // Actually, simple line rotation is easier with transform
    
    return {
      // transform mapping is tricky with Reanimated SVG without specific wrapper,
      // So we will just use a view overlay for the needle for simpler rotation
    };
  });

  return (
    <View className="items-center my-6">
      <View style={{ width: size, height: size / 2 + 20, alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
        <Svg width={size} height={size}>
          <G rotation="-180" origin={`${cx}, ${cy}`}>
            {/* Bearish Segment (0-40) */}
            <Path
              d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos(Math.PI * 0.6)} ${cy - radius * Math.sin(Math.PI * 0.6)}`}
              stroke="#FF4757"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              opacity={0.3}
            />
             {/* Base Track */}
             <Path
              d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${cy}`}
              stroke="#2A3249"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            {/* Active Track */}
            <AnimatedPath
              d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${cy}`}
              stroke={currentColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              animatedProps={useAnimatedProps(() => ({
                strokeDashoffset: arcLength - (arcLength * animatedScore.value) / 100,
              }))}
            />
          </G>
        </Svg>
        
        {/* Animated Needle View for easier center rotation */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: 'center', justifyContent: 'flex-end', top: -30 }, // Align to fake cy
          ]}
        >
          <Animated.View
             style={[
               {
                 width: 4,
                 height: radius - 10,
                 backgroundColor: '#FFFFFF',
                 borderRadius: 2,
                 position: 'absolute',
                 bottom: 0,
                 transformOrigin: 'bottom',
               },
               useAnimatedProps(() => ({
                 transform: [{ rotate: `${(animatedScore.value / 100) * 180 - 90}deg` }] as any
               }))
             ]}
          />
          {/* Center Pin */}
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: currentColor, position: 'absolute', bottom: -8 }} />
        </Animated.View>
        
        {/* Score Text */}
        <View style={{ position: 'absolute', bottom: -24, alignItems: 'center' }}>
            <Text className="text-3xl font-bold text-white">{score}</Text>
        </View>
      </View>

      <View className="mt-8 items-center px-6">
        <View className="flex-row items-center mb-2">
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: currentColor, marginRight: 8 }} />
            <Text className="text-xl font-bold" style={{ color: currentColor }}>{label.toUpperCase()}</Text>
        </View>
        <Text className="text-center text-textSecondary text-sm mb-4 leading-5">{summary}</Text>
        
        <View className="bg-surface px-3 py-1 rounded-full border border-gray-800">
          <Text className="text-xs text-textSecondary font-medium">✨ Powered by Llama 3.3 70B</Text>
        </View>
      </View>
    </View>
  );
}
