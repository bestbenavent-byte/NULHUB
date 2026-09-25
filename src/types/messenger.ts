/**
 * @file messenger.ts
 * Foundational TypeScript interfaces and types for Aether Messenger.
 * Defines canonical, strongly typed schemas for User, Chat, Message, Attachment,
 * and Reaction, as well as application state, audio notes, and notifications.
 */

// ==========================================
// 1. Primitive Semantic Identifiers & Enums
// ==========================================

/**
 * Unique user identifier (e.g., 'user_current', 'user_sofia').
 */
export type UserId = string;

/**
 * Unique conversation identifier (e.g., 'chat_sofia', 'chat_group_release').
 */
export type ChatId = string;

/**
 * Unique message identifier (e.g., 'm_1727265890_x8f2').
 */
export type MessageId = string;

/**
 * Unique media attachment identifier (e.g., 'att_1727265890_91a').
 */
export type AttachmentId = string;

/**
 * Unique reaction identifier (e.g., 'react_1727265890_01').
 */
export type ReactionId = string;

/**
 * ISO 8601 formatted timestamp string (e.g., '2026-09-25T11:40:00.000Z').
 */
export type ISO8601Timestamp = string;

/**
 * Message delivery lifecycle receipt statuses:
 * - 'sent': Dispatched from client to server.
 * - 'delivered': Received by the recipient device.
 * - 'read': Read/viewed by the recipient.
 */
export type MessageStatus = 'sent' | 'delivered' | 'read';

/**
 * Supported message content categories.
 */
export type MessageType = 'text' | 'media' | 'voice' | 'sticker' | 'gif' | 'system';

/**
 * Available visual bubble styles.
 */
export type BubbleStyle = 'modern' | 'classic' | 'minimal' | 'glass' | 'rounded';

/**
 * Message vertical layout density.
 */
export type MessageDensity = 'comfortable' | 'compact';

/**
 * Types of attachments supported in messages.
 */
export type AttachmentType = 'image' | 'video' | 'file' | 'audio';

// ==========================================
// 2. Attachment Schema
// ==========================================

/**
 * Represents a rich media or document attachment associated with a message.
 */
export interface Attachment {
  /** Unique identifier for the attachment */
  id: AttachmentId;
  /** Category of attachment */
  type: AttachmentType;
  /** Direct URL or object URI to access the asset */
  url: string;
  /** Human-readable filename (e.g., 'design_system_tokens.png') */
  name: string;
  /** Formatted file size string (e.g., '2.4 MB') */
  size?: string;
  /** Duration string for audio/video media (e.g., '0:18') */
  duration?: string;
  /** Optional low-res thumbnail preview URL */
  thumbnailUrl?: string;
  /** Media MIME type (e.g., 'image/png', 'application/pdf') */
  mimeType?: string;
  /** Width in pixels for images/videos */
  width?: number;
  /** Height in pixels for images/videos */
  height?: number;
}

// ==========================================
// 3. Reaction Schema
// ==========================================

/**
 * Represents an individual emoji reaction applied to a message by a participant.
 */
export interface Reaction {
  /** Optional unique reaction record identifier */
  id?: ReactionId;
  /** The reaction emoji character (e.g., '🔥', '❤️', '👍', '😂', '😮', '😢') */
  emoji: string;
  /** User ID of the participant who reacted */
  userId: UserId;
  /** Message ID to which this reaction belongs */
  messageId?: MessageId;
  /** Timestamp when the reaction was applied in ISO 8601 format */
  timestamp?: ISO8601Timestamp;
}

/**
 * Aggregated summary representation of an emoji reaction group on a message.
 */
export interface ReactionGroup {
  /** The reaction emoji character (e.g., '🔥', '❤️', '👍') */
  emoji: string;
  /** Total count of users who reacted with this emoji */
  count: number;
  /** Array of user IDs who applied this reaction */
  userIds: UserId[];
}

/**
 * Lightweight reference to an earlier message being replied to (quote).
 */
export interface MessageReplySummary {
  /** Target message ID being quoted */
  id: MessageId;
  /** Sender user ID of the target message */
  senderId: UserId;
  /** Display name of the original author */
  senderName: string;
  /** Snippet text of the original message */
  text: string;
  /** Optional attachment category if original was media-only */
  mediaType?: AttachmentType;
}

// ==========================================
// 4. Message Schema
// ==========================================

/**
 * Primary Message interface representing any chat transmission.
 */
export interface Message {
  /** Unique message identifier */
  id: MessageId;
  /** Identifier of the chat channel this message belongs to */
  chatId: ChatId;
  /** User ID of the message author */
  senderId: UserId;
  /** Plaintext or formatted text content */
  text: string;
  /** Timestamp in ISO 8601 format */
  timestamp: ISO8601Timestamp;
  /** Current delivery receipt status ('sent' | 'delivered' | 'read') */
  status: MessageStatus;
  /** Attached files, images, or audio clips */
  media?: Attachment[];
  /** Parent message reference for threaded reply quotes */
  replyTo?: MessageReplySummary;
  /** Emoji reaction map: emoji string -> array of UserIds */
  reactions: Record<string, UserId[]>;
  /** Indicates whether the message text has been edited */
  edited?: boolean;
  /** Timestamp of the last edit in ISO 8601 format */
  editedAt?: ISO8601Timestamp;
  /** Indicates whether the message is pinned to the chat header */
  isPinned?: boolean;
  /** Content classification of the message */
  type?: MessageType;
  /** Sticker asset URL if message type is 'sticker' */
  stickerUrl?: string;
  /** GIF animated image URL if message type is 'gif' */
  gifUrl?: string;
  /** Playback duration string if message type is 'voice' (e.g., '0:15') */
  audioDuration?: string;
  /** Visual amplitude samples for voice wave rendering (0-100) */
  waveform?: number[];
  /** Flexible metadata bag for extensible features */
  metadata?: Record<string, unknown>;
}

// ==========================================
// 5. User & Presence Schemas
// ==========================================

/**
 * Ephemeral 15-second audio vibe posted to user profile/stories.
 */
export interface VoiceStatus {
  /** Unique identifier for the voice status */
  id: string;
  /** User ID of the author */
  userId: UserId;
  /** URL to the recorded audio file */
  audioUrl?: string;
  /** Amplitude curve array for audio waveform visualization */
  waveform: number[];
  /** Duration in seconds (up to 15s) */
  duration: number;
  /** Optional caption or mood text */
  caption: string;
  /** Publication timestamp in ISO 8601 format */
  createdAt: ISO8601Timestamp;
  /** Expiration timestamp in ISO 8601 format (24 hours after creation) */
  expiresAt: ISO8601Timestamp;
  /** Total count of unique listens */
  listensCount: number;
}

/**
 * Primary User interface representing an authenticated account or contact.
 */
export interface User {
  /** Unique user identifier */
  id: UserId;
  /** Unique public handle without leading @ (e.g., 'andriy_tk') */
  username: string;
  /** Formatted full name displayed in chat list and headers */
  displayName: string;
  /** URL to the profile picture */
  avatar: string;
  /** Biographical summary or status quote */
  bio?: string;
  /** Account email address */
  email?: string;
  /** Account contact phone number */
  phone?: string;
  /** Real-time online availability flag */
  isOnline: boolean;
  /** Last active timestamp in ISO 8601 format when offline */
  lastSeen?: ISO8601Timestamp;
  /** Consecutive active chat streak in days */
  streak: number;
  /** Active ephemeral voice status, if currently published */
  voiceStatus?: VoiceStatus;
  /** Optional custom status text or emoji */
  customStatus?: string;
  /** Account registration timestamp in ISO 8601 format */
  createdAt?: ISO8601Timestamp;
}

/**
 * Concise summary of a user for embedded references.
 */
export type UserSummary = Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'isOnline'>;

// ==========================================
// 6. Chat & Channel Schemas
// ==========================================

/**
 * Type of conversation channel: direct (1:1) or group.
 */
export type ChatType = 'direct' | 'group';

/**
 * Active navigation filter for chat list.
 */
export type ChatFilter = 'all' | 'unread' | 'favorites' | 'groups' | 'archived';

/**
 * Primary Chat interface representing direct 1:1 or multi-party conversation channels.
 */
export interface Chat {
  /** Unique chat identifier */
  id: ChatId;
  /** Whether the chat is a direct 1:1 message or a multi-user group */
  type: ChatType;
  /** Title of the group, or fallback title for direct chat */
  name: string;
  /** Optional group avatar image URL */
  avatar?: string;
  /** Array of participant user IDs */
  participants: UserId[];
  /** Most recent message in this conversation */
  lastMessage?: Message;
  /** Number of unread messages for the current user */
  unreadCount: number;
  /** Whether the chat is pinned to the top of the chat list */
  pinned: boolean;
  /** Notification mute expiration ('forever', ISO timestamp string, or null) */
  mutedUntil: ISO8601Timestamp | 'forever' | null;
  /** Friendship chat streak count in days */
  streak: number;
  /** Unsent draft message text saved in composer */
  draft?: string;
  /** Whether the chat has been moved to the archive */
  isArchived?: boolean;
  /** Whether the chat is marked as a favorite */
  isFavorite?: boolean;
  /** Conversation creation timestamp in ISO 8601 format */
  createdAt: ISO8601Timestamp;
  /** Optional group topic or description */
  description?: string;
  /** User IDs of group administrators (for group chats) */
  adminIds?: UserId[];
}

// ==========================================
// 7. Notifications & Gamification Schemas
// ==========================================

export type NotificationType = 'message' | 'reaction' | 'streak' | 'mention' | 'system' | 'call';

/**
 * Real-time notification entity delivered to the activity center.
 */
export interface AppNotification {
  /** Unique notification identifier */
  id: string;
  /** Category of notification */
  type: NotificationType;
  /** Headline text */
  title: string;
  /** Detailed notification body */
  body: string;
  /** Creation timestamp in ISO 8601 format */
  timestamp: ISO8601Timestamp;
  /** Whether user has acknowledged/read the notification */
  isRead: boolean;
  /** Optional chat ID to navigate to upon click */
  linkChatId?: ChatId;
  /** Optional avatar or icon URL to display */
  avatar?: string;
}

/**
 * Milestone medal awarded in the Streak gamification system.
 */
export interface StreakMedal {
  /** Unique medal identifier */
  id: string;
  /** Name of the medal */
  name: string;
  /** Minimum streak days required to unlock */
  daysRequired: number;
  /** Icon or emoji representing the medal */
  icon: string;
  /** Associated brand accent color hex */
  color: string;
  /** Description of the achievement */
  description: string;
}

// ==========================================
// 8. Settings & Customization Schemas
// ==========================================

/**
 * Customizable background wallpaper theme for the conversation view.
 */
export interface Wallpaper {
  /** Unique wallpaper identifier */
  id: string;
  /** Human-readable wallpaper name */
  name: string;
  /** Wallpaper rendering category */
  type: 'default' | 'solid' | 'gradient' | 'pattern' | 'image';
  /** CSS background value or image URL */
  value: string;
  /** Preview thumbnail */
  previewUrl?: string;
  /** Optimized text contrast mode */
  textColor?: 'light' | 'dark';
}

/**
 * Persisted application configuration and user preferences.
 */
export interface AppSettings {
  /** Color theme scheme */
  theme: 'light' | 'dark' | 'system';
  /** Primary accent color hex or token */
  accentColor: string;
  /** Selected interface localization */
  language: 'uk' | 'en';
  /** Visual curvature and aesthetic of message containers */
  bubbleStyle: BubbleStyle;
  /** Selected wallpaper ID for the active chat area */
  wallpaperId: string;
  /** Optional custom uploaded wallpaper URL */
  customWallpaperUrl?: string;
  /** Density scale for message vertical spacing */
  messageDensity: MessageDensity;
  /** Whether Enter sends message (Shift+Enter for newline) */
  enterToSend: boolean;
  /** Global audio effects switch */
  soundEnabled: boolean;
  /** Master sound volume (0.0 to 1.0) */
  soundVolume: number;
  /** Audio alert for incoming notifications */
  notificationSound: boolean;
  /** Last-seen visibility audience */
  privacyLastSeen: 'everyone' | 'contacts' | 'nobody';
  /** Read receipts delivery checkmark toggle */
  privacyReadReceipts: boolean;
}

// ==========================================
// 9. Action & Mutation Payloads
// ==========================================

/**
 * Parameters for dispatching a new message.
 */
export interface SendMessageOptions {
  replyTo?: MessageReplySummary;
  media?: Attachment[];
  type?: MessageType;
  stickerUrl?: string;
  gifUrl?: string;
  audioDuration?: string;
  waveform?: number[];
  metadata?: Record<string, unknown>;
}

/**
 * Parameters for creating a new group conversation.
 */
export interface CreateGroupChatOptions {
  name: string;
  participantIds: UserId[];
  description?: string;
  avatar?: string;
}
