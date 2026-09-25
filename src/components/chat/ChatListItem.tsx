import React from 'react';
import { Pin, BellOff, Check, CheckCheck, Flame, Archive, Trash2, MailCheck } from 'lucide-react';
import { Chat, User } from '../../types/messenger';
import { Avatar } from '../ui/Avatar';
import { getTranslation, Language } from '../../utils/i18n';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  isActive: boolean;
  isTyping?: boolean;
  typingUserName?: string;
  partnerUser?: User;
  language: Language;
  onSelect: () => void;
  onPin: () => void;
  onMute: () => void;
  onArchive: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  currentUserId,
  isActive,
  isTyping,
  typingUserName,
  partnerUser,
  language,
  onSelect,
  onPin,
  onMute,
  onArchive,
  onMarkRead,
  onDelete
}) => {
  const t = (key: any) => getTranslation(language, key);

  // Compute display title and avatar
  const displayName = chat.type === 'direct' && partnerUser ? partnerUser.displayName : chat.name;
  const avatarSrc = chat.type === 'direct' && partnerUser ? partnerUser.avatar : chat.avatar;
  const isOnline = chat.type === 'direct' && partnerUser ? partnerUser.isOnline : undefined;
  const streak = chat.type === 'direct' && partnerUser ? partnerUser.streak : chat.streak;

  // Format timestamp in iOS standard format
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) return t('yesterday');
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
  };

  const lastMsg = chat.lastMessage;
  const isMyLastMsg = lastMsg?.senderId === currentUserId;

  // Render context menu actions
  const dropdownItems: DropdownItem[] = [
    {
      id: 'read',
      label: chat.unreadCount > 0 ? t('markAsRead') : t('markAsUnread'),
      icon: <MailCheck className="w-4 h-4" />,
      onClick: onMarkRead
    },
    {
      id: 'pin',
      label: chat.pinned ? t('unpinChat') : t('pinChat'),
      icon: <Pin className="w-4 h-4" />,
      onClick: onPin
    },
    {
      id: 'mute',
      label: chat.mutedUntil ? t('unmuteChat') : t('muteChat'),
      icon: <BellOff className="w-4 h-4" />,
      onClick: onMute
    },
    {
      id: 'archive',
      label: chat.isArchived ? t('unarchiveChat') : t('archiveChat'),
      icon: <Archive className="w-4 h-4" />,
      onClick: onArchive
    },
    {
      id: 'delete',
      label: t('deleteChat'),
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: onDelete
    }
  ];

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center px-4 py-2.5 cursor-pointer transition-colors duration-150 select-none ${
        isActive
          ? 'bg-[#E5F1FF] dark:bg-[#0F2A48]'
          : 'hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10'
      }`}
    >
      {/* Unread indicator dot on the left (iOS Messages style) */}
      <div className="w-3 flex items-center justify-center flex-shrink-0 -ml-1 mr-1">
        {chat.unreadCount > 0 && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-xs" />
        )}
      </div>

      {/* Avatar (iOS circular with crisp online status) */}
      <div className="relative mr-3 flex-shrink-0">
        <Avatar
          src={avatarSrc}
          name={displayName}
          size="md"
          isOnline={isOnline}
          hasVoiceStatus={!!partnerUser?.voiceStatus}
        />
      </div>

      {/* Center Details */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Top Row: Name + Streak + Timestamp */}
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-[15px] truncate tracking-tight ${
                chat.unreadCount > 0
                  ? 'font-bold text-black dark:text-white'
                  : 'font-semibold text-slate-900 dark:text-slate-100'
              }`}
            >
              {displayName}
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center text-[10px] text-[#FF9500] font-bold flex-shrink-0">
                <Flame className="w-3 h-3 fill-[#FF9500] mr-0.5" />
                {streak}
              </span>
            )}
          </div>

          <span
            className={`text-[12px] flex-shrink-0 tracking-tight font-normal ${
              chat.unreadCount > 0
                ? 'text-[#007AFF] font-semibold'
                : 'text-[#8E8E93]'
            }`}
          >
            {formatTime(lastMsg?.timestamp || chat.createdAt)}
          </span>
        </div>

        {/* Bottom Row: Last message preview / typing state */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-[13px] leading-snug truncate flex-1 min-w-0">
            {isTyping ? (
              <span className="text-[#007AFF] font-medium flex items-center gap-1 animate-pulse">
                <span>{typingUserName ? `${typingUserName} пише` : t('typing')}</span>
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#007AFF]" />
                  <span className="w-1 h-1 rounded-full bg-[#007AFF]" />
                  <span className="w-1 h-1 rounded-full bg-[#007AFF]" />
                </span>
              </span>
            ) : lastMsg ? (
              <span
                className={`truncate ${
                  chat.unreadCount > 0
                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                    : 'text-[#8E8E93] dark:text-[#98989D]'
                }`}
              >
                {isMyLastMsg && (
                  <span className="inline-flex items-center mr-1 text-[#8E8E93]">
                    {lastMsg.status === 'read' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-[#007AFF]" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
                {lastMsg.text || (lastMsg.media?.length ? `[${t('photosAndVideos')}]` : '')}
              </span>
            ) : (
              <span className="text-[#8E8E93] italic">{t('noMessagesYet')}</span>
            )}
          </div>

          {/* Right Badges: Pin, Mute, or Unread count pill */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {chat.pinned && (
              <Pin className="w-3 h-3 text-[#8E8E93] rotate-45" />
            )}
            {chat.mutedUntil && (
              <BellOff className="w-3 h-3 text-[#8E8E93]" />
            )}
            {chat.unreadCount > 0 && (
              <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-[#007AFF] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hairline bottom separator indented after avatar */}
      <div className="absolute bottom-0 left-[76px] right-0 h-[0.5px] bg-black/8 dark:bg-white/10" />
    </div>
  );
};
