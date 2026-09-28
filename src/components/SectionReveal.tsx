import React from 'react';
import { motion, HTMLMotionProps, Transition } from 'framer-motion';

export interface SectionRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  animateOnMount?: boolean;
  className?: string;
  viewportAmount?: number | 'some' | 'all';
  once?: boolean;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  duration = 0.75,
  yOffset = 38,
  xOffset = 0,
  direction = 'up',
  animateOnMount = false,
  className = '',
  viewportAmount = 0.12,
  once = true,
  ...props
}) => {
  // Compute initial translate offsets based on direction
  let initX = 0;
  let initY = 0;

  if (direction === 'up') {
    initY = yOffset;
  } else if (direction === 'down') {
    initY = -yOffset;
  } else if (direction === 'left') {
    initX = xOffset || 40;
  } else if (direction === 'right') {
    initX = -(xOffset || 40);
  }

  const initialProps = {
    opacity: 0,
    x: initX,
    y: initY,
  };

  const targetProps = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  const transitionConfig: Transition = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <motion.div
      initial={initialProps}
      {...(animateOnMount
        ? { animate: targetProps }
        : {
            whileInView: targetProps,
            viewport: {
              once,
              amount: viewportAmount,
              margin: '0px 0px -40px 0px',
            },
          })}
      transition={transitionConfig}
      className={`w-full relative ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
