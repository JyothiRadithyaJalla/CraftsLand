import React, { useEffect, useRef } from 'react';
import { useMotionValue, animate, useReducedMotion } from 'framer-motion';

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * AnimatedCounter provides a silky smooth count-up animation for numeric metrics.
 * Runs directly on the DOM node to avoid unnecessary React re-renders.
 * Automatically displays instant final values when prefers-reduced-motion is active.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.0,
  formatter,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const formatText = (val: number): string => {
    const formatted = formatter ? formatter(val) : Math.round(val).toLocaleString('en-IN');
    return `${prefix}${formatted}${suffix}`;
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      if (nodeRef.current) {
        nodeRef.current.textContent = formatText(value);
      }
      return;
    }

    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier ease out
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = formatText(latest);
        }
      },
    });

    return () => controls.stop();
  }, [value, duration, shouldReduceMotion, formatter, prefix, suffix]);

  return (
    <span ref={nodeRef} className={className}>
      {formatText(value)}
    </span>
  );
};
