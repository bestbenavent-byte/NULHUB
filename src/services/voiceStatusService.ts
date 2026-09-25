import { VoiceStatus } from '../types/messenger';
import { appStorage } from '../utils/storage';
import { realtimeService } from './realtimeService';

class VoiceStatusService {
  public getVoiceStatuses(): VoiceStatus[] {
    return appStorage.getVoiceStatuses();
  }

  public publishStatus(userId: string, caption: string, duration: number, waveform: number[]): VoiceStatus {
    const statuses = appStorage.getVoiceStatuses();
    const newStatus: VoiceStatus = {
      id: `vs_${Date.now()}`,
      userId,
      caption: caption.trim(),
      duration: Math.max(3, Math.min(60, duration)),
      waveform: waveform.length > 0 ? waveform : [25, 45, 70, 95, 60, 40, 80, 90, 65, 35, 20],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      listensCount: 1
    };

    // Filter out previous status of this user and prepend new
    const updated = [newStatus, ...statuses.filter(s => s.userId !== userId)];
    appStorage.saveVoiceStatuses(updated);

    // Also update in user profile
    const users = appStorage.getUsers().map(u => {
      if (u.id === userId) {
        return { ...u, voiceStatus: newStatus };
      }
      return u;
    });
    appStorage.saveUsers(users);

    realtimeService.emit('voice:new', newStatus);
    return newStatus;
  }

  public deleteStatus(statusId: string, userId: string): void {
    const statuses = appStorage.getVoiceStatuses().filter(s => s.id !== statusId);
    appStorage.saveVoiceStatuses(statuses);

    const users = appStorage.getUsers().map(u => {
      if (u.id === userId && u.voiceStatus?.id === statusId) {
        return { ...u, voiceStatus: undefined };
      }
      return u;
    });
    appStorage.saveUsers(users);
  }

  public incrementListenCount(statusId: string): void {
    const statuses = appStorage.getVoiceStatuses().map(s => {
      if (s.id === statusId) {
        return { ...s, listensCount: s.listensCount + 1 };
      }
      return s;
    });
    appStorage.saveVoiceStatuses(statuses);
  }
}

export const voiceStatusService = new VoiceStatusService();
