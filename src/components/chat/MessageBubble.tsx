import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  CheckCheck,
  Play,
  Pause,
  CornerUpLeft,
  Smile,
  Copy,
  Pin,
  Forward,
  Trash2,
  Edit2,
  FileText,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { Message, BubbleStyle, User, Attachment } from '../../types/messenger';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { getTranslation, Language } from '../../utils/i18n';
import { soundManager } from '../../utils/sound';

interface MessageBubbleProps {
  message: Message;
  isOutgoing: boolean;
  sender?: User;
  showAvatar?: boolean;
  bubbleStyle: BubbleStyle;
  language: Language;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  onReply: (message: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
  onCopy: (text: string) => void;
  onPin: (messageId: string) => void;
  onForward: (message: Message) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onOpenAttachment: (att: Attachment) => void;
  onScrollToReply?: (replyMessageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOutgoing,
  sender,
  showAvatar = true,
  bubbleStyle = 'modern',
  language,
  isFirstInGroup = true,
  isLastInGroup = true,
  onReply,
  onReact,
  onCopy,
  onPin,
  onForward,
  onEdit,
  onDelete,
  onOpenAttachment,
  onScrollToReply
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 1
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const audioIntervalRef = useRef<any>(null);

  const t = (key: any) => getTranslation(language, key);

  // Time format (HH:MM)
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Dynamic Audio Playback simulation
  const audioTotalSeconds = message.audioDuration
    ? parseInt(message.audioDuration.split(':')[0]) * 60 +
      parseInt(message.audioDuration.split(':')[1])
    : 14;

  const toggleAudioPlay = () => {
    soundManager.playTap();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    } else {
      setIsPlayingAudio(true);
      if (audioProgress >= 1) setAudioProgress(0);
    }
  };

  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 1) {
            setIsPlayingAudio(false);
            clearInterval(audioIntervalRef.current);
            return 0;
          }
          return prev + 0.05;
        });
      }, (audioTotalSeconds * 1000) / 20);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio, audioTotalSeconds]);

  // Current playback time display
  const currentSeconds = Math.floor(audioProgress * audioTotalSeconds);
  const audioDisplayTime = `${Math.floor(currentSeconds / 60)}:${String(
    currentSeconds % 60
  ).padStart(2, '0')}`;

  // ==========================================
  // Professional Bubble Styles & Geometry
  // ==========================================
  const getBubbleStyleClasses = () => {
    // 1. Modern (Sophisticated messenger with specular highlights and tails)
    if (bubbleStyle === 'modern') {
      if (isOutgoing) {
        const cornerRounding = isLastInGroup
          ? 'rounded-[18px] rounded-br-[3px]'
          : isFirstInGroup
          ? 'rounded-[18px] rounded-br-[8px]'
          : 'rounded-[18px] rounded-r-[8px]';
        return `bg-gradient-to-br from-[#0066FF] via-[#005FEA] to-[#0051CC] text-white ${cornerRounding} border border-white/15 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,102,255,0.18)]`;
      } else {
        const cornerRounding = isLastInGroup
          ? 'rounded-[18px] rounded-bl-[3px]'
          : isFirstInGroup
          ? 'rounded-[18px] rounded-bl-[8px]'
          : 'rounded-[18px] rounded-l-[8px]';
        return `bg-white dark:bg-[#1E2430] text-slate-900 dark:text-slate-100 ${cornerRounding} border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_3px_8px_rgba(0,0,0,0.03)]`;
      }
    }

    // 2. Rounded (Pebble Organic with velvety depth)
    if (bubbleStyle === 'rounded') {
      if (isOutgoing) {
        const cornerRounding = isLastInGroup
          ? 'rounded-[22px] rounded-br-[5px]'
          : 'rounded-[22px] rounded-r-[10px]';
        return `bg-gradient-to-r from-[#007AFF] to-[#0A84FF] text-white ${cornerRounding} shadow-[0_3px_12px_rgba(0,122,255,0.25)]`;
      } else {
        const cornerRounding = isLastInGroup
          ? 'rounded-[22px] rounded-bl-[5px]'
          : 'rounded-[22px] rounded-l-[10px]';
        return `bg-[#EAEBED] dark:bg-[#222733] text-black dark:text-white ${cornerRounding} shadow-2xs`;
      }
    }

    // 3. Classic (Executive Structured / Crisp corporate)
    if (bubbleStyle === 'classic') {
      if (isOutgoing) {
        return `bg-[#0B63E5] text-white rounded-xl ${
          isLastInGroup ? 'rounded-tr-none' : ''
        } shadow-xs border border-blue-400/20`;
      } else {
        return `bg-[#F1F3F5] dark:bg-[#1A202C] text-slate-900 dark:text-slate-100 rounded-xl ${
          isLastInGroup ? 'rounded-tl-none' : ''
        } border border-slate-200/80 dark:border-slate-700/60 shadow-2xs`;
      }
    }

    // 4. Minimal (Ultra-clean wireframe / Editorial)
    if (bubbleStyle === 'minimal') {
      if (isOutgoing) {
        return 'bg-blue-500/10 dark:bg-blue-400/15 text-blue-950 dark:text-blue-100 border border-blue-500/30 dark:border-blue-400/30 rounded-[16px] shadow-none';
      } else {
        return 'bg-black/[0.03] dark:bg-white/[0.05] text-slate-900 dark:text-slate-100 border border-black/10 dark:border-white/10 rounded-[16px] shadow-none';
      }
    }

    // 5. Glass (Liquid VisionOS / Translucent frosted crystal)
    if (bubbleStyle === 'glass') {
      if (isOutgoing) {
        return `bg-[#007AFF]/85 text-white backdrop-blur-2xl rounded-[18px] ${
          isLastInGroup ? 'rounded-br-[4px]' : ''
        } border border-white/35 shadow-[0_8px_24px_rgba(0,122,255,0.22)]`;
      } else {
        return `bg-white/80 dark:bg-[#1B212D]/80 text-black dark:text-white backdrop-blur-2xl rounded-[18px] ${
          isLastInGroup ? 'rounded-bl-[4px]' : ''
        } border border-white/60 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.06)]`;
      }
    }

    return 'bg-[#007AFF] text-white rounded-[18px] rounded-br-[4px] shadow-xs';
  };

  // Build context menu options
  const dropdownItems: DropdownItem[] = [
    {
      id: 'reply',
      label: t('reply'),
      icon: <CornerUpLeft className="w-3.5 h-3.5" />,
      onClick: () => onReply(message)
    },
    {
      id: 'copy',
      label: t('copy'),
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: () => onCopy(message.text)
    },
    {
      id: 'pin',
      label: message.isPinned ? t('unpinMessage') : t('pinMessage'),
      icon: <Pin className="w-3.5 h-3.5" />,
      onClick: () => onPin(message.id)
    },
    {
      id: 'forward',
      label: t('forward'),
      icon: <Forward className="w-3.5 h-3.5" />,
      onClick: () => onForward(message)
    }
  ];

  if (isOutgoing) {
    dropdownItems.push(
      {
        id: 'edit',
        label: t('editMessage'),
        icon: <Edit2 className="w-3.5 h-3.5" />,
        onClick: () => onEdit(message)
      },
      {
        id: 'delete',
        label: t('deleteMessage'),
        icon: <Trash2 className="w-3.5 h-3.5" />,
        danger: true,
        onClick: () => onDelete(message.id)
      }
    );
  }

  return (
    <div
      id={`msg_${message.id}`}
      className={`group relative flex items-end gap-2 px-3 sm:px-6 transition-colors ${
        isOutgoing ? 'justify-end' : 'justify-start'
      } ${isLastInGroup ? 'mb-2' : 'mb-0.5'}`}
    >
      {/* Incoming message sender avatar (shown only on last message of cluster) */}
      {!isOutgoing && (
        <div className="w-7 h-7 flex-shrink-0 mb-0.5">
          {showAvatar && isLastInGroup ? (
            <Avatar
              src={sender?.avatar}
              name={sender?.displayName || 'User'}
              size="xs"
              className="ring-1 ring-black/10 dark:ring-white/10"
            />
          ) : null}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[55%] flex flex-col ${
          isOutgoing ? 'items-end' : 'items-start'
        }`}
      >
        {/* Reply Quote Preview */}
        {message.replyTo && (
          <div
            onClick={() => onScrollToReply && onScrollToReply(message.replyTo!.id)}
            className={`mb-1 px-2.5 py-1 text-[11px] rounded-lg cursor-pointer transition-opacity hover:opacity-90 border-l-[3px] select-none ${
              isOutgoing
                ? 'bg-black/15 text-white/90 border-white/80'
                : 'bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-200 border-[#007AFF]'
            }`}
          >
            <div className="font-bold text-[10px] truncate leading-tight">
              {message.replyTo.senderName}
            </div>
            <div className="truncate opacity-85 text-[11px]">
              {message.replyTo.text || (message.replyTo.mediaType ? `[${t('photosAndVideos')}]` : '')}
            </div>
          </div>
        )}

        {/* Main Bubble Body */}
        <div
          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 transition-all duration-150 ${getBubbleStyleClasses()}`}
        >
          {/* Incoming sender name (if in group and first in cluster) */}
          {!isOutgoing && sender && isFirstInGroup && (
            <div className="text-[11px] font-bold text-[#007AFF] dark:text-[#0A84FF] mb-0.5 select-none leading-none">
              {sender.displayName}
            </div>
          )}

          {/* Media Attachments */}
          {message.media && message.media.length > 0 && (
            <div className="mb-1.5 space-y-1">
              {message.media.map(att => {
                if (att.type === 'image') {
                  return (
                    <div
                      key={att.id}
                      onClick={() => onOpenAttachment(att)}
                      className="rounded-xl overflow-hidden cursor-pointer max-h-64 group/media relative shadow-xs"
                    >
                      <img
                        src={att.url}
                        alt={att.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover/media:scale-102"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs">
                        {t('viewAllMedia')}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={att.id}
                    onClick={() => onOpenAttachment(att)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-black/10 dark:bg-black/20 hover:bg-black/15 cursor-pointer text-xs"
                  >
                    <FileText className="w-5 h-5 flex-shrink-0 text-blue-400" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{att.name}</div>
                      <div className="text-[10px] opacity-75">{att.size || '1.2 MB'}</div>
                    </div>
                    <Download className="w-4 h-4 opacity-75 hover:opacity-100 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticker View */}
          {message.type === 'sticker' && message.stickerUrl && (
            <div className="w-28 h-28 my-1">
              <img
                src={message.stickerUrl}
                alt="Sticker"
                className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* GIF View */}
          {message.type === 'gif' && message.gifUrl && (
            <div className="rounded-xl overflow-hidden my-1 max-w-xs shadow-xs">
              <img src={message.gifUrl} alt="GIF" className="w-full h-auto object-cover" />
            </div>
          )}

          {/* Interactive Audio Voice Memo View */}
          {message.type === 'voice' && (
            <div className="flex items-center gap-2.5 py-0.5 min-w-[180px] sm:min-w-[210px]">
              <button
                type="button"
                onClick={toggleAudioPlay}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 cursor-pointer shadow-xs ${
                  isOutgoing
                    ? 'bg-white text-[#0066FF] hover:bg-white/90'
                    : 'bg-[#007AFF] text-white hover:bg-[#0066FF]'
                }`}
              >
                {isPlayingAudio ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              {/* Dynamic Waveform Visualizer */}
              <div className="flex-1 flex items-center gap-0.75 h-6">
                {(
                  message.waveform || [
                    25, 45, 75, 40, 60, 90, 65, 30, 85, 95, 55, 35, 70, 45, 80, 50
                  ]
                ).map((val, i, arr) => {
                  const barProgress = i / arr.length;
                  const isPassed = barProgress <= audioProgress;
                  return (
                    <span
                      key={i}
                      style={{
                        height: isPlayingAudio && isPassed
                          ? `${Math.max(10, val * 0.55 + Math.random() * 8)}px`
                          : `${Math.max(4, val * 0.22)}px`
                      }}
                      className={`w-0.75 sm:w-1 rounded-full transition-all duration-150 ${
                        isOutgoing
                          ? isPassed
                            ? 'bg-white'
                            : 'bg-white/40'
                          : isPassed
                          ? 'bg-[#007AFF]'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Elapsed / Duration Time */}
              <span className="text-[10px] font-mono opacity-85 flex-shrink-0">
                {isPlayingAudio ? audioDisplayTime : message.audioDuration || '0:14'}
              </span>
            </div>
          )}

          {/* Text Content with Inline Floating Status & Time */}
          {message.text && (
            <div className="text-[13px] sm:text-[13.5px] leading-relaxed break-words select-text">
              <span className="align-baseline">{message.text}</span>

              {/* Inline metadata stamp (Telegram/iMessage style) */}
              <span
                className={`float-right ml-2.5 mt-1 -mr-0.5 inline-flex items-center gap-1 select-none text-[10px] font-medium leading-none ${
                  isOutgoing
                    ? 'text-white/80'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {message.isPinned && (
                  <Pin className="w-2.5 h-2.5 rotate-45 text-amber-300" />
                )}
                {message.edited && (
                  <span className="text-[9px] opacity-75">{t('edit')}</span>
                )}
                <span className="font-mono">{time}</span>
                {isOutgoing && (
                  <span className="inline-flex">
                    {message.status === 'read' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-200 stroke-[2.2]" />
                    ) : message.status === 'delivered' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-white/70 stroke-[2]" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-white/70 stroke-[2]" />
                    )}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Fallback footer metadata for non-text messages */}
          {!message.text && (
            <div
              className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
                isOutgoing ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {message.isPinned && (
                <Pin className="w-2.5 h-2.5 rotate-45 text-amber-300" />
              )}
              {message.edited && (
                <span className="text-[9px] opacity-75">{t('edit')}</span>
              )}
              <span className="font-mono">{time}</span>
              {isOutgoing && (
                <span className="inline-flex">
                  {message.status === 'read' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-sky-200 stroke-[2.2]" />
                  ) : message.status === 'delivered' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-white/70 stroke-[2]" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-white/70 stroke-[2]" />
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Emoji Reactions Row */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 z-10">
            {Object.entries(message.reactions).map(([emoji, users]) => {
              if (users.length === 0) return null;
              const hasMyReaction = users.includes(
                isOutgoing ? message.senderId : 'user_current'
              );
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact(message.id, emoji)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${
                    hasMyReaction
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500/50 text-[#007AFF] dark:text-[#0A84FF]'
                      : 'bg-white/90 dark:bg-[#1E2430]/90 backdrop-blur-sm border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-[12px]">{emoji}</span>
                  <span className="text-[10px] font-bold">{users.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Menu on Hover / Long Press */}
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white/90 dark:bg-[#1C2230]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-1 py-0.5 shadow-md z-20 ${
          isOutgoing ? 'order-first' : 'order-last'
        }`}
      >
        {/* Quick Reaction Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            title={t('react')}
            className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Smile className="w-3.5 h-3.5 stroke-[2]" />
          </button>

          {showReactionPicker && (
            <div className="absolute bottom-8 left-0 flex items-center gap-1 p-1 bg-white/95 dark:bg-[#1A2234]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-full shadow-xl z-50">
              {['❤️', '😂', '🔥', '👍', '😮', '😢'].map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    onReact(message.id, em);
                    setShowReactionPicker(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center text-sm hover:scale-125 transition-transform cursor-pointer"
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Reply Button */}
        <button
          type="button"
          onClick={() => onReply(message)}
          title={t('reply')}
          className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <CornerUpLeft className="w-3.5 h-3.5 stroke-[2]" />
        </button>

        {/* More Actions Dropdown */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          }
          items={dropdownItems}
          align={isOutgoing ? 'right' : 'left'}
        />
      </div>
    </div>
  );
};
