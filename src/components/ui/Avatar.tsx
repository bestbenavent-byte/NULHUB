import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  hasVoiceStatus?: boolean;
  streak?: number;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl'
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5 bottom-0 right-0 ring-1',
  sm: 'w-2 h-2 bottom-0 right-0 ring-1.5',
  md: 'w-2.5 h-2.5 bottom-0 right-0 ring-2',
  lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 ring-2',
  xl: 'w-4 h-4 bottom-1 right-1 ring-2',
  '2xl': 'w-5 h-5 bottom-1.5 right-1.5 ring-4'
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline,
  hasVoiceStatus,
  streak,
  className = '',
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials from name
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-shrink-0 select-none ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-transform' : ''} ${className}`}
    >
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-semibold transition-all ${sizeClasses[size]} ${
          hasVoiceStatus
            ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900'
            : ''
        } bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 shadow-sm`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>{initials || '?'}</span>
        )}
      </div>

      {/* Online indicator */}
      {isOnline !== undefined && (
        <span
          className={`absolute rounded-full ring-white dark:ring-slate-900 ${statusSizeClasses[size]} ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'
          }`}
          title={isOnline ? 'В мережі' : 'Офлайн'}
        />
      )}

      {/* Streak badge overlay for large/xl avatars if provided */}
      {streak !== undefined && streak > 0 && (size === 'lg' || size === 'xl') && (
        <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1 py-0.5 rounded-full flex items-center shadow-md">
          <span>🔥</span>
          <span className="ml-0.5">{streak}</span>
        </div>
      )}
    </div>
  );
};
