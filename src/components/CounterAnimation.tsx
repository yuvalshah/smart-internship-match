import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CounterAnimationProps {
  targetValue: number;
  duration?: number;
  className?: string;
}

export const CounterAnimation = ({ 
  targetValue, 
  duration = 2000, 
  className = "" 
}: CounterAnimationProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * targetValue);
      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [targetValue, duration]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {count.toLocaleString()}
      {targetValue >= 1000 && "+"}
    </motion.span>
  );
};