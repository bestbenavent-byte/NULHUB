import React, { useState } from 'react';
import { LogIn, UserPlus, Zap, Database, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { User } from '../../types/messenger';
import { getTranslation, Language } from '../../utils/i18n';
import { useToast } from '../ui/Toast';
import { Avatar } from '../ui/Avatar';

interface AuthModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  language,
  onClose,
  onSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const t = (key: any) => getTranslation(language, key);

  const allUsers = authService.getAllUsers();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      showToast('Введіть email або нікнейм', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login({ emailOrUsername, password });
      showToast(`${t('welcomeBack')}, ${user.displayName}!`, 'success');
      onSuccess(user);
      onClose();
    } catch (err: any) {
      showToast(err.message || t('toastError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !regUsername.trim() || !regEmail.trim()) {
      showToast('Заповніть усі обов\'язкові поля', 'warning');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Пароль має містити щонайменше 6 символів', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.register({
        displayName,
        username: regUsername,
        email: regEmail,
        password: regPassword
      });
      showToast(`Вітаємо в Aether, ${user.displayName}! Дані збережено в базі даних.`, 'success');
      onSuccess(user);
      onClose();
    } catch (err: any) {
      showToast(err.message || t('toastError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (userId: string) => {
    const user = authService.switchUser(userId);
    if (user) {
      showToast(`Увійшли як ${user.displayName}`, 'success');
      onSuccess(user);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('welcomeBack')}
      subtitle="Вхід та реєстрація з хмарною базою даних"
      maxWidth="md"
    >
      <div className="space-y-4 select-none">
        {/* Database Status Pill */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">База даних:</span>
            <span>Підключено Firestore & Auth</span>
          </div>
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Quick Demo Login Segment */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-500/20">
          <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              <span>{t('continueAsDemo')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">в 1 клік</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allUsers.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickDemo(u.id)}
                className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-500 transition-all text-left cursor-pointer"
              >
                <Avatar src={u.avatar} name={u.displayName} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-white truncate">
                    {u.displayName.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">@{u.username}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs: Login / Register */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('loginTab')}
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('registerTab')}
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('emailOrUsername')}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  placeholder="andriy@example.com або andriy_tk"
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('password')}
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Для відновлення введіть ваш email', 'info')}
                  className="text-[11px] text-blue-500 hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
              icon={<LogIn className="w-4 h-4" />}
            >
              {t('login')}
            </Button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('displayName')}
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Оксана Шевченко"
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('username')}
              </label>
              <div className="relative flex items-center">
                <span className="text-slate-400 text-xs absolute left-3 font-mono">@</span>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  placeholder="oksana_sh"
                  className="w-full h-10 pl-8 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('email')}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="oksana@example.com"
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Пароль (від 6 символів)
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Зареєструватися в базі
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
