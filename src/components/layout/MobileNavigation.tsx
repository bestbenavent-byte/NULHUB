import React from 'react';
import {
  MessageSquare,
  Search,
  Bell,
  Flame,
  Mic,
  Menu
} from 'lucide-react';
import { AppSettings, User } from '../../types/messenger';
import { getTranslation } from '../../utils/i18n';

interface MobileNavigationProps {
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
  onOpenMobileMenu?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentUser,
  settings,
  unreadNotificationsCount,
  activeTab,
  onSelectTab,
  onOpenSearchPeople,
  onOpenNotifications,
  onOpenVoiceStatus,
  onOpenStreaks,
  onOpenMobileMenu,
  onOpenProfile
}) => {
  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  return (
    <nav
      role="navigation"
      aria-label="Mobile Navigation Bar"
      className="md:hidden flex items-center justify-around h-[62px] pb-2 pt-1 bg-white/95 dark:bg-[#15171C]/95 backdrop-blur-2xl border-t border-black/10 dark:border-white/10 px-2 flex-shrink-0 z-30 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      {/* 1. Chats Tab */}
      <button
        type="button"
        onClick={() => onSelectTab('chats')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-90 duration-100 cursor-pointer ${
          activeTab === 'chats'
            ? 'text-[#007AFF] dark:text-[#0A84FF]'
            : 'text-[#8E8E93] hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <MessageSquare
            className={`w-[22px] h-[22px] transition-all ${
              activeTab === 'chats' ? 'fill-current stroke-[1.8]' : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'chats' ? 'font-bold' : 'font-medium'}`}>
          {t('chats')}
        </span>
      </button>

      {/* 2. Search Tab */}
      <button
        type="button"
        onClick={onOpenSearchPeople}
        className="flex flex-col items-center justify-center flex-1 h-full text-[#8E8E93] hover:text-[#007AFF] transition-transform active:scale-90 duration-100 cursor-pointer"
      >
        <Search className="w-[22px] h-[22px] stroke-[1.85]" />
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">
          {t('search')}
        </span>
      </button>

      {/* 3. Voice Status Tab (Stories) */}
      <button
        type="button"
        onClick={onOpenVoiceStatus}
        className="flex flex-col items-center justify-center flex-1 h-full text-[#8E8E93] hover:text-[#34C759] transition-transform active:scale-90 duration-100 relative cursor-pointer"
      >
        <div className="relative">
          <Mic className="w-[22px] h-[22px] stroke-[1.85]" />
          <span className="w-2 h-2 rounded-full bg-[#34C759] absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-[#15171C]" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">
          Статус
        </span>
      </button>

      {/* 4. Streaks Tab */}
      <button
        type="button"
        onClick={onOpenStreaks}
        className="flex flex-col items-center justify-center flex-1 h-full text-[#8E8E93] hover:text-[#FF9500] transition-transform active:scale-90 duration-100 relative cursor-pointer"
      >
        <div className="relative">
          <Flame className="w-[22px] h-[22px] fill-[#FF9500] text-[#FF9500] stroke-[1.5]" />
        </div>
        <span className="text-[10px] mt-0.5 font-bold tracking-tight text-[#FF9500]">
          {currentUser.streak}д
        </span>
      </button>

      {/* 5. Notifications Tab */}
      <button
        type="button"
        onClick={onOpenNotifications}
        className="flex flex-col items-center justify-center flex-1 h-full text-[#8E8E93] hover:text-[#007AFF] transition-transform active:scale-90 duration-100 relative cursor-pointer"
      >
        <div className="relative">
          <Bell className="w-[22px] h-[22px] stroke-[1.85]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-[#FF3B30] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#15171C] shadow-xs">
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">
          {t('activity')}
        </span>
      </button>

      {/* 6. Menu Trigger Tab */}
      <button
        type="button"
        onClick={onOpenMobileMenu || onOpenProfile}
        className="flex flex-col items-center justify-center flex-1 h-full text-[#8E8E93] hover:text-[#007AFF] transition-transform active:scale-90 duration-100 cursor-pointer"
      >
        <Menu className="w-[22px] h-[22px] stroke-[1.85]" />
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">
          Меню
        </span>
      </button>
    </nav>
  );
};
