import React from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { getTranslation, Language } from '../../utils/i18n';

interface InChatSearchProps {
  language: Language;
  query: string;
  totalMatches: number;
  currentMatchIndex: number;
  onQueryChange: (q: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const InChatSearch: React.FC<InChatSearchProps> = ({
  language,
  query,
  totalMatches,
  currentMatchIndex,
  onQueryChange,
  onNext,
  onPrev,
  onClose
}) => {
  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md z-10 select-none">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder={t('searchInChatPlaceholder')}
          className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {query && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-2">
            {totalMatches > 0
              ? `${currentMatchIndex + 1} ${t('imageOf')} ${totalMatches}`
              : '0 знайдено'}
          </span>
        )}

        <button
          onClick={onPrev}
          disabled={totalMatches === 0}
          title="Попередній"
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <button
          onClick={onNext}
          disabled={totalMatches === 0}
          title="Наступний"
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

        <button
          onClick={onClose}
          title={t('close')}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
