/**
 * @file storage.ts
 * Strongly-typed LocalStorage abstraction layer for Aether Messenger.
 * Provides generic read/write methods, in-memory fallbacks, and typed schemas
 * for application state, user preferences, themes, and conversation history.
 */

import {
  User,
  Chat,
  Message,
  AppSettings,
  AppNotification,
  VoiceStatus,
  UserId,
  ChatId
} from '../types/messenger';
import {
  INITIAL_SETTINGS,
  MOCK_USERS,
  MOCK_CHATS,
  MOCK_MESSAGES,
  MOCK_NOTIFICATIONS
} from '../data/mockData';

/**
 * Canonical storage key definitions.
 */
export const STORAGE_KEYS = {
  SETTINGS: 'aether_settings_v2',
  THEME: 'aether_theme_v2',
  CURRENT_USER_ID: 'aether_curr_user_id_v2',
  USERS: 'aether_users_v2',
  CHATS: 'aether_chats_v2',
  MESSAGES: 'aether_messages_v2',
  NOTIFICATIONS: 'aether_notifications_v2',
  VOICE_STATUSES: 'aether_voice_statuses_v2',
  DRAFTS: 'aether_drafts_v2'
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS] | (string & {});

/**
 * Schema registry associating storage keys with their corresponding payload types.
 */
export interface StorageSchema {
  [STORAGE_KEYS.SETTINGS]: AppSettings;
  [STORAGE_KEYS.THEME]: AppSettings['theme'];
  [STORAGE_KEYS.CURRENT_USER_ID]: UserId;
  [STORAGE_KEYS.USERS]: User[];
  [STORAGE_KEYS.CHATS]: Chat[];
  [STORAGE_KEYS.MESSAGES]: Record<ChatId, Message[]>;
  [STORAGE_KEYS.NOTIFICATIONS]: AppNotification[];
  [STORAGE_KEYS.VOICE_STATUSES]: VoiceStatus[];
  [STORAGE_KEYS.DRAFTS]: Record<ChatId, string>;
}

/**
 * Type-safe storage manager with memory-cache fallback and serialization handling.
 */
export class StorageService {
  private isAvailable: boolean;
  private memoryFallback: Map<string, string> = new Map();

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Validates whether localStorage is available and writable in the current environment.
   */
  private checkAvailability(): boolean {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }
    try {
      const probeKey = '__storage_probe__';
      window.localStorage.setItem(probeKey, probeKey);
      window.localStorage.removeItem(probeKey);
      return true;
    } catch {
      return false;
    }
  }

  // ==========================================
  // Generic Storage Methods
  // ==========================================

  /**
   * Retrieves an item from storage with fallback to a default value if missing or corrupt.
   *
   * @param key - The storage key to look up
   * @param defaultValue - Fallback value if no entry exists
   * @returns Deserialized payload of type T
   */
  public get<T>(key: StorageKey, defaultValue: T): T {
    try {
      let raw: string | null = null;

      if (this.isAvailable) {
        raw = window.localStorage.getItem(key);
      } else {
        raw = this.memoryFallback.get(key) ?? null;
      }

      if (raw === null || raw === undefined) {
        return defaultValue;
      }

      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read or parse key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Serializes and writes a strongly-typed value to storage.
   *
   * @param key - The target storage key
   * @param value - Payload to serialize and persist
   */
  public set<T>(key: StorageKey, value: T): void {
    try {
      const serialized = JSON.stringify(value);

      if (this.isAvailable) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryFallback.set(key, serialized);
      }
    } catch (error) {
      console.warn(`[StorageService] Failed to persist key "${key}":`, error);
    }
  }

  /**
   * Removes a specific item from storage.
   *
   * @param key - The key to delete
   */
  public remove(key: StorageKey): void {
    try {
      if (this.isAvailable) {
        window.localStorage.removeItem(key);
      } else {
        this.memoryFallback.delete(key);
      }
    } catch (error) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, error);
    }
  }

  /**
   * Checks whether a specific key exists in storage.
   *
   * @param key - The key to query
   */
  public has(key: StorageKey): boolean {
    if (this.isAvailable) {
      return window.localStorage.getItem(key) !== null;
    }
    return this.memoryFallback.has(key);
  }

  /**
   * Clears all storage keys managed by the application.
   */
  public clear(): void {
    try {
      if (this.isAvailable) {
        Object.values(STORAGE_KEYS).forEach(k => {
          window.localStorage.removeItem(k);
        });
      }
      this.memoryFallback.clear();
    } catch (error) {
      console.warn('[StorageService] Error during storage clear:', error);
    }
  }

  // ==========================================
  // Domain-Specific Typed Helpers
  // ==========================================

  // --- 1. User Preferences & Settings ---

  /**
   * Retrieves user preferences and configuration.
   */
  public getSettings(): AppSettings {
    return this.get<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  /**
   * Saves user preferences and configuration.
   */
  public saveSettings(settings: AppSettings): void {
    this.set<AppSettings>(STORAGE_KEYS.SETTINGS, settings);
  }

  /**
   * Retrieves active theme ('light' | 'dark' | 'system').
   */
  public getTheme(): AppSettings['theme'] {
    return this.get<AppSettings['theme']>(STORAGE_KEYS.THEME, this.getSettings().theme);
  }

  /**
   * Sets and synchronizes application theme.
   */
  public setTheme(theme: AppSettings['theme']): void {
    this.set<AppSettings['theme']>(STORAGE_KEYS.THEME, theme);
    const settings = this.getSettings();
    this.saveSettings({ ...settings, theme });
  }

  // --- 2. Identity & Accounts ---

  public getCurrentUserId(): UserId {
    return this.get<UserId>(STORAGE_KEYS.CURRENT_USER_ID, 'user_current');
  }

  public setCurrentUserId(id: UserId): void {
    this.set<UserId>(STORAGE_KEYS.CURRENT_USER_ID, id);
  }

  public getUsers(): User[] {
    const users = this.get<User[]>(STORAGE_KEYS.USERS, []);
    if (!users || users.length === 0) {
      this.set<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
      return MOCK_USERS;
    }
    return users;
  }

  public saveUsers(users: User[]): void {
    this.set<User[]>(STORAGE_KEYS.USERS, users);
  }

  // --- 3. Conversations (Chats) ---

  public getChats(): Chat[] {
    const chats = this.get<Chat[]>(STORAGE_KEYS.CHATS, []);
    if (!chats || chats.length === 0) {
      this.set<Chat[]>(STORAGE_KEYS.CHATS, MOCK_CHATS);
      return MOCK_CHATS;
    }
    return chats;
  }

  public saveChats(chats: Chat[]): void {
    this.set<Chat[]>(STORAGE_KEYS.CHATS, chats);
  }

  // --- 4. Chat History (Messages) ---

  /**
   * Retrieves full conversation message mapping indexed by chatId.
   */
  public getMessagesMap(): Record<ChatId, Message[]> {
    const messages = this.get<Record<ChatId, Message[]>>(STORAGE_KEYS.MESSAGES, {});
    if (!messages || Object.keys(messages).length === 0) {
      this.set<Record<ChatId, Message[]>>(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
      return MOCK_MESSAGES;
    }
    return messages;
  }

  /**
   * Persists message mapping across all conversations.
   */
  public saveMessagesMap(messages: Record<ChatId, Message[]>): void {
    this.set<Record<ChatId, Message[]>>(STORAGE_KEYS.MESSAGES, messages);
  }

  /**
   * Retrieves chat message history for a specific conversation.
   */
  public getChatMessages(chatId: ChatId): Message[] {
    const map = this.getMessagesMap();
    return map[chatId] || [];
  }

  /**
   * Persists chat message history for a specific conversation.
   */
  public saveChatMessages(chatId: ChatId, messages: Message[]): void {
    const map = this.getMessagesMap();
    map[chatId] = messages;
    this.saveMessagesMap(map);
  }

  // --- 5. Notifications ---

  public getNotifications(): AppNotification[] {
    const notifs = this.get<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (!notifs || notifs.length === 0) {
      this.set<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
      return MOCK_NOTIFICATIONS;
    }
    return notifs;
  }

  public saveNotifications(notifications: AppNotification[]): void {
    this.set<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // --- 6. Voice Statuses ---

  public getVoiceStatuses(): VoiceStatus[] {
    const initialStatuses = MOCK_USERS.filter(u => u.voiceStatus).map(u => u.voiceStatus!);
    return this.get<VoiceStatus[]>(STORAGE_KEYS.VOICE_STATUSES, initialStatuses);
  }

  public saveVoiceStatuses(statuses: VoiceStatus[]): void {
    this.set<VoiceStatus[]>(STORAGE_KEYS.VOICE_STATUSES, statuses);
  }

  // --- 7. Drafts ---

  public getDrafts(): Record<ChatId, string> {
    return this.get<Record<ChatId, string>>(STORAGE_KEYS.DRAFTS, {});
  }

  public saveDraft(chatId: ChatId, text: string): void {
    const drafts = this.getDrafts();
    if (text.trim()) {
      drafts[chatId] = text;
    } else {
      delete drafts[chatId];
    }
    this.set<Record<ChatId, string>>(STORAGE_KEYS.DRAFTS, drafts);
  }

  // --- 8. Reset & Demo Seeding ---

  /**
   * Resets all managed keys to their pristine default mock data.
   */
  public resetToDefault(): void {
    this.clear();
    this.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    this.set(STORAGE_KEYS.CURRENT_USER_ID, 'user_current');
    this.set(STORAGE_KEYS.USERS, MOCK_USERS);
    this.set(STORAGE_KEYS.CHATS, MOCK_CHATS);
    this.set(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
    this.set(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    this.set(STORAGE_KEYS.VOICE_STATUSES, MOCK_USERS.filter(u => u.voiceStatus).map(u => u.voiceStatus!));
  }
}

/**
 * Singleton storage instance exported for application-wide consumption.
 */
export const storage = new StorageService();

/**
 * Backward-compatible alias for existing service imports.
 */
export const appStorage = storage;

// ==========================================
// Generic Standalone Storage Helpers
// ==========================================

/**
 * Generic helper to retrieve a typed item from storage.
 */
export function getItem<T>(key: StorageKey, defaultValue: T): T {
  return storage.get<T>(key, defaultValue);
}

/**
 * Generic helper to serialize and store a typed item in storage.
 */
export function setItem<T>(key: StorageKey, value: T): void {
  storage.set<T>(key, value);
}

/**
 * Helper to remove an item from storage.
 */
export function removeItem(key: StorageKey): void {
  storage.remove(key);
}

/**
 * Helper to check whether an item exists in storage.
 */
export function hasItem(key: StorageKey): boolean {
  return storage.has(key);
}
