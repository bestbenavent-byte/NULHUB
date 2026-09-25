import React, { useState } from 'react';
import { User, Chat } from '../../types/messenger';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Users, User as UserIcon, Check, Plus } from 'lucide-react';
import { getTranslation, Language } from '../../utils/i18n';

interface NewChatModalProps {
  isOpen: boolean;
  users: User[];
  currentUserId: string;
  language: Language;
  onClose: () => void;
  onCreateDirect: (userId: string) => void;
  onCreateGroup: (name: string, participantIds: string[], description?: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  users,
  currentUserId,
  language,
  onClose,
  onCreateDirect,
  onCreateGroup
}) => {
  const [mode, setMode] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const t = (key: any) => getTranslation(language, key);

  const availableUsers = users.filter(u => u.id !== currentUserId);

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUserIds.length === 0) return;
    onCreateGroup(groupName.trim(), selectedUserIds, groupDescription.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'direct' ? t('newChat') : t('newGroup')}
      maxWidth="md"
    >
      <div className="space-y-4 select-none">
        {/* Toggle Mode: Direct vs Group */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setMode('direct')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'direct'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{t('newChat')}</span>
          </button>

          <button
            onClick={() => setMode('group')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'group'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('newGroup')}</span>
          </button>
        </div>

        {/* Direct mode: pick user */}
        {mode === 'direct' && (
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
            {availableUsers.map(user => (
              <div
                key={user.id}
                onClick={() => {
                  onCreateDirect(user.id);
                  onClose();
                }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <Avatar src={user.avatar} name={user.displayName} size="md" isOnline={user.isOnline} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.displayName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Group mode: form + multi select */}
        {mode === 'group' && (
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Назва групи
              </label>
              <input
                type="text"
                required
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="💡 Brainstorm & Design"
                className="w-full h-10 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Опис групи (необов'язково)
              </label>
              <input
                type="text"
                value={groupDescription}
                onChange={e => setGroupDescription(e.target.value)}
                placeholder="Спільний чат для креативних ідей"
                className="w-full h-10 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Виберіть учасників ({selectedUserIds.length})
              </label>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {availableUsers.map(user => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleSelectUser(user.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar src={user.avatar} name={user.displayName} size="sm" />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {user.displayName}
                          </div>
                          <div className="text-[10px] text-slate-500">@{user.username}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!groupName.trim() || selectedUserIds.length === 0}
              className="w-full"
            >
              Створити групу
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
