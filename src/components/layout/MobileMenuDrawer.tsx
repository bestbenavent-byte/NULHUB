import React from 'react';
import {
  X,
  MessageSquare,
  Archive,
  Search,
  Mic,
  Flame,
  Bell,
  Settings,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Database,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  PhoneCall,
  Lock,
  Palette
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { User, AppSettings } from '../../types/messenger';
import { getTranslation } from '../../utils/i18n';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  currentUser: User;
  settings: AppSettings;
  unreadNotificationsCount: number;
  activeTab: 'chats' | 'archive';
  onClose: () => void;
  onSelectTab: (tab: 'chats' | 'archive') => void;
  onOpenSearchPeople: () => void;
  onOpenNotifications: () => void;
  onOpenVoiceStatus: () => void;
  onOpenStreaks: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  currentUser,
  settings,
  unreadNotificationsCount,
  activeTab,
  onClose,
  onSelectTab,
  onOpenSearchPeople,
  onOpenNotifications,
  onOpenVoiceStatus,
  onOpenStreaks,
  onOpenSettings,
  onOpenProfile,
  onOpenAuth,
  onToggleTheme,
  onLogout
}) => {
  if (!isOpen) return null;

  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);
  const isDark = settings.theme === 'dark';

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex select-none">
      {/* Translucent Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Classic iOS Grouped Sheet Drawer */}
      <div className="relative w-[85%] max-w-[330px] h-full bg-[#EFEFF4] dark:bg-[#15171C] text-slate-900 dark:text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 ease-out border-r border-black/10 dark:border-white/10">
        
        {/* Top Header Card (Classic iOS Profile Header) */}
        <div className="p-4 bg-white/95 dark:bg-[#1E222B]/95 border-b border-black/10 dark:border-white/10 flex-shrink-0 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wider">
              {t('appName')}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 text-[#8E8E93] hover:text-black dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* User Profile Card in Classic iOS Inset Style */}
          <div
            onClick={() => handleAction(onOpenProfile)}
            className="flex items-center gap-3 p-2 rounded-[14px] bg-[#F2F2F7] dark:bg-[#282D37] hover:opacity-90 transition-opacity cursor-pointer border border-black/5 dark:border-white/5"
          >
            <div className="relative flex-shrink-0">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.displayName}
                size="lg"
                isOnline={true}
                className="ring-2 ring-[#007AFF]/30"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-[#FF9500] text-white text-[10px] font-black rounded-full shadow-xs flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-current text-white" />
                {currentUser.streak}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[15.5px] font-bold text-black dark:text-white truncate tracking-tight leading-tight">
                {currentUser.displayName}
              </h2>
              <p className="text-[12px] text-[#8E8E93] font-mono truncate">
                @{currentUser.username}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#34C759] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                <span>В мережі</span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#8E8E93] flex-shrink-0 mr-1" />
          </div>

          {/* Quick Bar: Theme + Cloud Database */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/5 dark:border-white/5">
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer text-[12px] font-medium"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FF9500]" />
                  <span>Світла тема</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Темна тема</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleAction(onOpenAuth)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 transition-colors cursor-pointer text-[12px] font-medium"
            >
              <Database className="w-3.5 h-3.5" />
              <span>База даних</span>
            </button>
          </div>
        </div>

        {/* Grouped Table Sections (Classic iOS Inset Style) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
          
          {/* Section 1: Chats & Messages */}
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider px-2 mb-1">
              Спілкування
            </div>
            <div className="rounded-[14px] bg-white dark:bg-[#1E222B] border border-black/8 dark:border-white/8 overflow-hidden shadow-2xs divide-y divide-black/5 dark:divide-white/5">
              {/* All Chats */}
              <button
                onClick={() => handleAction(() => onSelectTab('chats'))}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#007AFF] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <MessageSquare className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span>{t('chats')}</span>
                </div>
                {activeTab === 'chats' ? (
                  <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                )}
              </button>

              {/* Archive */}
              <button
                onClick={() => handleAction(() => onSelectTab('archive'))}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#8E8E93] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Archive className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span>{t('archive')}</span>
                </div>
                {activeTab === 'archive' ? (
                  <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                )}
              </button>

              {/* Search People */}
              <button
                onClick={() => handleAction(onOpenSearchPeople)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#5856D6] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Search className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span>{t('search')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
              </button>
            </div>
          </div>

          {/* Section 2: Features & Activity */}
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider px-2 mb-1">
              Активність
            </div>
            <div className="rounded-[14px] bg-white dark:bg-[#1E222B] border border-black/8 dark:border-white/8 overflow-hidden shadow-2xs divide-y divide-black/5 dark:divide-white/5">
              {/* Voice Statuses */}
              <button
                onClick={() => handleAction(onOpenVoiceStatus)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#34C759] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Mic className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span>{t('voiceStatus')}</span>
                </div>
                <span className="text-[11px] text-[#34C759] font-bold px-2 py-0.5 rounded-full bg-[#34C759]/15">
                  15с
                </span>
              </button>

              {/* Streaks */}
              <button
                onClick={() => handleAction(onOpenStreaks)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#FF9500] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Flame className="w-4 h-4 fill-current" />
                  </div>
                  <span>Вогники та нагороди</span>
                </div>
                <span className="text-[12px] font-bold text-[#FF9500] font-mono">
                  {currentUser.streak} дн.
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => handleAction(onOpenNotifications)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#FF3B30] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Bell className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span>{t('activity')}</span>
                </div>
                {unreadNotificationsCount > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] bg-[#FF3B30] text-white rounded-full font-bold">
                    {unreadNotificationsCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                )}
              </button>
            </div>
          </div>

          {/* Section 3: Preferences */}
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider px-2 mb-1">
              Налаштування
            </div>
            <div className="rounded-[14px] bg-white dark:bg-[#1E222B] border border-black/8 dark:border-white/8 overflow-hidden shadow-2xs divide-y divide-black/5 dark:divide-white/5">
              {/* Settings */}
              <button
                onClick={() => handleAction(onOpenSettings)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#8E8E93] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Settings className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span>{t('settings')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
              </button>

              {/* Security Banner */}
              <div className="px-3.5 py-2 text-[11px] text-[#8E8E93] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34C759] flex-shrink-0" />
                <span>Наскрізне шифрування Aether</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-3.5 bg-white dark:bg-[#1E222B] border-t border-black/10 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleAction(onLogout)}
              className="flex items-center gap-2 text-[14px] font-semibold text-[#FF3B30] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[2]" />
              <span>{t('logout')}</span>
            </button>

            <span className="text-[11px] text-[#8E8E93] font-medium">Aether • v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
