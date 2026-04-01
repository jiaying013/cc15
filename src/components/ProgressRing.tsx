import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface Props {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
}

export default function ProgressRing({ progress, size, strokeWidth }: Props) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);
  const isComplete = clampedProgress >= 1;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Inner glow track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth * 0.3}
          stroke={COLORS.bgAlt}
          strokeWidth={strokeWidth * 0.4}
          fill="none"
          opacity={0.4}
        />
        {/* Progress arc */}
        {clampedProgress > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isComplete ? COLORS.success : COLORS.primary}
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