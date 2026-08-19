'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView, Variants } from 'framer-motion';

export const springSnappy = {
  type: 'spring' as const,
  damping: 15,
  stiffness: 250,
  mass: 0.5,
};

// 1. Text Reveal Word by Word
export const TextReveal = ({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: springSnappy,
    },
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  return (
    <motion.div
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: '0.25em' }}
          key={index}
          dangerouslySetInnerHTML={{ __html: word }}
        />
      ))}
    </motion.div>
  );
};

// 2. Scroll Reveal Container
export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  staggerChildren = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  staggerChildren?: number;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  let y = 0;
  let x = 0;
  if (direction === 'up') y = 40;
  if (direction === 'down') y = -40;
  if (direction === 'left') x = 40;
  if (direction === 'right') x = -40;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            ...springSnappy,
            delay,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. Stagger Item
export const StaggerItem = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: springSnappy },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 4. Animated Number Counter
export const AnimatedNumber = ({
  value,
  duration = 1.5,
  className = '',
  prefix = '',
  suffix = '',
}: {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;

      const totalFrames = Math.round(duration * 60);
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(end * (1 - Math.pow(1 - progress, 3))); // easeOutCubic

        setCount(currentCount);

        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, 1000 / 60);

      return () => clearInterval(counter);
    }
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('id-ID')}{suffix}
    </span>
  );
};
