import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageSquareDashed,
  X,
  Mic,
  Menu,
  SquarePen,
  MessagesSquare,
  Mail,
  Star,
  Users,
  Archive
} from 'lucide-react';
import { Chat, ChatFilter, User, VoiceStatus, AppSettings } from '../../types/messenger';
import { ChatListItem } from './ChatListItem';
import { getTranslation } from '../../utils/i18n';
import { Avatar } from '../ui/Avatar';

interface ChatListProps {
  chats: Chat[];
  users: User[];
  currentUserId: string;
  activeChatId: string | null;
  settings: AppSettings;
  typingMap: Record<string, string>; // chatId -> userName
  voiceStatuses: VoiceStatus[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onPinChat: (chatId: string) => void;
  onMuteChat: (chatId: string) => void;
  onArchiveChat: (chatId: string) => void;
  onMarkRead: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onOpenVoiceStatusModal: () => void;
  onOpenMobileMenu?: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  users,
  currentUserId,
  activeChatId,
  settings,
  typingMap,
  voiceStatuses,
  onSelectChat,
  onNewChat,
  onPinChat,
  onMuteChat,
  onArchiveChat,
  onMarkRead,
  onDeleteChat,
  onOpenVoiceStatusModal,
  onOpenMobileMenu
}) => {
  const [filter, setFilter] = useState<ChatFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  // Map users for fast O(1) lookup
  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach(u => map.set(u.id, u));
    return map;
  }, [users]);

  // Count unread for badge
  const unreadChatsCount = useMemo(() => {
    return chats.filter(c => !c.isArchived && c.unreadCount > 0).length;
  }, [chats]);

  // Filter and sort chats
  const filteredChats = useMemo(() => {
    return chats
      .filter(chat => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const partnerId = chat.participants.find(p => p !== currentUserId);
          const partner = partnerId ? userMap.get(partnerId) : undefined;
          const chatTitle = chat.type === 'direct' && partner ? partner.displayName : chat.name;
          const hasQuery =
            chatTitle.toLowerCase().includes(q) ||
            chat.lastMessage?.text.toLowerCase().includes(q);
          if (!hasQuery) return false;
        }

        // Tab category filtering
        if (filter === 'archived') {
          return !!chat.isArchived;
        }

        // Other filters ignore archived chats
        if (chat.isArchived) return false;

        if (filter === 'unread') return chat.unreadCount > 0;
        if (filter === 'favorites') return !!chat.isFavorite;
        if (filter === 'groups') return chat.type === 'group';

        return true;
      })
      .sort((a, b) => {
        // Pinned first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        // Then by last message or created date
        const timeA = new Date(a.lastMessage?.timestamp || a.createdAt).getTime();
        const timeB = new Date(b.lastMessage?.timestamp || b.createdAt).getTime();
        return timeB - timeA;
      });
  }, [chats, filter, searchQuery, currentUserId, userMap]);

  // Icon-only folder tabs with titles/tooltips & badges
  const iconFilterTabs: {
    id: ChatFilter;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'all',
      label: t('filterAll'),
      icon: <MessagesSquare className="w-4.5 h-4.5 stroke-[2]" />
    },
    {
      id: 'unread',
      label: t('filterUnread'),
      icon: <Mail className="w-4.5 h-4.5 stroke-[2]" />,
      badge: unreadChatsCount > 0 ? unreadChatsCount : undefined
    },
    {
      id: 'favorites',
      label: t('filterFavorites'),
      icon: <Star className="w-4.5 h-4.5 stroke-[2]" />
    },
    {
      id: 'groups',
      label: t('filterGroups'),
      icon: <Users className="w-4.5 h-4.5 stroke-[2]" />
    },
    {
      id: 'archived',
      label: t('filterArchived'),
      icon: <Archive className="w-4.5 h-4.5 stroke-[2]" />
    }
  ];

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-[350px] border-r border-black/10 dark:border-white/10 bg-white dark:bg-[#000000] flex-shrink-0 select-none">
      
      {/* Top Header Bar with Mobile Drawer Menu Trigger & New Chat */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          {/* Mobile hamburger button */}
          {onOpenMobileMenu ? (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden w-9 h-9 rounded-full bg-[#76768014] dark:bg-[#7676802E] text-slate-800 dark:text-slate-100 hover:text-[#007AFF] flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          ) : <div />}

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            title={t('newChat')}
            className="w-9 h-9 rounded-full bg-[#007AFF] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <SquarePen className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        </div>

        {/* Large Title */}
        <h1 className="text-[28px] font-extrabold text-black dark:text-white tracking-tight leading-tight">
          {filter === 'archived' ? t('archive') : t('chats')}
        </h1>
      </div>

      {/* Integrated Search Bar */}
      <div className="px-4 pt-1 pb-2">
        <div className="relative flex items-center bg-[#7676801F] dark:bg-[#7676803D] rounded-[12px] h-9.5 transition-colors">
          <Search className="w-4.5 h-4.5 text-[#8E8E93] absolute left-3 pointer-events-none stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full h-full pl-9 pr-8 text-[14px] bg-transparent text-black dark:text-white placeholder-[#8E8E93] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 w-4.5 h-4.5 rounded-full bg-[#8E8E93]/40 text-white flex items-center justify-center hover:bg-[#8E8E93]/70 transition-colors"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Status Stories Strip with graceful edge peek (Unchanged as requested) */}
      {filter !== 'archived' && (
        <div className="relative px-4 py-2 border-b border-black/5 dark:border-white/5 overflow-hidden">
          <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
            
            {/* Record New Voice Status Card */}
            <div
              onClick={onOpenVoiceStatusModal}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-[52px] h-[52px] rounded-full p-0.5 border-2 border-dashed border-[#007AFF]/60 hover:border-[#007AFF] flex items-center justify-center bg-[#007AFF]/10 text-[#007AFF] transition-all group-hover:scale-105 group-active:scale-95 shadow-2xs">
                <Mic className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white dark:ring-black">
                  +
                </span>
              </div>
              <span className="text-[10px] text-[#8E8E93] font-medium truncate max-w-[56px] text-center">
                Ваш статус
              </span>
            </div>

            {/* Friends with voice statuses */}
            {voiceStatuses.map(status => {
              const user = userMap.get(status.userId);
              if (!user) return null;
              return (
                <div
                  key={status.id}
                  onClick={onOpenVoiceStatusModal}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#007AFF] via-[#34C759] to-[#FF9500] group-hover:scale-105 group-active:scale-95 transition-transform shadow-2xs">
                    <div className="p-0.5 bg-white dark:bg-black rounded-full">
                      <Avatar
                        src={user.avatar}
                        name={user.displayName}
                        size="md"
                        hasVoiceStatus={false}
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#34C759] text-white flex items-center justify-center ring-2 ring-white dark:ring-black">
                      <Mic className="w-2.5 h-2.5 stroke-[2.5]" />
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-800 dark:text-slate-200 font-medium truncate max-w-[56px] text-center">
                    {user.displayName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right edge soft gradient fade to indicate scrollable stories */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-black to-transparent" />
        </div>
      )}

      {/* Icon-Only Folders Bar (Всі, Непрочитані, Улюблені, Групи, Архів) */}
      <div className="px-4 py-2 flex items-center border-b border-black/5 dark:border-white/5">
        <div className="w-full flex items-center justify-between p-1 bg-[#76768014] dark:bg-[#76768029] rounded-[13px] border border-black/5 dark:border-white/5 gap-1">
          {iconFilterTabs.map(tab => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                title={tab.label}
                aria-label={tab.label}
                className={`relative flex-1 h-9 rounded-[10px] flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-[#2C2C2E] text-[#007AFF] shadow-sm font-semibold'
                    : 'text-[#8E8E93] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {tab.icon}

                {/* Unread badge */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#007AFF] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#2C2C2E]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => {
            const partnerId = chat.participants.find(p => p !== currentUserId);
            const partner = partnerId ? userMap.get(partnerId) : undefined;
            const isTyping = !!typingMap[chat.id];

            return (
              <ChatListItem
                key={chat.id}
                chat={chat}
                currentUserId={currentUserId}
                isActive={activeChatId === chat.id}
                isTyping={isTyping}
                typingUserName={typingMap[chat.id]}
                partnerUser={partner}
                language={lang}
                onSelect={() => onSelectChat(chat.id)}
                onPin={() => onPinChat(chat.id)}
                onMute={() => onMuteChat(chat.id)}
                onArchive={() => onArchiveChat(chat.id)}
                onMarkRead={() => onMarkRead(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4 text-[#8E8E93]">
            <MessageSquareDashed className="w-10 h-10 mb-2 stroke-[1.5]" />
            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
              {filter === 'unread'
                ? t('noUnreadChats')
                : filter === 'favorites'
                ? t('noFavoriteChats')
                : filter === 'archived'
                ? t('noArchivedChats')
                : t('noChatsFound')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
