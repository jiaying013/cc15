import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface Props {
  progress: number; // 0 to 1 (how much is DONE)
  size: number;
  strokeWidth: number;
}

export default function CircularTimer({ progress, size, strokeWidth }: Props) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);

  // Color shifts from cyan → purple → green as timer completes
  const getColor = () => {
    if (clampedProgress < 0.5) return COLORS.accent;
    if (clampedProgress < 0.9) return COLORS.primary;
    return COLORS.success;
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.card}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Dim secondary ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth * 1.6}
          stroke={COLORS.border}
          strokeWidth={1}
          fill="none"
        />
        {/* Active progress arc */}
        {clampedProgress > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        )}
      </Svg>
    </View>
  );
}