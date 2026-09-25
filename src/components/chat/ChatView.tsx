import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Phone,
  Video,
  Search,
  ChevronLeft,
  Pin,
  ArrowDown,
  Info,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  Chat,
  Message,
  User,
  AppSettings,
  MessageReplySummary,
  Attachment
} from '../../types/messenger';
import { Avatar } from '../ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { TypingIndicator } from './TypingIndicator';
import { InChatSearch } from './InChatSearch';
import { getTranslation } from '../../utils/i18n';
import { WALLPAPERS } from '../../data/mockData';

interface ChatViewProps {
  chat: Chat;
  messages: Message[];
  users: User[];
  currentUserId: string;
  settings: AppSettings;
  isTyping?: boolean;
  typingUserName?: string;
  onBack: () => void;
  onSendMessage: (text: string, options?: any) => void;
  onReplyMessage: (message: Message) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  onCopyText: (text: string) => void;
  onPinMessage: (messageId: string) => void;
  onForwardMessage: (message: Message) => void;
  onEditMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onOpenProfile: (userId: string) => void;
  onOpenAttachment: (att: Attachment) => void;
  onStartCall: (isVideo: boolean) => void;
  onTyping: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  users,
  currentUserId,
  settings,
  isTyping,
  typingUserName,
  onBack,
  onSendMessage,
  onReplyMessage,
  onReactMessage,
  onCopyText,
  onPinMessage,
  onForwardMessage,
  onEditMessage,
  onDeleteMessage,
  onOpenProfile,
  onOpenAttachment,
  onStartCall,
  onTyping
}) => {
  const [activeReply, setActiveReply] = useState<MessageReplySummary | undefined>();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  // Users lookup map
  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach(u => map.set(u.id, u));
    return map;
  }, [users]);

  // Current partner in direct chat
  const partnerId = chat.participants.find(p => p !== currentUserId);
  const partner = partnerId ? userMap.get(partnerId) : undefined;
  const displayName = chat.type === 'direct' && partner ? partner.displayName : chat.name;
  const avatarSrc = chat.type === 'direct' && partner ? partner.avatar : chat.avatar;
  const isOnline = chat.type === 'direct' && partner ? partner.isOnline : undefined;

  // Active chat wallpaper
  const activeWallpaper = useMemo(() => {
    if (settings.customWallpaperUrl) {
      return {
        id: 'custom',
        name: 'Custom',
        type: 'image' as const,
        value: `url(${settings.customWallpaperUrl})`,
        textColor: 'light' as const
      };
    }
    const found = WALLPAPERS.find(w => w.id === settings.wallpaperId);
    return found || WALLPAPERS[0];
  }, [settings.wallpaperId, settings.customWallpaperUrl]);

  // Pinned message
  const pinnedMessage = useMemo(() => {
    return messages.find(m => m.isPinned);
  }, [messages]);

  // Filter messages for search matches
  const matchedMessageIds = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return messages.filter(m => m.text.toLowerCase().includes(q)).map(m => m.id);
  }, [messages, searchQuery]);

  // Scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  // Track scroll position to show "scroll to bottom" button
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 220;
    setShowScrollBottom(isUp);
  };

  // Scroll to specific message (e.g. pinned or reply target)
  const scrollToMessage = (msgId: string) => {
    const el = document.getElementById(`msg_${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-blue-500/15', 'rounded-2xl', 'transition-colors');
      setTimeout(() => {
        el.classList.remove('bg-blue-500/15');
      }, 1600);
    }
  };

  const handleNextMatch = () => {
    if (matchedMessageIds.length === 0) return;
    const nextIdx = (searchMatchIndex + 1) % matchedMessageIds.length;
    setSearchMatchIndex(nextIdx);
    scrollToMessage(matchedMessageIds[nextIdx]);
  };

  const handlePrevMatch = () => {
    if (matchedMessageIds.length === 0) return;
    const prevIdx =
      (searchMatchIndex - 1 + matchedMessageIds.length) % matchedMessageIds.length;
    setSearchMatchIndex(prevIdx);
    scrollToMessage(matchedMessageIds[prevIdx]);
  };

  const handleStartReply = (msg: Message) => {
    const sender = userMap.get(msg.senderId);
    setActiveReply({
      id: msg.id,
      senderId: msg.senderId,
      senderName: sender?.displayName || (msg.senderId === currentUserId ? 'Ви' : 'User'),
      text: msg.text,
      mediaType: msg.media && msg.media[0] ? msg.media[0].type : undefined
    });
  };

  // Format date separators
  const formatSeparatorDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return 'Сьогодні';
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return t('yesterday');
    return date.toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7] dark:bg-[#090C12] relative overflow-hidden select-none">
      {/* 1. Translucent Navigation Header */}
      <header className="h-[60px] px-3 sm:px-5 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white/85 dark:bg-[#121620]/90 backdrop-blur-2xl z-20 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Back button on mobile */}
          <button
            onClick={onBack}
            className="md:hidden flex items-center -ml-1 pr-1 text-[#007AFF] hover:opacity-75 transition-opacity cursor-pointer font-medium text-[16px]"
          >
            <ChevronLeft className="w-6 h-6 -mr-0.5" />
            <span className="hidden sm:inline">{t('chats')}</span>
          </button>

          {/* User / Group Avatar */}
          <div
            onClick={() => partnerId && onOpenProfile(partnerId)}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <Avatar
              src={avatarSrc}
              name={displayName}
              size="md"
              isOnline={isOnline}
              hasVoiceStatus={!!partner?.voiceStatus}
            />
          </div>

          {/* Name & Real-time Status */}
          <div
            onClick={() => partnerId && onOpenProfile(partnerId)}
            className="min-w-0 cursor-pointer ml-0.5"
          >
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white truncate tracking-tight leading-tight">
                {displayName}
              </h2>
            </div>
            <div className="text-[11.5px] truncate flex items-center gap-1.5 leading-none mt-0.5">
              {isTyping ? (
                <span className="text-[#007AFF] dark:text-[#0A84FF] font-medium flex items-center gap-1">
                  <span>{typingUserName ? `${typingUserName} ${t('typing')}` : t('typing')}</span>
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </span>
                </span>
              ) : chat.type === 'group' ? (
                <span className="text-[#8E8E93]">
                  {chat.participants.length} {t('participants').toLowerCase()}
                </span>
              ) : isOnline ? (
                <span className="text-[#34C759] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                  <span>{t('online')}</span>
                </span>
              ) : (
                <span className="text-[#8E8E93]">{t('offline')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons: Call, Video, In-Chat Search, Profile Details */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onStartCall(false)}
            title={t('audioCall')}
            className="w-8.5 h-8.5 rounded-full text-[#007AFF] hover:bg-[#007AFF]/10 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <Phone className="w-4.5 h-4.5 stroke-[2]" />
          </button>

          <button
            onClick={() => onStartCall(true)}
            title={t('videoCall')}
            className="w-8.5 h-8.5 rounded-full text-[#007AFF] hover:bg-[#007AFF]/10 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <Video className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            title={t('search')}
            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer ${
              showSearch
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'text-[#007AFF] hover:bg-[#007AFF]/10'
            }`}
          >
            <Search className="w-4.5 h-4.5 stroke-[2]" />
          </button>

          <button
            onClick={() => partnerId && onOpenProfile(partnerId)}
            title={t('userDetails')}
            className="w-8.5 h-8.5 rounded-full text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <Info className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* In-Chat Search Bar Drawer */}
      {showSearch && (
        <InChatSearch
          language={lang}
          query={searchQuery}
          totalMatches={matchedMessageIds.length}
          currentMatchIndex={searchMatchIndex}
          onQueryChange={setSearchQuery}
          onNext={handleNextMatch}
          onPrev={handlePrevMatch}
          onClose={() => {
            setShowSearch(false);
            setSearchQuery('');
          }}
        />
      )}

      {/* Pinned Message Sticky Banner */}
      {pinnedMessage && (
        <div
          onClick={() => scrollToMessage(pinnedMessage.id)}
          className="flex items-center justify-between px-4 py-2 bg-white/90 dark:bg-[#161B26]/90 border-b border-[#007AFF]/20 backdrop-blur-md cursor-pointer z-10 select-none shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center flex-shrink-0">
              <Pin className="w-3.5 h-3.5 rotate-45" />
            </div>
            <div className="border-l-2 border-[#007AFF] pl-2.5 min-w-0">
              <span className="text-[10px] font-bold text-[#007AFF] block uppercase tracking-wider leading-none mb-0.5">
                {t('pinnedMessage')}
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-200 truncate block">
                {pinnedMessage.text || t('photosAndVideos')}
              </span>
            </div>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              onPinMessage(pinnedMessage.id);
            }}
            title={t('unpinMessage')}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Messages & Wallpaper Layer */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {/* Static Background Wallpaper Canvas */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300 bg-cover bg-center"
          style={{
            background:
              activeWallpaper.value !== 'transparent' ? activeWallpaper.value : undefined
          }}
        />

        {/* Scrollable Messages Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto py-4 z-10 scroll-smooth"
        >
          {messages.length > 0 ? (
            messages.map((message, idx) => {
              const isOutgoing = message.senderId === currentUserId;
              const sender = userMap.get(message.senderId);

              // Message clustering math
              const prevMessage = idx > 0 ? messages[idx - 1] : null;
              const nextMessage = idx < messages.length - 1 ? messages[idx + 1] : null;

              const isSameSenderAsPrev =
                prevMessage &&
                prevMessage.senderId === message.senderId &&
                new Date(message.timestamp).getTime() -
                  new Date(prevMessage.timestamp).getTime() <
                  5 * 60 * 1000;

              const isSameSenderAsNext =
                nextMessage &&
                nextMessage.senderId === message.senderId &&
                new Date(nextMessage.timestamp).getTime() -
                  new Date(message.timestamp).getTime() <
                  5 * 60 * 1000;

              const isFirstInGroup = !isSameSenderAsPrev;
              const isLastInGroup = !isSameSenderAsNext;

              // Date separator check
              const showDateSeparator =
                !prevMessage ||
                new Date(prevMessage.timestamp).toDateString() !==
                  new Date(message.timestamp).toDateString();

              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-3.5 sticky top-2 z-10 pointer-events-none">
                      <span className="pointer-events-auto px-3.5 py-1 rounded-full text-[11px] font-semibold bg-black/45 dark:bg-black/60 text-white backdrop-blur-md shadow-xs select-none">
                        {formatSeparatorDate(message.timestamp)}
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={message}
                    isOutgoing={isOutgoing}
                    sender={sender}
                    showAvatar={!isOutgoing}
                    bubbleStyle={settings.bubbleStyle}
                    language={lang}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                    onReply={handleStartReply}
                    onReact={onReactMessage}
                    onCopy={onCopyText}
                    onPin={onPinMessage}
                    onForward={onForwardMessage}
                    onEdit={onEditMessage}
                    onDelete={onDeleteMessage}
                    onOpenAttachment={onOpenAttachment}
                    onScrollToReply={scrollToMessage}
                  />
                </React.Fragment>
              );
            })
          ) : (
            /* Professional Empty Conversation State */
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 max-w-sm mx-auto select-none">
              <div className="relative mb-3">
                <Avatar
                  src={avatarSrc}
                  name={displayName}
                  size="xl"
                  isOnline={isOnline}
                  className="ring-4 ring-white/60 dark:ring-white/10 shadow-lg"
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {displayName}
              </h3>
              {partner?.bio && (
                <p className="text-xs text-[#8E8E93] max-w-xs mb-3 line-clamp-2">
                  {partner.bio}
                </p>
              )}

              {/* End-to-End Encryption Banner */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] text-[#8E8E93] mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Наскрізне шифрування Aether</span>
              </div>

              {/* Quick Icebreakers */}
              <div className="flex flex-col gap-1.5 w-full">
                <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                  Швидкий початок
                </div>
                {['Привіт! 👋', 'Як твої справи? ✨', 'Маєш хвилинку? ☕️'].map(phrase => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => onSendMessage(phrase)}
                    className="w-full py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/5 dark:border-white/10 rounded-xl transition-all active:scale-98 text-center shadow-2xs cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <TypingIndicator userName={typingUserName} label={t('typing')} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-to-bottom Floating Action Button */}
        {showScrollBottom && (
          <button
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-5 right-5 z-30 w-10 h-10 rounded-full bg-white dark:bg-[#1E2430] text-[#007AFF] shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4.5 h-4.5 stroke-[2.4]" />
          </button>
        )}
      </div>

      {/* 3. Message Composer Input Bar */}
      <MessageComposer
        chatId={chat.id}
        settings={settings}
        replyTo={activeReply}
        language={lang}
        onSendMessage={onSendMessage}
        onCancelReply={() => setActiveReply(undefined)}
        onTyping={onTyping}
      />
    </div>
  );
};
