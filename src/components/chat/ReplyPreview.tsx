import React from 'react';
import { CornerUpLeft, X, Image as ImageIcon, FileText } from 'lucide-react';
import { MessageReplySummary } from '../../types/messenger';
import { getTranslation, Language } from '../../utils/i18n';

interface ReplyPreviewProps {
  reply: MessageReplySummary;
  language: Language;
  onCancel: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  reply,
  language,
  onCancel
}) => {
  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-xs select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        <CornerUpLeft className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <div className="border-l-2 border-blue-500 pl-2.5 min-w-0">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">
            {t('replyingTo')} {reply.senderName}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate flex items-center gap-1">
            {reply.mediaType === 'image' && <ImageIcon className="w-3 h-3 text-slate-400" />}
            {reply.mediaType === 'file' && <FileText className="w-3 h-3 text-slate-400" />}
            <span>{reply.text || (reply.mediaType ? t('photosAndVideos') : '')}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onCancel}
        aria-label={t('cancelReply')}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
