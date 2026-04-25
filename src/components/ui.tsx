import React from 'react';
import { motion } from 'framer-motion';

/* ── Shared animation variants ── */
export const pageVariants = {
  initial: { opacity: 0, x: 25, scale: 0.98 },
  animate: { 
    opacity: 1, x: 0, scale: 1, 
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      staggerChildren: 0.1 
    } 
  },
  exit: { opacity: 0, x: -20, scale: 0.98, transition: { duration: 0.3 } },
};

export const itemVariants = {
  initial: { opacity: 0, x: 15 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 25 } },
};

/* ── Progress Bar ── */
export const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="w-full h-1.5 rounded-full progress-track overflow-hidden">
    <motion.div
      className="h-full rounded-full progress-fill"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    />
  </div>
);

/* ── Single-choice option button ── */
export const OptionButton: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }}
    onClick={onClick}
    className={`
      w-full text-left px-6 py-5 rounded-2xl text-base font-medium transition-all duration-300 cursor-pointer
      ${selected
        ? 'btn-primary-gradient text-cream shadow-xl border border-transparent'
        : 'bg-surface-container-high text-on-surface ghost-border hover:bg-surface-container-highest hover:shadow-md'
      }
    `}
    style={selected ? { color: '#fefccf' } : {}}
  >
    {label}
  </motion.button>
);

/* ── Multi-choice toggle button ── */
export const ToggleButton: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }}
    onClick={onClick}
    className={`
      w-full text-left px-6 py-5 rounded-2xl text-base font-medium transition-all duration-300 cursor-pointer flex items-center justify-between
      ${selected
        ? 'bg-espresso text-cream shadow-xl'
        : 'bg-surface-container-high text-on-surface ghost-border hover:bg-surface-container-highest hover:shadow-md'
      }
    `}
    style={selected ? { color: '#fefccf', background: '#271310' } : {}}
  >
    <span className="flex items-center gap-4">
      <motion.span 
        className={`
          w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors duration-300
          ${selected ? 'bg-gold' : 'bg-surface-container'}
        `}
        style={selected ? { background: '#735c00' } : { background: '#f5f0b0' }}
        animate={selected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
      >
        {selected && (
          <motion.svg 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            width="14" height="14" viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 6L5 9L10 3" stroke="#fefccf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        )}
      </motion.span>
      {label}
    </span>
  </motion.button>
);

/* ── Continue Button ── */
export const ContinueButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}> = ({ onClick, disabled = false, label = 'Continuer →' }) => (
  <motion.div variants={itemVariants}>
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.95, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-5 rounded-2xl text-base font-bold transition-all duration-300 cursor-pointer
        ${disabled
          ? 'bg-surface-container-high text-on-surface-subtle cursor-not-allowed opacity-50'
          : 'btn-primary-gradient text-cream shadow-xl hover:shadow-2xl'
        }
      `}
      style={!disabled ? { color: '#fefccf' } : {}}
    >
      {label}
    </motion.button>
  </motion.div>
);

/* ── Section Header ── */
export const QuestionHeader: React.FC<{
  questionNum: number;
  total?: number;
  title: string;
}> = ({ questionNum, total = 7, title }) => (
  <motion.div variants={itemVariants} className="mb-8">
    <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#735c00' }}>
      Question {questionNum} sur {total}
    </p>
    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3, color: '#271310' }}>
      {title}
    </h2>
  </motion.div>
);
