import { Chat, ChatType, Message } from '../types/messenger';
import { appStorage } from '../utils/storage';

class ChatService {
  public getChats(): Chat[] {
    const chats = appStorage.getChats();
    const messagesMap = appStorage.getMessagesMap();

    // Populate dynamic last message if available
    return chats.map(chat => {
      const chatMessages = messagesMap[chat.id];
      const lastMsg = chatMessages && chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : chat.lastMessage;
      return {
        ...chat,
        lastMessage: lastMsg
      };
    });
  }

  public getChatById(chatId: string): Chat | undefined {
    return this.getChats().find(c => c.id === chatId);
  }

  public createDirectChat(currentUserId: string, targetUserId: string, targetName: string, targetAvatar?: string): Chat {
    const existing = this.getChats().find(
      c => c.type === 'direct' && c.participants.includes(targetUserId) && c.participants.includes(currentUserId)
    );
    if (existing) {
      if (existing.isArchived) {
        this.toggleArchive(existing.id);
      }
      return existing;
    }

    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      type: 'direct',
      name: targetName,
      avatar: targetAvatar,
      participants: [currentUserId, targetUserId],
      unreadCount: 0,
      pinned: false,
      mutedUntil: null,
      streak: 1,
      createdAt: new Date().toISOString()
    };

    const chats = [newChat, ...appStorage.getChats()];
    appStorage.saveChats(chats);
    return newChat;
  }

  public createGroupChat(currentUserId: string, name: string, participantIds: string[], description?: string): Chat {
    const newChat: Chat = {
      id: `chat_grp_${Date.now()}`,
      type: 'group',
      name,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      participants: [currentUserId, ...participantIds],
      unreadCount: 0,
      pinned: false,
      mutedUntil: null,
      streak: 1,
      description,
      createdAt: new Date().toISOString()
    };

    const chats = [newChat, ...appStorage.getChats()];
    appStorage.saveChats(chats);
    return newChat;
  }

  public togglePin(chatId: string): Chat[] {
    const chats = appStorage.getChats().map(c => {
      if (c.id === chatId) {
        return { ...c, pinned: !c.pinned };
      }
      return c;
    });
    appStorage.saveChats(chats);
    return chats;
  }

  public toggleMute(chatId: string, duration?: string): Chat[] {
    const chats = appStorage.getChats().map(c => {
      if (c.id === chatId) {
        const isMuted = !!c.mutedUntil;
        return {
          ...c,
          mutedUntil: isMuted ? null : (duration || 'forever')
        };
      }
      return c;
    });
    appStorage.saveChats(chats);
    return chats;
  }

  public toggleArchive(chatId: string): Chat[] {
    const chats = appStorage.getChats().map(c => {
      if (c.id === chatId) {
        return { ...c, isArchived: !c.isArchived };
      }
      return c;
    });
    appStorage.saveChats(chats);
    return chats;
  }

  public toggleFavorite(chatId: string): Chat[] {
    const chats = appStorage.getChats().map(c => {
      if (c.id === chatId) {
        return { ...c, isFavorite: !c.isFavorite };
      }
      return c;
    });
    appStorage.saveChats(chats);
    return chats;
  }

  public markAsRead(chatId: string): Chat[] {
    const chats = appStorage.getChats().map(c => {
      if (c.id === chatId) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    appStorage.saveChats(chats);

    // Also mark all incoming messages in this chat as read
    const messagesMap = appStorage.getMessagesMap();
    if (messagesMap[chatId]) {
      messagesMap[chatId] = messagesMap[chatId].map(m => ({ ...m, status: 'read' as const }));
      appStorage.saveMessagesMap(messagesMap);
    }

    return chats;
  }

  public deleteChat(chatId: string): Chat[] {
    const chats = appStorage.getChats().filter(c => c.id !== chatId);
    appStorage.saveChats(chats);

    const messagesMap = appStorage.getMessagesMap();
    delete messagesMap[chatId];
    appStorage.saveMessagesMap(messagesMap);

    return chats;
  }
}

export const chatService = new ChatService();
