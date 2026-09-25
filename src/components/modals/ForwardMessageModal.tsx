import React, { useState } from 'react';
import { Chat, Message, User } from '../../types/messenger';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Forward } from 'lucide-react';
import { getTranslation, Language } from '../../utils/i18n';

interface ForwardMessageModalProps {
  isOpen: boolean;
  message: Message | null;
  chats: Chat[];
  users: User[];
  currentUserId: string;
  language: Language;
  onClose: () => void;
  onForward: (targetChatId: string) => void;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  isOpen,
  message,
  chats,
  users,
  currentUserId,
  language,
  onClose,
  onForward
}) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const t = (key: any) => getTranslation(language, key);

  if (!message) return null;

  const userMap = new Map<string, User>();
  users.forEach(u => userMap.set(u.id, u));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('forwardTitle')} maxWidth="sm">
      <div className="space-y-4 select-none">
        {/* Forward Preview Snippet */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border-l-4 border-blue-500 truncate">
          {message.text || (message.media ? `[${t('photosAndVideos')}]` : '[Медіа]')}
        </div>

        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {t('forwardTo')}
        </div>

        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {chats.map(chat => {
            const partnerId = chat.participants.find(p => p !== currentUserId);
            const partner = partnerId ? userMap.get(partnerId) : undefined;
            const displayName = chat.type === 'direct' && partner ? partner.displayName : chat.name;
            const avatarSrc = chat.type === 'direct' && partner ? partner.avatar : chat.avatar;

            return (
              <div
                key={chat.id}
                onClick={() => {
                  onForward(chat.id);
                  onClose();
                }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <Avatar src={avatarSrc} name={displayName} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {chat.type === 'group' ? `${chat.participants.length} учасників` : 'Особистий чат'}
                  </div>
                </div>
                <Forward className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
