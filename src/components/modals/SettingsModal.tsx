import React, { useState } from 'react';
import {
  User as UserIcon,
  Palette,
  MessageSquare,
  Bell,
  Lock,
  Globe,
  Info,
  Check,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { AppSettings, BubbleStyle, User } from '../../types/messenger';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { getTranslation, Language } from '../../utils/i18n';
import { WALLPAPERS } from '../../data/mockData';
import { soundManager } from '../../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: User;
  settings: AppSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: AppSettings) => void;
  onUpdateProfile: (updates: Partial<User>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  settings,
  onClose,
  onSaveSettings,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<
    'account' | 'appearance' | 'chat' | 'notifications' | 'privacy' | 'language' | 'about'
  >('appearance');

  // Form states
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');

  const lang = localSettings.language;
  const t = (key: any) => getTranslation(lang, key);

  const handleSave = () => {
    onSaveSettings(localSettings);
    onUpdateProfile({ displayName, username, bio });
    soundManager.setConfig(localSettings.soundEnabled, localSettings.soundVolume);
    soundManager.playTap();
    onClose();
  };

  const bubbleStyles: { id: BubbleStyle; name: string }[] = [
    { id: 'modern', name: t('bubbleModern') },
    { id: 'glass', name: t('bubbleGlass') },
    { id: 'rounded', name: t('bubbleRounded') },
    { id: 'classic', name: t('bubbleClassic') },
    { id: 'minimal', name: t('bubbleMinimal') }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settingsTitle')} maxWidth="2xl">
      <div className="flex flex-col md:flex-row gap-6 -m-6 min-h-[460px]">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible flex-shrink-0 select-none">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{t('tabAppearance')}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('tabChat')}</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'account'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>{t('tabAccount')}</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{t('tabNotifications')}</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{t('tabPrivacy')}</span>
          </button>

          <button
            onClick={() => setActiveTab('language')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'language'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t('tabLanguage')}</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{t('tabAbout')}</span>
          </button>
        </div>

        {/* Right Settings Body */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {t('theme')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['dark', 'light'] as const).map(themeOption => (
                    <button
                      key={themeOption}
                      onClick={() => setLocalSettings(s => ({ ...s, theme: themeOption }))}
                      className={`p-3 rounded-xl border text-center font-medium text-xs transition-all cursor-pointer ${
                        localSettings.theme === themeOption
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {themeOption === 'dark' ? t('themeDark') : t('themeLight')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {t('accentColor')}
                </label>
                <div className="flex items-center gap-3">
                  {['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#06b6d4'].map(color => (
                    <button
                      key={color}
                      onClick={() => setLocalSettings(s => ({ ...s, accentColor: color }))}
                      style={{ backgroundColor: color }}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                    >
                      {localSettings.accentColor === color && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Settings Tab (Bubbles, Wallpapers, Density) */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              {/* Bubble Style */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {t('bubbleStyle')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bubbleStyles.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setLocalSettings(s => ({ ...s, bubbleStyle: b.id }))}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        localSettings.bubbleStyle === b.id
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>

                {/* Dynamic Live Preview Box */}
                {(() => {
                  const getPreviewClasses = (isOutgoing: boolean) => {
                    switch (localSettings.bubbleStyle) {
                      case 'modern':
                        return isOutgoing
                          ? 'bg-gradient-to-br from-[#0066FF] to-[#0051CC] text-white rounded-[16px] rounded-br-[3px] shadow-xs'
                          : 'bg-white dark:bg-[#1E2430] text-slate-900 dark:text-slate-100 rounded-[16px] rounded-bl-[3px] border border-black/10 dark:border-white/10 shadow-2xs';
                      case 'rounded':
                        return isOutgoing
                          ? 'bg-[#007AFF] text-white rounded-[20px] rounded-br-[5px] shadow-sm'
                          : 'bg-[#EAEBED] dark:bg-[#222733] text-black dark:text-white rounded-[20px] rounded-bl-[5px] shadow-2xs';
                      case 'classic':
                        return isOutgoing
                          ? 'bg-[#0B63E5] text-white rounded-xl rounded-tr-none shadow-xs'
                          : 'bg-[#F1F3F5] dark:bg-[#1A202C] text-slate-900 dark:text-slate-100 rounded-xl rounded-tl-none border border-slate-200/80 dark:border-slate-700/60 shadow-2xs';
                      case 'minimal':
                        return isOutgoing
                          ? 'bg-blue-500/15 text-blue-900 dark:text-blue-100 border border-blue-500/40 rounded-[14px]'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-900 dark:text-slate-100 border border-black/10 dark:border-white/10 rounded-[14px]';
                      case 'glass':
                        return isOutgoing
                          ? 'bg-[#007AFF]/85 text-white backdrop-blur-xl border border-white/30 rounded-[16px] rounded-br-[4px] shadow-sm'
                          : 'bg-white/80 dark:bg-[#1B212D]/80 text-black dark:text-white backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[16px] rounded-bl-[4px] shadow-2xs';
                      default:
                        return '';
                    }
                  };
                  return (
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#F2F2F7] dark:bg-[#121620] border border-black/10 dark:border-white/10 space-y-2 select-none transition-all">
                      <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                        <span>Попередній перегляд стилю</span>
                        <span className="font-mono">{localSettings.bubbleStyle}</span>
                      </div>
                      <div className="flex justify-start">
                        <div className={`text-xs px-3 py-1.5 ${getPreviewClasses(false)}`}>
                          Привіт! Як справи?
                          <span className="ml-2 text-[10px] text-slate-400 font-mono">10:42</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className={`text-xs px-3 py-1.5 ${getPreviewClasses(true)}`}>
                          Все супер! Оновлений компактний стиль ✨
                          <span className="ml-2 text-[10px] text-white/80 font-mono">10:43 ✓✓</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Chat Wallpaper */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {t('wallpaper')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WALLPAPERS.map(w => (
                    <button
                      key={w.id}
                      onClick={() => setLocalSettings(s => ({ ...s, wallpaperId: w.id }))}
                      className={`h-16 rounded-xl border p-2 flex flex-col justify-end text-left relative overflow-hidden transition-all cursor-pointer ${
                        localSettings.wallpaperId === w.id
                          ? 'border-blue-600 ring-2 ring-blue-500/50'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      style={{
                        background:
                          w.type === 'solid' || w.type === 'gradient' || w.type === 'pattern'
                            ? w.value
                            : 'transparent'
                      }}
                    >
                      <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-md truncate max-w-full">
                        {w.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter to Send Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('enterToSendSetting')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t('pressShiftEnterForNewline')}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enterToSend}
                  onChange={e => setLocalSettings(s => ({ ...s, enterToSend: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Account Profile Tab */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('displayName')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('username')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('bio')}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  {localSettings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('soundEffects')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Звуки відправки, отримання та реакцій
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={e => {
                    const enabled = e.target.checked;
                    setLocalSettings(s => ({ ...s, soundEnabled: enabled }));
                    soundManager.setConfig(enabled, localSettings.soundVolume);
                    if (enabled) soundManager.playMessageSent();
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {localSettings.soundEnabled && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                    <span>{t('soundVolume')}</span>
                    <span>{Math.round(localSettings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={localSettings.soundVolume}
                    onChange={e => {
                      const vol = parseFloat(e.target.value);
                      setLocalSettings(s => ({ ...s, soundVolume: vol }));
                      soundManager.setConfig(localSettings.soundEnabled, vol);
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('readReceipts')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Показувати подвійні блакитні галочки про прочитання
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.privacyReadReceipts}
                  onChange={e =>
                    setLocalSettings(s => ({ ...s, privacyReadReceipts: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="space-y-3">
              <button
                onClick={() => setLocalSettings(s => ({ ...s, language: 'uk' }))}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  localSettings.language === 'uk'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>🇺🇦 Українська (Ukrainian)</span>
                {localSettings.language === 'uk' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setLocalSettings(s => ({ ...s, language: 'en' }))}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  localSettings.language === 'en'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>🇬🇧 English (US / UK)</span>
                {localSettings.language === 'en' && <Check className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-3 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 mx-auto shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
                  Æ
                </div>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Aether Messenger
              </h4>
              <p className="text-xs text-slate-500">Версія 2.4.0 (Build 2026.09)</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto pt-2">
                Сучасний, швидкий та захищений веб-месенджер з підтримкою стріків, голосових статусів та кастомних тем.
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button variant="ghost" size="md" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
