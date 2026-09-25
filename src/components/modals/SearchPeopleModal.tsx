import React, { useState } from 'react';
import { Search, MessageSquare, UserCheck, X } from 'lucide-react';
import { User } from '../../types/messenger';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { getTranslation, Language } from '../../utils/i18n';

interface SearchPeopleModalProps {
  isOpen: boolean;
  users: User[];
  currentUserId: string;
  language: Language;
  onClose: () => void;
  onSelectUser: (user: User) => void;
  onViewProfile: (user: User) => void;
}

export const SearchPeopleModal: React.FC<SearchPeopleModalProps> = ({
  isOpen,
  users,
  currentUserId,
  language,
  onClose,
  onSelectUser,
  onViewProfile
}) => {
  const [query, setQuery] = useState('');
  const t = (key: any) => getTranslation(language, key);

  const filteredUsers = users.filter(u => {
    if (u.id === currentUserId) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.bio && u.bio.toLowerCase().includes(q))
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('searchPeopleTitle')} maxWidth="md">
      <div className="space-y-4 select-none">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPeopleInput')}
            className="w-full h-10 pl-9 pr-8 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-transparent focus:border-blue-500/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User list */}
        <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {query.trim() ? 'Результати пошуку' : t('allUsers')}
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div
                  onClick={() => onViewProfile(user)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1 mr-2"
                >
                  <Avatar
                    src={user.avatar}
                    name={user.displayName}
                    size="md"
                    isOnline={user.isOnline}
                    hasVoiceStatus={!!user.voiceStatus}
                    streak={user.streak}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onSelectUser(user);
                    }}
                    icon={<MessageSquare className="w-3.5 h-3.5" />}
                  >
                    {t('sendMessage')}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              {t('noPeopleFound')}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
