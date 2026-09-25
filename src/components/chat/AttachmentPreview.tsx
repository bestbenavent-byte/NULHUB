import React from 'react';
import { X, FileText } from 'lucide-react';
import { Attachment } from '../../types/messenger';

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemove
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex items-center gap-2.5 px-4 py-2 overflow-x-auto bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200/80 dark:border-slate-800">
      {attachments.map(att => (
        <div
          key={att.id}
          className="relative flex-shrink-0 group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
        >
          {att.type === 'image' ? (
            <div className="w-16 h-16">
              <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 flex flex-col items-center justify-center p-1 text-center">
              <FileText className="w-6 h-6 text-blue-500 mb-1" />
              <span className="text-[9px] text-slate-500 truncate w-full">{att.name}</span>
            </div>
          )}

          <button
            onClick={() => onRemove(att.id)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
