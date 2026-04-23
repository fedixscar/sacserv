import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'heart' | 'bean'>('heart');

  useEffect(() => {
    // Stage 1: Rotation du coeur (0-1.2s)
    // Stage 2: Transformation en grain (1.2s-2s)
    const timer = setTimeout(() => {
      setStage('bean');
    }, 1200);

    const endTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#fefccf] flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex flex-col items-center"
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 'heart' ? (
              <motion.div
                key="heart-logo"
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 360, 
                  opacity: 1 
                }}
                exit={{ scale: 0.8, opacity: 0, rotate: 380 }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                {/* Stylized 'C' and Heart from logo */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <path 
                    d="M70 20C60 15 40 15 30 30C20 45 20 65 35 80L50 90L65 80C80 65 80 45 70 30" 
                    stroke="#e67e22" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M45 40C35 35 25 45 25 55C25 70 50 85 50 85C50 85 75 70 75 55C75 45 65 35 55 40" 
                    fill="#e67e22" 
                  />
                  <path 
                    d="M40 25C30 25 20 35 20 50C20 75 50 90 50 90" 
                    stroke="#271310" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="bean-logo"
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="flex items-center justify-center"
              >
                {/* Coffee Bean SVG */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <ellipse cx="50" cy="50" rx="30" ry="45" fill="#271310" transform="rotate(-15 50 50)" />
                  <path 
                    d="M40 15C40 15 60 40 40 60C20 80 60 95 60 95" 
                    stroke="#fefccf" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    opacity="0.3"
                    transform="rotate(-15 50 50)"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#271310] text-xl font-bold tracking-widest uppercase">
            {stage === 'heart' ? 'L\'Atelier Sacré Cœur' : 'Votre café se prépare...'}
          </h2>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-[#735c00]"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
