import React from 'react';
import { motion } from 'motion/react';

interface TypingIndicatorProps {
  userName?: string;
  label?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  userName,
  label = 'друкує'
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-slate-500 dark:text-slate-400 select-none">
      <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/70 px-2.5 py-1.5 rounded-full">
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: 0 }}
          className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"
        />
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"
        />
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }}
          className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"
        />
      </div>
      <span className="font-medium text-[11px]">
        {userName ? `${userName} ${label}...` : `${label}...`}
      </span>
    </div>
  );
};
