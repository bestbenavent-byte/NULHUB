import React from 'react';
import { Flame, Award, CheckCircle2, Lock, Share2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { STREAK_MEDALS } from '../../data/mockData';
import { getTranslation, Language } from '../../utils/i18n';
import { useToast } from '../ui/Toast';

interface StreakMedalsModalProps {
  isOpen: boolean;
  streakDays: number;
  language: Language;
  onClose: () => void;
}

export const StreakMedalsModal: React.FC<StreakMedalsModalProps> = ({
  isOpen,
  streakDays,
  language,
  onClose
}) => {
  const { showToast } = useToast();
  const t = (key: any) => getTranslation(language, key);

  // Find next medal
  const nextMedal = STREAK_MEDALS.find(m => m.daysRequired > streakDays) || STREAK_MEDALS[STREAK_MEDALS.length - 1];
  const progressPercent = Math.min(100, Math.round((streakDays / nextMedal.daysRequired) * 100));

  const handleShare = () => {
    navigator.clipboard?.writeText?.(`Я тримаю стрік спілкування 🔥 ${streakDays} днів у Aether Messenger!`);
    showToast('Стрік скопійовано для поширення! 🔥', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('streaksTitle')}
      subtitle={t('streaksSubtitle')}
      maxWidth="md"
    >
      <div className="space-y-6 select-none">
        {/* Streak Hero Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-rose-500/20 border border-amber-500/30 text-center relative overflow-hidden">
          <div className="text-5xl mb-2 animate-bounce">🔥</div>
          <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {streakDays} {t('days')}
          </div>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
            {t('keepChattingDaily')}
          </p>

          {/* Progress to next milestone */}
          <div className="w-full mt-5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>{t('nextGoal')}: {nextMedal.name}</span>
              <span>{streakDays} / {nextMedal.daysRequired} {t('days')}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Medals Catalog */}
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            {t('unlockedMedals')}
          </div>

          <div className="space-y-2.5">
            {STREAK_MEDALS.map(medal => {
              const isUnlocked = streakDays >= medal.daysRequired;

              return (
                <div
                  key={medal.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-50 dark:bg-slate-800/60 border-amber-500/40 shadow-2xs'
                      : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      style={{ backgroundColor: isUnlocked ? `${medal.color}25` : undefined }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-slate-200 dark:bg-slate-800"
                    >
                      {medal.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {medal.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {medal.daysRequired}d
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                        {medal.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-3">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Button */}
        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            icon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
            className="w-full"
          >
            Поділитися стріком
          </Button>
        </div>
      </div>
    </Modal>
  );
};
