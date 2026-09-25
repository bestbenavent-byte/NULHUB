import { Message, MessageStatus } from '../types/messenger';

export type RealtimeEventType =
  | 'message:new'
  | 'message:update'
  | 'message:delete'
  | 'message:status'
  | 'typing:start'
  | 'typing:stop'
  | 'reaction:update'
  | 'user:online'
  | 'user:offline'
  | 'voice:new';

export type RealtimeEventHandler<T = unknown> = (data: T) => void;

class RealtimeService {
  private listeners: Map<RealtimeEventType, Set<RealtimeEventHandler<any>>> = new Map();

  public subscribe<T>(event: RealtimeEventType, handler: RealtimeEventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    handlers.add(handler);

    // Return cleanup unsubscribe function
    return () => {
      handlers.delete(handler);
    };
  }

  public emit<T>(event: RealtimeEventType, data: T): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(fn => {
        try {
          fn(data);
        } catch (e) {
          console.error(`Error in realtime handler for ${event}:`, e);
        }
      });
    }
  }

  /**
   * Simulates realistic status update progression from backend/recipient:
   * sent -> delivered (after 500ms) -> read (after 1500ms if recipient is active)
   */
  public simulateDeliveryCycle(
    message: Message,
    onStatusChange: (messageId: string, status: MessageStatus) => void,
    onSimulateReply?: () => void
  ) {
    // 1. Delivered after brief network trip
    setTimeout(() => {
      onStatusChange(message.id, 'delivered');
      this.emit('message:status', { messageId: message.id, status: 'delivered' });

      // 2. Read receipt after reading delay
      setTimeout(() => {
        onStatusChange(message.id, 'read');
        this.emit('message:status', { messageId: message.id, status: 'read' });

        // 3. Trigger typing simulation if reply callback provided
        if (onSimulateReply) {
          setTimeout(onSimulateReply, 800);
        }
      }, 1200);
    }, 600);
  }
}

export const realtimeService = new RealtimeService();
