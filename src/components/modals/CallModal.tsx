import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { User } from '../../types/messenger';
import { Avatar } from '../ui/Avatar';
import { soundManager } from '../../utils/sound';

interface CallModalProps {
  isOpen: boolean;
  user: User | null;
  isVideo: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  user,
  isVideo,
  onClose
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideo);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setCallDuration(0);
      setIsConnected(false);
      soundManager.playNotification();

      // Simulate connection establishment after 2.5 seconds
      const connectTimeout = setTimeout(() => {
        setIsConnected(true);
        soundManager.playReaction();
      }, 2500);

      return () => clearTimeout(connectTimeout);
    }
  }, [isOpen]);

  // Duration timer
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);

  if (!isOpen || !user) return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEndCall = () => {
    soundManager.playTap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl p-8 flex flex-col items-center text-center">
        {/* Animated background ripples */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900/60 to-slate-950 pointer-events-none" />

        {/* User Info */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar src={user.avatar} name={user.displayName} size="2xl" />
            {!isConnected && (
              <span className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75" />
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {user.displayName}
          </h3>

          <p className="text-xs text-blue-400 font-medium tracking-wide">
            {isConnected ? formatTimer(callDuration) : 'Виклик... (З\'єднання)'}
          </p>
        </div>

        {/* Video preview mock if video enabled */}
        {isVideoOn && isConnected && (
          <div className="relative z-10 w-full h-36 mt-4 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
            <img src={user.avatar} alt="Video Feed" className="w-full h-full object-cover filter brightness-90" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white">
              HD 1080p
            </div>
          </div>
        )}

        {/* Call Action Controls */}
        <div className="relative z-10 flex items-center justify-center gap-4 mt-8">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
              !isVideoOn
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
              !isSpeakerOn
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-transform cursor-pointer"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
