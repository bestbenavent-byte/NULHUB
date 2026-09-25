import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Flame,
  BellOff,
  ShieldAlert,
  Ban,
  Image as ImageIcon,
  FileText,
  Mic,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { User, Message, Attachment } from '../../types/messenger';
import { Drawer } from '../ui/Drawer';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { getTranslation, Language } from '../../utils/i18n';

interface UserProfileDrawerProps {
  isOpen: boolean;
  user: User | null;
  messages: Message[];
  language: Language;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onOpenStreakModal: () => void;
  onOpenAttachment: (att: Attachment) => void;
  onBlockUser: (userId: string) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  user,
  messages,
  language,
  onClose,
  onStartChat,
  onOpenStreakModal,
  onOpenAttachment,
  onBlockUser
}) => {
  const [mediaTab, setMediaTab] = useState<'media' | 'files' | 'voice'>('media');

  if (!user) return null;

  const t = (key: any) => getTranslation(language, key);

  // Extract shared media from messages
  const sharedImages: Attachment[] = [];
  const sharedFiles: Attachment[] = [];
  const voiceNotesCount = messages.filter(m => m.type === 'voice').length;

  messages.forEach(m => {
    if (m.media) {
      m.media.forEach(att => {
        if (att.type === 'image') sharedImages.push(att);
        else sharedFiles.push(att);
      });
    }
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('userDetails')} width="md">
      <div className="flex flex-col p-6 space-y-6 select-none">
        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={user.avatar}
            name={user.displayName}
            size="2xl"
            isOnline={user.isOnline}
            hasVoiceStatus={!!user.voiceStatus}
            streak={user.streak}
            className="mb-3"
          />

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {user.displayName}
          </h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
            @{user.username}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {user.isOnline ? (
              <span className="text-emerald-500 font-semibold">{t('online')}</span>
            ) : (
              t('offline')
            )}
          </p>

          {/* Quick Action: Send Message */}
          <div className="w-full mt-4 flex gap-2">
            <Button
              variant="primary"
              size="md"
              icon={<MessageSquare className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onStartChat(user.id);
              }}
              className="flex-1"
            >
              {t('sendMessage')}
            </Button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              {t('bio')}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {user.bio}
            </p>
          </div>
        )}

        {/* Streak Highlight Card */}
        {user.streak > 0 && (
          <div
            onClick={onOpenStreakModal}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                🔥
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {user.streak} {t('days')} {t('streaks').toLowerCase()}
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  {t('keepChattingDaily')}
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-500" />
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {user.phone && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase font-bold">{t('phone')}</div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{user.phone}</div>
              </div>
            </div>
          )}
          {user.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase font-bold">{t('email')}</div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{user.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Shared Media Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {t('sharedMedia')}
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-3">
            <button
              onClick={() => setMediaTab('media')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mediaTab === 'media'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('photosAndVideos')} ({sharedImages.length})
            </button>
            <button
              onClick={() => setMediaTab('files')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mediaTab === 'files'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('files')} ({sharedFiles.length})
            </button>
            <button
              onClick={() => setMediaTab('voice')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mediaTab === 'voice'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('voiceNotes')} ({voiceNotesCount})
            </button>
          </div>

          {/* Media Grid */}
          {mediaTab === 'media' && (
            sharedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {sharedImages.map(img => (
                  <div
                    key={img.id}
                    onClick={() => onOpenAttachment(img)}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Немає спільних зображень
              </div>
            )
          )}

          {/* Files List */}
          {mediaTab === 'files' && (
            sharedFiles.length > 0 ? (
              <div className="space-y-2">
                {sharedFiles.map(file => (
                  <div
                    key={file.id}
                    onClick={() => onOpenAttachment(file)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-400">{file.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Немає спільних файлів
              </div>
            )
          )}

          {/* Voice Notes */}
          {mediaTab === 'voice' && (
            <div className="text-center py-6 text-xs text-slate-400">
              {voiceNotesCount > 0 ? `${voiceNotesCount} голосових повідомлень у листуванні` : 'Немає голосових записів'}
            </div>
          )}
        </div>

        {/* Safety Actions: Block, Report */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={() => onBlockUser(user.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
          >
            <Ban className="w-4 h-4" />
            <span>{t('blockUser')}</span>
          </button>
          <button
            onClick={() => alert('Скаргу надіслано модераторам Aether.')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t('reportUser')}</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
};
