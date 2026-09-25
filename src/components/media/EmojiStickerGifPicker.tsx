import React, { useState } from 'react';
import { Search, Smile, Sparkles, Film, X } from 'lucide-react';
import { POPULAR_EMOJIS, MOCK_STICKERS, MOCK_GIFS } from '../../data/mockData';
import { getTranslation, Language } from '../../utils/i18n';

interface EmojiStickerGifPickerProps {
  language: Language;
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
  onSelectGif: (gifUrl: string) => void;
  onClose: () => void;
}

export const EmojiStickerGifPicker: React.FC<EmojiStickerGifPickerProps> = ({
  language,
  onSelectEmoji,
  onSelectSticker,
  onSelectGif,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gif'>('emoji');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPack, setSelectedPack] = useState<'all' | 'Cats' | 'Dev'>('all');

  const t = (key: any) => getTranslation(language, key);

  // Filter emojis
  const filteredEmojis = searchQuery.trim()
    ? POPULAR_EMOJIS.filter(e => e.includes(searchQuery.trim()))
    : POPULAR_EMOJIS;

  // Filter stickers
  const filteredStickers = MOCK_STICKERS.filter(s =>
    selectedPack === 'all' ? true : s.pack === selectedPack
  );

  // Filter gifs
  const filteredGifs = searchQuery.trim()
    ? MOCK_GIFS.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_GIFS;

  return (
    <div className="flex flex-col h-80 w-80 sm:w-96 bg-white dark:bg-[#151c2c] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden select-none z-50">
      {/* Top Header & Tabs */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('emoji')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'emoji'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>{t('emojisTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('stickersTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('gif')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'gif'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>{t('gifsTab')}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input for Emoji / GIF */}
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'gif'
                ? t('searchGifs')
                : activeTab === 'emoji'
                ? t('searchEmojis')
                : t('searchPlaceholder')
            }
            className="w-full h-8 pl-8 pr-3 text-xs bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-lg focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Emoji Tab */}
        {activeTab === 'emoji' && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              {t('smileys')}
            </div>
            <div className="grid grid-cols-8 gap-2">
              {filteredEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stickers Tab */}
        {activeTab === 'stickers' && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              {(['all', 'Cats', 'Dev'] as const).map(pack => (
                <button
                  key={pack}
                  onClick={() => setSelectedPack(pack)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedPack === pack
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {pack === 'all' ? 'Всі стікери' : pack}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {filteredStickers.map(st => (
                <button
                  key={st.id}
                  onClick={() => onSelectSticker(st.url)}
                  className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-500 hover:scale-105 transition-all bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center cursor-pointer"
                >
                  <img src={st.url} alt={st.name} className="w-16 h-16 object-cover rounded-lg" />
                  <span className="text-[10px] text-slate-500 mt-1 truncate">{st.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GIF Tab */}
        {activeTab === 'gif' && (
          <div className="grid grid-cols-2 gap-2">
            {filteredGifs.map(gif => (
              <button
                key={gif.id}
                onClick={() => onSelectGif(gif.url)}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:scale-102 transition-transform cursor-pointer relative group"
              >
                <img src={gif.url} alt={gif.title} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium truncate">{gif.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
