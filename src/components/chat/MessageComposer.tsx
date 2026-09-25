import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image as ImageIcon,
  FileText,
  Trash2,
  Square,
  ArrowUp,
  Plus,
  Sparkles,
  Camera,
  X
} from 'lucide-react';
import {
  MessageReplySummary,
  Attachment,
  AppSettings
} from '../../types/messenger';
import { ReplyPreview } from './ReplyPreview';
import { AttachmentPreview } from './AttachmentPreview';
import { EmojiStickerGifPicker } from '../media/EmojiStickerGifPicker';
import { getTranslation, Language } from '../../utils/i18n';
import { soundManager } from '../../utils/sound';

interface MessageComposerProps {
  chatId: string;
  settings: AppSettings;
  replyTo?: MessageReplySummary;
  language: Language;
  onSendMessage: (text: string, options?: {
    replyTo?: MessageReplySummary;
    media?: Attachment[];
    type?: 'text' | 'media' | 'voice' | 'sticker' | 'gif';
    stickerUrl?: string;
    gifUrl?: string;
    audioDuration?: string;
    waveform?: number[];
  }) => void;
  onCancelReply: () => void;
  onTyping: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  chatId,
  settings,
  replyTo,
  language,
  onSendMessage,
  onCancelReply,
  onTyping
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<any>(null);

  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    onSendMessage(trimmed, {
      replyTo,
      media: attachments.length > 0 ? attachments : undefined
    });

    setText('');
    setAttachments([]);
    onCancelReply();
    setShowPicker(false);
    setShowAttachMenu(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (settings.enterToSend && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onTyping();
    }
  };

  // Attach mock image
  const handleAttachImage = () => {
    setShowAttachMenu(false);
    const mockImages = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'
    ];
    const picked = mockImages[Math.floor(Math.random() * mockImages.length)];
    const newAtt: Attachment = {
      id: `att_${Date.now()}`,
      type: 'image',
      url: picked,
      name: `photo_${Date.now().toString().slice(-4)}.jpg`,
      size: '1.8 MB'
    };
    setAttachments(prev => [...prev, newAtt]);
    soundManager.playTap();
  };

  // Attach mock document
  const handleAttachDoc = () => {
    setShowAttachMenu(false);
    const newAtt: Attachment = {
      id: `att_${Date.now()}`,
      type: 'file',
      url: '#',
      name: 'Project_Specification_v2.pdf',
      size: '3.4 MB'
    };
    setAttachments(prev => [...prev, newAtt]);
    soundManager.playTap();
  };

  // Send Sticker
  const handleSelectSticker = (stickerUrl: string) => {
    setShowPicker(false);
    onSendMessage('', {
      replyTo,
      type: 'sticker',
      stickerUrl
    });
    onCancelReply();
  };

  // Send GIF
  const handleSelectGif = (gifUrl: string) => {
    setShowPicker(false);
    onSendMessage('', {
      replyTo,
      type: 'gif',
      gifUrl
    });
    onCancelReply();
  };

  // Send Emoji
  const handleSelectEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Complete voice recording and send
  const handleFinishVoiceRecord = () => {
    setIsRecording(false);
    const durationStr = `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`;
    const waveform = Array.from({ length: 14 }, () => Math.floor(Math.random() * 80 + 20));

    onSendMessage('', {
      replyTo,
      type: 'voice',
      audioDuration: durationStr,
      waveform
    });
    onCancelReply();
  };

  const handleCancelVoiceRecord = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    soundManager.playTap();
  };

  const hasContent = text.trim().length > 0 || attachments.length > 0;

  return (
    <div className="relative border-t border-black/10 dark:border-white/10 bg-white/85 dark:bg-[#161618]/90 backdrop-blur-2xl flex-shrink-0 z-20">
      
      {/* Reply Preview Bar */}
      {replyTo && (
        <ReplyPreview reply={replyTo} language={language} onCancel={onCancelReply} />
      )}

      {/* Attachments Preview Bar */}
      {attachments.length > 0 && (
        <AttachmentPreview
          attachments={attachments}
          onRemove={id => setAttachments(prev => prev.filter(a => a.id !== id))}
        />
      )}

      {/* Floating Emoji/Sticker/GIF Picker Popover */}
      {showPicker && (
        <div className="absolute bottom-full right-3 mb-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <EmojiStickerGifPicker
            language={language}
            onSelectEmoji={handleSelectEmoji}
            onSelectSticker={handleSelectSticker}
            onSelectGif={handleSelectGif}
            onClose={() => setShowPicker(false)}
          />
        </div>
      )}

      {/* iOS 17/18 Style Floating App Attachment Sheet */}
      {showAttachMenu && (
        <div className="absolute bottom-full left-3 mb-2.5 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-[22px] p-3 shadow-2xl z-50 w-72 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5 px-1">
            <span className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Додати до повідомлення
            </span>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="text-[#8E8E93] hover:text-black dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Photos & Videos */}
            <button
              type="button"
              onClick={handleAttachImage}
              className="flex items-center gap-2.5 p-2 rounded-[14px] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left group"
            >
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4.5 h-4.5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-black dark:text-white leading-tight">
                  Фото
                </div>
                <div className="text-[10px] text-[#8E8E93]">Медіафайли</div>
              </div>
            </button>

            {/* Documents */}
            <button
              type="button"
              onClick={handleAttachDoc}
              className="flex items-center gap-2.5 p-2 rounded-[14px] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left group"
            >
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#34C759] to-[#30B0C7] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="w-4.5 h-4.5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-black dark:text-white leading-tight">
                  Файл
                </div>
                <div className="text-[10px] text-[#8E8E93]">Документи</div>
              </div>
            </button>

            {/* Stickers & Emojis */}
            <button
              type="button"
              onClick={() => {
                setShowAttachMenu(false);
                setShowPicker(true);
              }}
              className="flex items-center gap-2.5 p-2 rounded-[14px] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left group"
            >
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#FF9500] to-[#FF2D55] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Smile className="w-4.5 h-4.5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-black dark:text-white leading-tight">
                  Стікери
                </div>
                <div className="text-[10px] text-[#8E8E93]">Емодзі та GIF</div>
              </div>
            </button>

            {/* Voice Audio Note */}
            <button
              type="button"
              onClick={() => {
                setShowAttachMenu(false);
                setIsRecording(true);
              }}
              className="flex items-center gap-2.5 p-2 rounded-[14px] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left group"
            >
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#AF52DE] to-[#5856D6] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Mic className="w-4.5 h-4.5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-black dark:text-white leading-tight">
                  Голос
                </div>
                <div className="text-[10px] text-[#8E8E93]">Запис аудіо</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Recording Mode in modern iOS style */}
      {isRecording ? (
        <div className="flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-[#161618] border-t border-rose-500/20">
          {/* Recording Timer & Pulsing Dot */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-ping" />
            <span className="text-[13px] font-mono font-bold text-[#FF3B30]">
              0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
            </span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1 h-5 px-3">
            {[40, 70, 95, 30, 85, 60, 100, 45, 80, 50, 90, 65, 35].map((h, i) => (
              <span
                key={i}
                style={{ height: `${Math.max(6, (h * (recordingSeconds % 3 + 1)) % 22)}px` }}
                className="w-1 bg-[#FF3B30] rounded-full transition-all duration-150"
              />
            ))}
          </div>

          {/* Cancel (Trash) & Send Voice Note */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCancelVoiceRecord}
              title={t('cancel')}
              className="w-8 h-8 rounded-full text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={handleFinishVoiceRecord}
              className="w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
            >
              <ArrowUp className="w-4.5 h-4.5 stroke-[2.8]" />
            </button>
          </div>
        </div>
      ) : (
        /* iOS iMessage Regular Input Bar */
        <div className="flex items-end gap-2 px-3 py-2">
          
          {/* iOS Circular Plus Attach Button */}
          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(!showAttachMenu);
              setShowPicker(false);
            }}
            title={t('attachFile')}
            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 cursor-pointer ${
              showAttachMenu
                ? 'bg-[#007AFF] text-white rotate-45 shadow-xs'
                : 'bg-[#7676801F] dark:bg-[#7676803D] text-[#8E8E93] hover:text-[#007AFF]'
            }`}
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.4] transition-transform duration-200" />
          </button>

          {/* iOS Rounded Pill Bubble with Auto-Expanding Input */}
          <div className="flex-1 min-h-[38px] bg-[#76768014] dark:bg-[#7676802E] rounded-[21px] px-3.5 py-1.5 flex items-end gap-2 border border-black/10 dark:border-white/12 focus-within:border-[#007AFF]/60 focus-within:bg-white dark:focus-within:bg-[#1C1C1E] transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('typeMessage')}
              className="w-full text-[14px] bg-transparent text-black dark:text-white focus:outline-none resize-none max-h-32 placeholder-[#8E8E93] leading-relaxed py-0.5"
            />

            {/* Embedded Emoji/Sticker Trigger inside the Pill */}
            <button
              type="button"
              onClick={() => {
                setShowPicker(!showPicker);
                setShowAttachMenu(false);
              }}
              title={t('emojiAndStickers')}
              className={`p-1 text-[#8E8E93] hover:text-[#007AFF] transition-colors flex-shrink-0 cursor-pointer mb-0.5 ${
                showPicker ? 'text-[#007AFF]' : ''
              }`}
            >
              <Smile className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* iOS Send (ArrowUp) or Voice Memo (Mic) Button */}
          {hasContent ? (
            <button
              type="button"
              onClick={handleSend}
              title={t('send')}
              className="w-8.5 h-8.5 rounded-full bg-[#007AFF] hover:bg-[#0066FF] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 flex-shrink-0 cursor-pointer mb-0.5"
            >
              <ArrowUp className="w-4.5 h-4.5 stroke-[2.8]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              title={t('voiceMemo')}
              className="w-8.5 h-8.5 rounded-full text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#7676801F] flex items-center justify-center transition-all active:scale-90 flex-shrink-0 cursor-pointer mb-0.5"
            >
              <Mic className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
