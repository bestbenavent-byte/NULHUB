import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Attachment } from '../../types/messenger';
import { getTranslation, Language } from '../../utils/i18n';

interface FullscreenImageViewerProps {
  isOpen: boolean;
  activeAttachment: Attachment | null;
  allAttachments: Attachment[];
  language: Language;
  onClose: () => void;
  onSelectAttachment: (att: Attachment) => void;
}

export const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  isOpen,
  activeAttachment,
  allAttachments,
  language,
  onClose,
  onSelectAttachment
}) => {
  const t = (key: any) => getTranslation(language, key);

  const imageAttachments = allAttachments.filter(a => a.type === 'image');
  const currentIndex = activeAttachment
    ? imageAttachments.findIndex(a => a.id === activeAttachment.id)
    : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, imageAttachments]);

  if (!isOpen || !activeAttachment) return null;

  const handlePrev = () => {
    if (imageAttachments.length <= 1) return;
    const prevIdx = (currentIndex - 1 + imageAttachments.length) % imageAttachments.length;
    onSelectAttachment(imageAttachments[prevIdx]);
  };

  const handleNext = () => {
    if (imageAttachments.length <= 1) return;
    const nextIdx = (currentIndex + 1) % imageAttachments.length;
    onSelectAttachment(imageAttachments[nextIdx]);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = activeAttachment.url;
    a.download = activeAttachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {/* Top Header Controls */}
      <div className="absolute top-0 inset-x-0 h-16 px-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white text-xs font-semibold">
          {imageAttachments.length > 0
            ? `${currentIndex + 1} ${t('imageOf')} ${imageAttachments.length}`
            : activeAttachment.name}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            title={t('download')}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            title={t('close')}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      {imageAttachments.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="max-w-[90vw] max-h-[85vh] p-4 flex items-center justify-center">
        <img
          src={activeAttachment.url}
          alt={activeAttachment.name}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
        />
      </div>
    </div>
  );
};
