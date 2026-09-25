import React from 'react';
import {
  MessageSquare,
  Search,
  Bell,
  Archive,
  Flame,
  Mic,
  Settings,
  Sun,
  Moon,
  Users,
  Compass,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { User, AppSettings } from '../../types/messenger';
import { getTranslation } from '../../utils/i18n';

interface SidebarProps {
  currentUser: User;
  settings: AppSettings;
  unreadNotificationsCount: number;
  activeTab: 'chats' | 'archive';
  onSelectTab: (tab: 'chats' | 'archive') => void;
  onOpenSearchPeople: () => void;
  onOpenNotifications: () => void;
  onOpenVoiceStatus: () => void;
  onOpenStreaks: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  settings,
  unreadNotificationsCount,
  activeTab,
  onSelectTab,
  onOpenSearchPeople,
  onOpenNotifications,
  onOpenVoiceStatus,
  onOpenStreaks,
  onOpenSettings,
  onOpenProfile,
  onOpenAuth,
  onToggleTheme
}) => {
  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  // Grouped Navigation Sections
  const primaryNavItems = [
    {
      id: 'chats',
      label: t('chats'),
      icon: <MessageSquare className="w-5 h-5 stroke-[2]" />,
      active: activeTab === 'chats',
      onClick: () => onSelectTab('chats')
    },
    {
      id: 'search',
      label: t('search'),
      icon: <Search className="w-5 h-5 stroke-[2]" />,
      active: false,
      onClick: onOpenSearchPeople
    },
    {
      id: 'archive',
      label: t('archive'),
      icon: <Archive className="w-5 h-5 stroke-[2]" />,
      active: activeTab === 'archive',
      onClick: () => onSelectTab('archive')
    }
  ];

  const featureNavItems = [
    {
      id: 'voice',
      label: t('voiceStatus'),
      icon: <Mic className="w-5 h-5 stroke-[2]" />,
      active: false,
      hasPulse: true,
      onClick: onOpenVoiceStatus
    },
    {
      id: 'streaks',
      label: t('streaks'),
      icon: <Flame className="w-5 h-5 stroke-[2] fill-amber-500 text-amber-500" />,
      active: false,
      streakValue: currentUser.streak,
      onClick: onOpenStreaks
    },
    {
      id: 'activity',
      label: t('activity'),
      icon: <Bell className="w-5 h-5 stroke-[2]" />,
      active: false,
      badge: unreadNotificationsCount,
      onClick: onOpenNotifications
    }
  ];

  return (
    <aside className="hidden md:flex flex-col items-center justify-between w-[72px] py-4 border-r border-black/10 dark:border-white/10 bg-white/75 dark:bg-[#121620]/80 backdrop-blur-2xl flex-shrink-0 z-20 select-none">
      
      {/* Top Navigation Items */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Section 1: Main Communications */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2.5">
          {primaryNavItems.map(item => (
            <button
              key={item.id}
              onClick={item.onClick}
              title={item.label}
              className={`relative group w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                item.active
                  ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25 scale-102 font-bold'
                  : 'text-[#8E8E93] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95'
              }`}
            >
              {item.icon}

              {/* Tooltip on hover */}
              <div className="absolute left-14 px-2.5 py-1 bg-slate-900/95 dark:bg-[#1e2430]/95 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 border border-white/10">
                {item.label}
              </div>
            </button>
          ))}
        </nav>

        {/* Separator */}
        <div className="w-8 h-[1px] bg-black/10 dark:bg-white/10 rounded-full" />

        {/* Section 2: Features, Stories & Streaks */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2.5">
          {featureNavItems.map(item => (
            <button
              key={item.id}
              onClick={item.onClick}
              title={item.label}
              className={`relative group w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                item.active
                  ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25'
                  : 'text-[#8E8E93] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95'
              }`}
            >
              {item.icon}

              {/* Notification Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-[#FF3B30] text-white text-[9.5px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#121620] shadow-xs">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}

              {/* Streak Flame Counter */}
              {item.streakValue !== undefined && item.streakValue > 0 && (
                <span className="absolute -top-1 -right-1.5 px-1 py-0.2 text-[9px] font-black bg-[#FF9500] text-white rounded-full flex items-center ring-2 ring-white dark:ring-[#121620] shadow-xs">
                  {item.streakValue}
                </span>
              )}

              {/* Voice status green dot pulse */}
              {item.hasPulse && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#34C759] ring-2 ring-white dark:ring-[#121620]" />
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-14 px-2.5 py-1 bg-slate-900/95 dark:bg-[#1e2430]/95 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 border border-white/10">
                {item.label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Actions: Theme Toggle, Settings, User Profile */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2.5">
        {/* Theme quick toggle */}
        <button
          onClick={onToggleTheme}
          title={settings.theme === 'dark' ? t('themeLight') : t('themeDark')}
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[#8E8E93] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-[#FF9500]" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-[#007AFF]" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title={t('settings')}
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[#8E8E93] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <Settings className="w-4.5 h-4.5 stroke-[2]" />
        </button>

        {/* User Avatar with Profile Drawer trigger */}
        <div className="pt-2 border-t border-black/10 dark:border-white/10 w-full flex justify-center">
          <Avatar
            src={currentUser.avatar}
            name={currentUser.displayName}
            size="md"
            isOnline={currentUser.isOnline}
            hasVoiceStatus={!!currentUser.voiceStatus}
            onClick={onOpenProfile}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform ring-2 ring-black/5 dark:ring-white/10"
          />
        </div>
      </div>
    </aside>
  );
};
