import { Message, MessageStatus, Attachment, MessageReplySummary } from '../types/messenger';
import { appStorage } from '../utils/storage';
import { realtimeService } from './realtimeService';

class MessageService {
  public getMessages(chatId: string): Message[] {
    const map = appStorage.getMessagesMap();
    return map[chatId] || [];
  }

  public sendMessage(
    chatId: string,
    senderId: string,
    text: string,
    options?: {
      replyTo?: MessageReplySummary;
      media?: Attachment[];
      type?: 'text' | 'media' | 'voice' | 'sticker' | 'gif' | 'system';
      stickerUrl?: string;
      gifUrl?: string;
      audioDuration?: string;
      waveform?: number[];
    }
  ): Message {
    const map = appStorage.getMessagesMap();
    const chatMessages = map[chatId] ? [...map[chatId]] : [];

    const newMessage: Message = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      chatId,
      senderId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
      replyTo: options?.replyTo,
      media: options?.media,
      type: options?.type || (options?.media ? 'media' : 'text'),
      stickerUrl: options?.stickerUrl,
      gifUrl: options?.gifUrl,
      audioDuration: options?.audioDuration,
      waveform: options?.waveform
    };

    chatMessages.push(newMessage);
    map[chatId] = chatMessages;
    appStorage.saveMessagesMap(map);

    // Update chat last message
    const chats = appStorage.getChats().map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          lastMessage: newMessage
        };
      }
      return c;
    });
    appStorage.saveChats(chats);

    // Emit realtime event
    realtimeService.emit('message:new', newMessage);

    return newMessage;
  }

  public updateMessageStatus(chatId: string, messageId: string, status: MessageStatus): void {
    const map = appStorage.getMessagesMap();
    if (!map[chatId]) return;

    map[chatId] = map[chatId].map(m => {
      if (m.id === messageId) {
        return { ...m, status };
      }
      return m;
    });
    appStorage.saveMessagesMap(map);
  }

  public editMessage(chatId: string, messageId: string, newText: string): Message | null {
    const map = appStorage.getMessagesMap();
    if (!map[chatId]) return null;

    let updatedMessage: Message | null = null;
    map[chatId] = map[chatId].map(m => {
      if (m.id === messageId) {
        updatedMessage = { ...m, text: newText.trim(), edited: true };
        return updatedMessage;
      }
      return m;
    });

    if (updatedMessage) {
      appStorage.saveMessagesMap(map);
      realtimeService.emit('message:update', updatedMessage);
    }
    return updatedMessage;
  }

  public deleteMessage(chatId: string, messageId: string): void {
    const map = appStorage.getMessagesMap();
    if (!map[chatId]) return;

    map[chatId] = map[chatId].filter(m => m.id !== messageId);
    appStorage.saveMessagesMap(map);
    realtimeService.emit('message:delete', { chatId, messageId });
  }

  public toggleReaction(chatId: string, messageId: string, userId: string, emoji: string): Message | null {
    const map = appStorage.getMessagesMap();
    if (!map[chatId]) return null;

    let updatedMessage: Message | null = null;
    map[chatId] = map[chatId].map(m => {
      if (m.id === messageId) {
        const reactions = { ...(m.reactions || {}) };
        const currentUsers = reactions[emoji] ? [...reactions[emoji]] : [];
        const hasReacted = currentUsers.includes(userId);

        if (hasReacted) {
          // Remove reaction
          const filtered = currentUsers.filter(id => id !== userId);
          if (filtered.length === 0) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = filtered;
          }
        } else {
          // Add reaction
          reactions[emoji] = [...currentUsers, userId];
        }

        updatedMessage = { ...m, reactions };
        return updatedMessage;
      }
      return m;
    });

    if (updatedMessage) {
      appStorage.saveMessagesMap(map);
      realtimeService.emit('reaction:update', { chatId, messageId, emoji, userId });
    }
    return updatedMessage;
  }

  public togglePinMessage(chatId: string, messageId: string): Message | null {
    const map = appStorage.getMessagesMap();
    if (!map[chatId]) return null;

    let pinnedMessage: Message | null = null;
    map[chatId] = map[chatId].map(m => {
      if (m.id === messageId) {
        const isPinned = !m.isPinned;
        pinnedMessage = { ...m, isPinned };
        return pinnedMessage;
      }
      return m;
    });

    if (pinnedMessage) {
      appStorage.saveMessagesMap(map);
      realtimeService.emit('message:update', pinnedMessage);
    }
    return pinnedMessage;
  }

  public forwardMessage(sourceMessage: Message, targetChatId: string, currentUserId: string): Message {
    return this.sendMessage(targetChatId, currentUserId, sourceMessage.text, {
      media: sourceMessage.media,
      type: sourceMessage.type,
      stickerUrl: sourceMessage.stickerUrl,
      gifUrl: sourceMessage.gifUrl,
      audioDuration: sourceMessage.audioDuration,
      waveform: sourceMessage.waveform
    });
  }
}

export const messageService = new MessageService();
