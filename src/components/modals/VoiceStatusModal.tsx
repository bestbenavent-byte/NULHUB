import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
  Sparkles,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { VoiceStatus, User } from '../../types/messenger';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { getTranslation, Language } from '../../utils/i18n';
import { soundManager } from '../../utils/sound';

interface VoiceStatusModalProps {
  isOpen: boolean;
  voiceStatuses: VoiceStatus[];
  users: User[];
  currentUserId: string;
  language: Language;
  onClose: () => void;
  onPublishStatus: (caption: string, duration: number, waveform: number[]) => void;
  onDeleteStatus: (statusId: string) => void;
  onListenStatus: (statusId: string) => void;
}

export const VoiceStatusModal: React.FC<VoiceStatusModalProps> = ({
  isOpen,
  voiceStatuses,
  users,
  currentUserId,
  language,
  onClose,
  onPublishStatus,
  onDeleteStatus,
  onListenStatus
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<number[] | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [caption, setCaption] = useState('');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const timerRef = useRef<any>(null);
  const t = (key: any) => getTranslation(language, key);

  // Map users for fast lookup
  const userMap = new Map<string, User>();
  users.forEach(u => userMap.set(u.id, u));

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => {
          if (prev >= 15) {
            handleStopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordedAudio(null);
    setIsRecording(true);
    soundManager.playTap();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const mockWaveform = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80 + 20));
    setRecordedAudio(mockWaveform);
    soundManager.playTap();
  };

  const handlePublish = () => {
    if (!recordedAudio) return;
    onPublishStatus(caption || 'Новий статус 🎵', Math.max(3, recordSeconds), recordedAudio);
    setRecordedAudio(null);
    setCaption('');
    setRecordSeconds(0);
    soundManager.playMessageSent();
    onClose();
  };

  const handleTogglePlayStatus = (statusId: string) => {
    if (activePlayingId === statusId) {
      setActivePlayingId(null);
    } else {
      setActivePlayingId(statusId);
      onListenStatus(statusId);
      soundManager.playReaction();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('voiceStatusTitle')}
      subtitle={t('voiceStatusSubtitle')}
      maxWidth="lg"
    >
      <div className="space-y-6 select-none">
        {/* Record New Status Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{t('recordNewVoiceStatus')}</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              макс. 15 сек
            </span>
          </div>

          {!recordedAudio && !isRecording && (
            <div className="flex flex-col items-center py-4">
              <button
                onClick={handleStartRecording}
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform cursor-pointer"
              >
                <Mic className="w-8 h-8" />
              </button>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2.5">
                {t('startRecording')}
              </span>
            </div>
          )}

          {isRecording && (
            <div className="flex flex-col items-center py-3 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                  0:{recordSeconds < 10 ? '0' : ''}{recordSeconds} / 0:15
                </span>
              </div>

              {/* Animated wave bars */}
              <div className="flex items-center gap-1 h-8">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    style={{ height: `${Math.floor(Math.random() * 24 + 8)}px` }}
                    className="w-1.5 bg-rose-500 rounded-full transition-all duration-150"
                  />
                ))}
              </div>

              <button
                onClick={handleStopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t('stopRecording')}</span>
              </button>
            </div>
          )}

          {recordedAudio && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer"
                >
                  {isPlayingPreview ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <div className="flex-1 flex items-center gap-0.5 h-6">
                  {recordedAudio.map((val, idx) => (
                    <span
                      key={idx}
                      style={{ height: `${Math.max(6, val * 0.22)}px` }}
                      className="w-1 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setRecordedAudio(null)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder={t('statusCaptionPlaceholder')}
                className="w-full h-9 px-3 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setRecordedAudio(null)}>
                  {t('reRecord')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePublish}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  {t('publishStatus')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* List of active friends' voice statuses */}
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white mb-3">
            Активні статуси друзів ({voiceStatuses.length})
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {voiceStatuses.map(status => {
              const user = userMap.get(status.userId);
              if (!user) return null;
              const isPlaying = activePlayingId === status.id;

              return (
                <div
                  key={status.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                    <Avatar
                      src={user.avatar}
                      name={user.displayName}
                      size="md"
                      hasVoiceStatus={true}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.displayName}
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                          0:{status.duration < 10 ? '0' : ''}{status.duration}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {status.caption}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                        <Headphones className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>{status.listensCount} {t('listens')}</span>
                        <span>·</span>
                        <span>{t('expiresIn24Hours')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePlayStatus(status.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-transform active:scale-90 ${
                      isPlaying
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
