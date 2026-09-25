import React from 'react';
import { AppNotification } from '../../types/messenger';
import { Drawer } from '../ui/Drawer';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Bell, CheckCheck, Trash2, Flame, Heart, MessageSquare } from 'lucide-react';
import { getTranslation, Language } from '../../utils/i18n';

interface NotificationsDrawerProps {
  isOpen: boolean;
  notifications: AppNotification[];
  language: Language;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onOpenChat: (chatId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  notifications,
  language,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onOpenChat
}) => {
  const t = (key: any) => getTranslation(language, key);

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case 'message':
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('notificationsTitle')} width="sm">
      <div className="flex flex-col h-full select-none">
        {/* Actions Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t('markAllRead')}</span>
          </button>
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold text-slate-500 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearAll')}</span>
          </button>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkRead(notif.id);
                  if (notif.linkChatId) {
                    onOpenChat(notif.linkChatId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                    : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500/30 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {notif.avatar ? (
                    <Avatar src={notif.avatar} name={notif.title} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                      {notif.body}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
              <Bell className="w-8 h-8 mb-2 opacity-40 stroke-[1.5]" />
              <p className="text-xs">{t('noNotifications')}</p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
