import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  position?: 'right' | 'left';
}

const widthStyles = {
  sm: 'sm:max-w-xs',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg'
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
  position = 'right'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const slideInitial = position === 'right' ? { x: '100%' } : { x: '-100%' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div
            className={`fixed inset-y-0 ${
              position === 'right' ? 'right-0' : 'left-0'
            } max-w-full flex pl-10`}
          >
            <motion.div
              initial={slideInitial}
              animate={{ x: 0 }}
              exit={slideInitial}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`w-screen ${widthStyles[width]} bg-white dark:bg-[#111827] border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {title}
                </div>
                <IconButton
                  icon={<X className="w-4 h-4" />}
                  label="Закрити"
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                />
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
