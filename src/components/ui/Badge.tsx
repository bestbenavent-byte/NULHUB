import React from 'react';

interface BadgeProps {
  content?: number | string;
  variant?: 'primary' | 'danger' | 'warning' | 'success' | 'neutral';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  content,
  variant = 'primary',
  dot = false,
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white',
    danger: 'bg-rose-500 text-white',
    warning: 'bg-amber-500 text-slate-950 font-bold',
    success: 'bg-emerald-500 text-white',
    neutral: 'bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300'
  };

  if (dot) {
    return (
      <span
        className={`w-2 h-2 rounded-full inline-block ${variantStyles[variant]} ${className}`}
      />
    );
  }

  if (content === undefined || content === null || content === 0) {
    return null;
  }

  const displayContent = typeof content === 'number' && content > 99 ? '99+' : content;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-4 h-4 px-1 text-[11px] font-semibold rounded-full leading-none shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {displayContent}
    </span>
  );
};
