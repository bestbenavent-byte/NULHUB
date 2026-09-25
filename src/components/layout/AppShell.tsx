import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  Chat,
  Message,
  AppSettings,
  AppNotification,
  VoiceStatus,
  Attachment
} from '../../types/messenger';
import { authService } from '../../services/authService';
import { chatService } from '../../services/chatService';
import { messageService } from '../../services/messageService';
import { userService } from '../../services/userService';
import { voiceStatusService } from '../../services/voiceStatusService';
import { notificationService } from '../../services/notificationService';
import { realtimeService } from '../../services/realtimeService';
import { appStorage } from '../../utils/storage';
import { soundManager } from '../../utils/sound';
import { getTranslation } from '../../utils/i18n';

import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { ChatList } from '../chat/ChatList';
import { ChatView } from '../chat/ChatView';
import { UserProfileDrawer } from '../profile/UserProfileDrawer';
import { SettingsModal } from '../modals/SettingsModal';
import { SearchPeopleModal } from '../modals/SearchPeopleModal';
import { VoiceStatusModal } from '../modals/VoiceStatusModal';
import { StreakMedalsModal } from '../modals/StreakMedalsModal';
import { NewChatModal } from '../modals/NewChatModal';
import { ForwardMessageModal } from '../modals/ForwardMessageModal';
import { CallModal } from '../modals/CallModal';
import { NotificationsDrawer } from '../modals/NotificationsDrawer';
import { AuthModal } from '../modals/AuthModal';
import { FullscreenImageViewer } from '../media/FullscreenImageViewer';
import { useToast } from '../ui/Toast';
import { MessageSquareDashed } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { showToast } = useToast();

  // Primary State
  const [currentUser, setCurrentUser] = useState<User>(() => authService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => userService.getUsers());
  const [chats, setChats] = useState<Chat[]>(() => chatService.getChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const list = chatService.getChats();
    return list.length > 0 ? list[0].id : null;
  });
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() =>
    appStorage.getMessagesMap()
  );
  const [settings, setSettings] = useState<AppSettings>(() => appStorage.getSettings());
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationService.getNotifications()
  );
  const [voiceStatuses, setVoiceStatuses] = useState<VoiceStatus[]>(() =>
    voiceStatusService.getVoiceStatuses()
  );

  // Layout & Navigation State
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'archive'>('chats');
  const [mobileScreen, setMobileScreen] = useState<'list' | 'chat'>('list');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [typingMap, setTypingMap] = useState<Record<string, string>>({}); // chatId -> userName

  // Modals & Drawers State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchPeopleOpen, setIsSearchPeopleOpen] = useState(false);
  const [isVoiceStatusOpen, setIsVoiceStatusOpen] = useState(false);
  const [isStreaksOpen, setIsStreaksOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [forwardMessage, setForwardMessage] = useState<Message | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  // Call modal state
  const [callState, setCallState] = useState<{
    isOpen: boolean;
    user: User | null;
    isVideo: boolean;
  }>({
    isOpen: false,
    user: null,
    isVideo: false
  });

  // Fullscreen Image Lightbox
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    attachment: Attachment | null;
  }>({
    isOpen: false,
    attachment: null
  });

  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  // Sync Theme with HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    soundManager.setConfig(settings.soundEnabled, settings.soundVolume);
  }, [settings.theme, settings.soundEnabled, settings.soundVolume]);

  // Current active chat object & messages
  const activeChat = useMemo(() => {
    return chats.find(c => c.id === activeChatId) || null;
  }, [chats, activeChatId]);

  const activeMessages = useMemo(() => {
    return activeChatId ? messagesMap[activeChatId] || [] : [];
  }, [activeChatId, messagesMap]);

  // All attachments in active chat for the image viewer
  const activeAttachments = useMemo(() => {
    const list: Attachment[] = [];
    activeMessages.forEach(m => {
      if (m.media) list.push(...m.media);
    });
    return list;
  }, [activeMessages]);

  // Realtime subscription setup
  useEffect(() => {
    const unsubMsg = realtimeService.subscribe<Message>('message:new', newMsg => {
      setMessagesMap(prev => {
        const chatMsgs = prev[newMsg.chatId] ? [...prev[newMsg.chatId]] : [];
        if (!chatMsgs.some(m => m.id === newMsg.id)) {
          return { ...prev, [newMsg.chatId]: [...chatMsgs, newMsg] };
        }
        return prev;
      });
      setChats(chatService.getChats());
    });

    const unsubStatus = realtimeService.subscribe<{ messageId: string; status: any }>(
      'message:status',
      ({ messageId, status }) => {
        setMessagesMap(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(chatId => {
            next[chatId] = next[chatId].map(m => (m.id === messageId ? { ...m, status } : m));
          });
          return next;
        });
      }
    );

    const unsubReaction = realtimeService.subscribe<any>('reaction:update', () => {
      setMessagesMap(appStorage.getMessagesMap());
    });

    return () => {
      unsubMsg();
      unsubStatus();
      unsubReaction();
    };
  }, []);

  // Handlers
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMobileScreen('chat');
    chatService.markAsRead(chatId);
    setChats(chatService.getChats());
  };

  const handleSendMessage = (text: string, options?: any) => {
    if (!activeChatId) return;

    const newMsg = messageService.sendMessage(activeChatId, currentUser.id, text, options);
    soundManager.playMessageSent();

    // Update local state
    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));
    setChats(chatService.getChats());

    // Auto-respond simulation if chatting with Sofia or Oleksiy for interactive demo
    const partnerId = activeChat?.participants.find(p => p !== currentUser.id);
    const partner = users.find(u => u.id === partnerId);

    if (partner && activeChat?.type === 'direct') {
      realtimeService.simulateDeliveryCycle(
        newMsg,
        (msgId, status) => {
          messageService.updateMessageStatus(activeChatId, msgId, status);
        },
        () => {
          // Trigger typing indicator
          setTypingMap(prev => ({ ...prev, [activeChatId]: partner.displayName.split(' ')[0] }));

          setTimeout(() => {
            setTypingMap(prev => {
              const next = { ...prev };
              delete next[activeChatId];
              return next;
            });

            // Realistic reply generator
            const responses = [
              'Чудово! Зараз перевірю це та відпишу детальніше 👍',
              'Повністю погоджуюсь, виглядає дуже гармонійно та чисто ✨',
              'Дякую за повідомлення! До речі, переглянь новий голосовий статус 🎧',
              'Супер, беру в роботу! Завтра зранку покажемо команді 🚀'
            ];
            const replyText = responses[Math.floor(Math.random() * responses.length)];

            const incomingMsg = messageService.sendMessage(activeChatId, partner.id, replyText);
            soundManager.playMessageReceived();

            setMessagesMap(prev => ({
              ...prev,
              [activeChatId]: [...(prev[activeChatId] || []), incomingMsg]
            }));
            setChats(chatService.getChats());
          }, 2200);
        }
      );
    }
  };

  const handleReactMessage = (messageId: string, emoji: string) => {
    if (!activeChatId) return;
    messageService.toggleReaction(activeChatId, messageId, currentUser.id, emoji);
    soundManager.playReaction();
    setMessagesMap(appStorage.getMessagesMap());
    showToast(t('toastReactionAdded'), 'info');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    soundManager.playTap();
    showToast(t('copiedToClipboard'), 'info');
  };

  const handlePinMessage = (messageId: string) => {
    if (!activeChatId) return;
    const msg = messageService.togglePinMessage(activeChatId, messageId);
    setMessagesMap(appStorage.getMessagesMap());
    showToast(msg?.isPinned ? t('toastPinned') : t('toastUnpinned'), 'info');
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    messageService.deleteMessage(activeChatId, messageId);
    setMessagesMap(appStorage.getMessagesMap());
    showToast('Повідомлення видалено', 'info');
  };

  const handleEditMessage = (message: Message) => {
    const newText = prompt('Відредагуйте текст повідомлення:', message.text);
    if (newText !== null && newText.trim() && activeChatId) {
      messageService.editMessage(activeChatId, message.id, newText);
      setMessagesMap(appStorage.getMessagesMap());
      showToast('Повідомлення оновлено', 'success');
    }
  };

  const handleForwardMessage = (targetChatId: string) => {
    if (!forwardMessage) return;
    messageService.forwardMessage(forwardMessage, targetChatId, currentUser.id);
    soundManager.playMessageSent();
    setMessagesMap(appStorage.getMessagesMap());
    setChats(chatService.getChats());
    showToast(t('forwardSuccess'), 'success');
    setActiveChatId(targetChatId);
    setForwardMessage(null);
  };

  // Chat Actions
  const handlePinChat = (chatId: string) => {
    setChats(chatService.togglePin(chatId));
  };

  const handleMuteChat = (chatId: string) => {
    setChats(chatService.toggleMute(chatId));
    showToast('Статус сповіщень оновлено', 'info');
  };

  const handleArchiveChat = (chatId: string) => {
    setChats(chatService.toggleArchive(chatId));
    showToast('Чат переміщено', 'info');
  };

  const handleMarkRead = (chatId: string) => {
    setChats(chatService.markAsRead(chatId));
    setMessagesMap(appStorage.getMessagesMap());
  };

  const handleDeleteChat = (chatId: string) => {
    if (confirm('Видалити цей чат та історію листування?')) {
      const updated = chatService.deleteChat(chatId);
      setChats(updated);
      setMessagesMap(appStorage.getMessagesMap());
      if (activeChatId === chatId) {
        setActiveChatId(updated.length > 0 ? updated[0].id : null);
      }
      showToast('Чат видалено', 'info');
    }
  };

  // Create Chat
  const handleCreateDirectChat = (targetUserId: string) => {
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return;
    const newChat = chatService.createDirectChat(
      currentUser.id,
      targetUserId,
      targetUser.displayName,
      targetUser.avatar
    );
    setChats(chatService.getChats());
    setActiveChatId(newChat.id);
    setMobileScreen('chat');
  };

  const handleCreateGroupChat = (name: string, participantIds: string[], description?: string) => {
    const newChat = chatService.createGroupChat(currentUser.id, name, participantIds, description);
    setChats(chatService.getChats());
    setActiveChatId(newChat.id);
    setMobileScreen('chat');
    showToast('Групу створено!', 'success');
  };

  // Start Call
  const handleStartCall = (isVideo: boolean) => {
    const partnerId = activeChat?.participants.find(p => p !== currentUser.id);
    const partner = users.find(u => u.id === partnerId) || currentUser;
    setCallState({
      isOpen: true,
      user: partner,
      isVideo
    });
  };

  // Publish Voice Status
  const handlePublishVoiceStatus = (caption: string, duration: number, waveform: number[]) => {
    const newStatus = voiceStatusService.publishStatus(currentUser.id, caption, duration, waveform);
    setVoiceStatuses(voiceStatusService.getVoiceStatuses());
    setUsers(userService.getUsers());
    showToast(t('statusPublished'), 'success');
  };

  const handleToggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: next as any };
    setSettings(updated);
    appStorage.saveSettings(updated);
  };

  const handleLogout = async () => {
    await authService.logout();
    const def = authService.getCurrentUser();
    setCurrentUser(def);
    showToast('Ви вийшли з облікового запису', 'info');
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F2F2F7] dark:bg-[#000000] text-black dark:text-white font-sans">
      {/* 1. Left Icon Sidebar (Desktop/Tablet) */}
      <Sidebar
        currentUser={currentUser}
        settings={settings}
        unreadNotificationsCount={unreadNotifsCount}
        activeTab={sidebarTab}
        onSelectTab={tab => setSidebarTab(tab)}
        onOpenSearchPeople={() => setIsSearchPeopleOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenVoiceStatus={() => setIsVoiceStatusOpen(true)}
        onOpenStreaks={() => setIsStreaksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setSelectedProfileUser(currentUser)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Chat List + Active Chat Container */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Chat List Column */}
        <div
          className={`${
            mobileScreen === 'chat' ? 'hidden md:flex' : 'flex'
          } w-full md:w-auto h-full flex-col`}
        >
          <ChatList
            chats={chats}
            users={users}
            currentUserId={currentUser.id}
            activeChatId={activeChatId}
            settings={settings}
            typingMap={typingMap}
            voiceStatuses={voiceStatuses}
            onSelectChat={handleSelectChat}
            onNewChat={() => setIsNewChatOpen(true)}
            onPinChat={handlePinChat}
            onMuteChat={handleMuteChat}
            onArchiveChat={handleArchiveChat}
            onMarkRead={handleMarkRead}
            onDeleteChat={handleDeleteChat}
            onOpenVoiceStatusModal={() => setIsVoiceStatusOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          {/* Bottom Navigation on Mobile (Only visible when in ChatList screen) */}
          <MobileNavigation
            currentUser={currentUser}
            settings={settings}
            unreadNotificationsCount={unreadNotifsCount}
            activeTab={sidebarTab}
            onSelectTab={setSidebarTab}
            onOpenSearchPeople={() => setIsSearchPeopleOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenVoiceStatus={() => setIsVoiceStatusOpen(true)}
            onOpenStreaks={() => setIsStreaksOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenProfile={() => setSelectedProfileUser(currentUser)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        </div>

        {/* Active Chat Column */}
        <div
          className={`${
            mobileScreen === 'list' ? 'hidden md:flex' : 'flex'
          } flex-1 h-full flex-col`}
        >
          {activeChat ? (
            <ChatView
              chat={activeChat}
              messages={activeMessages}
              users={users}
              currentUserId={currentUser.id}
              settings={settings}
              isTyping={!!typingMap[activeChat.id]}
              typingUserName={typingMap[activeChat.id]}
              onBack={() => setMobileScreen('list')}
              onSendMessage={handleSendMessage}
              onReplyMessage={() => {}}
              onReactMessage={handleReactMessage}
              onCopyText={handleCopyText}
              onPinMessage={handlePinMessage}
              onForwardMessage={msg => setForwardMessage(msg)}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onOpenProfile={userId => {
                const u = users.find(usr => usr.id === userId);
                if (u) setSelectedProfileUser(u);
              }}
              onOpenAttachment={att =>
                setLightboxState({ isOpen: true, attachment: att })
              }
              onStartCall={handleStartCall}
              onTyping={() => {}}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50 dark:bg-[#0c0e14]">
              <MessageSquareDashed className="w-16 h-16 mb-4 text-slate-400/50 stroke-[1.5]" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">
                Виберіть чат для початку спілкування
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Виберіть контакт зі списку зліва або розпочніть новий чат з колегами та друзями.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Global Modals & Drawers */}

      {/* User Profile Drawer */}
      <UserProfileDrawer
        isOpen={!!selectedProfileUser}
        user={selectedProfileUser}
        messages={activeMessages}
        language={lang}
        onClose={() => setSelectedProfileUser(null)}
        onStartChat={handleCreateDirectChat}
        onOpenStreakModal={() => setIsStreaksOpen(true)}
        onOpenAttachment={att => setLightboxState({ isOpen: true, attachment: att })}
        onBlockUser={uid => {
          showToast('Користувача заблоковано', 'info');
          setSelectedProfileUser(null);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentUser={currentUser}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={newSettings => {
          setSettings(newSettings);
          appStorage.saveSettings(newSettings);
          showToast(t('toastSettingsSaved'), 'success');
        }}
        onUpdateProfile={updates => {
          const updated = authService.updateProfile(updates);
          setCurrentUser(updated);
          setUsers(userService.getUsers());
          showToast(t('toastProfileUpdated'), 'success');
        }}
      />

      {/* Search People Modal */}
      <SearchPeopleModal
        isOpen={isSearchPeopleOpen}
        users={users}
        currentUserId={currentUser.id}
        language={lang}
        onClose={() => setIsSearchPeopleOpen(false)}
        onSelectUser={u => {
          handleCreateDirectChat(u.id);
          setIsSearchPeopleOpen(false);
        }}
        onViewProfile={u => {
          setSelectedProfileUser(u);
          setIsSearchPeopleOpen(false);
        }}
      />

      {/* Voice Status Modal */}
      <VoiceStatusModal
        isOpen={isVoiceStatusOpen}
        voiceStatuses={voiceStatuses}
        users={users}
        currentUserId={currentUser.id}
        language={lang}
        onClose={() => setIsVoiceStatusOpen(false)}
        onPublishStatus={handlePublishVoiceStatus}
        onDeleteStatus={statusId => {
          voiceStatusService.deleteStatus(statusId, currentUser.id);
          setVoiceStatuses(voiceStatusService.getVoiceStatuses());
        }}
        onListenStatus={statusId => {
          voiceStatusService.incrementListenCount(statusId);
          setVoiceStatuses(voiceStatusService.getVoiceStatuses());
        }}
      />

      {/* Streak Medals Modal */}
      <StreakMedalsModal
        isOpen={isStreaksOpen}
        streakDays={currentUser.streak}
        language={lang}
        onClose={() => setIsStreaksOpen(false)}
      />

      {/* New Chat / Group Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        users={users}
        currentUserId={currentUser.id}
        language={lang}
        onClose={() => setIsNewChatOpen(false)}
        onCreateDirect={handleCreateDirectChat}
        onCreateGroup={handleCreateGroupChat}
      />

      {/* Forward Message Modal */}
      <ForwardMessageModal
        isOpen={!!forwardMessage}
        message={forwardMessage}
        chats={chats}
        users={users}
        currentUserId={currentUser.id}
        language={lang}
        onClose={() => setForwardMessage(null)}
        onForward={handleForwardMessage}
      />

      {/* Call Modal */}
      <CallModal
        isOpen={callState.isOpen}
        user={callState.user}
        isVideo={callState.isVideo}
        onClose={() => setCallState({ isOpen: false, user: null, isVideo: false })}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        notifications={notifications}
        language={lang}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkRead={id => {
          notificationService.markAsRead(id);
          setNotifications(notificationService.getNotifications());
        }}
        onMarkAllRead={() => {
          notificationService.markAllAsRead();
          setNotifications(notificationService.getNotifications());
          showToast('Всі сповіщення прочитано', 'info');
        }}
        onClearAll={() => {
          notificationService.clearAll();
          setNotifications([]);
        }}
        onOpenChat={chatId => {
          handleSelectChat(chatId);
          setIsNotificationsOpen(false);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        language={lang}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={user => {
          setCurrentUser(user);
          setUsers(userService.getUsers());
          setChats(chatService.getChats());
        }}
      />

      {/* Fullscreen Image Lightbox */}
      <FullscreenImageViewer
        isOpen={lightboxState.isOpen}
        activeAttachment={lightboxState.attachment}
        allAttachments={activeAttachments}
        language={lang}
        onClose={() => setLightboxState({ isOpen: false, attachment: null })}
        onSelectAttachment={att =>
          setLightboxState(s => ({ ...s, attachment: att }))
        }
      />

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        currentUser={currentUser}
        settings={settings}
        unreadNotificationsCount={unreadNotifsCount}
        activeTab={sidebarTab}
        onClose={() => setIsMobileMenuOpen(false)}
        onSelectTab={tab => {
          setSidebarTab(tab);
          setMobileScreen('list');
        }}
        onOpenSearchPeople={() => setIsSearchPeopleOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenVoiceStatus={() => setIsVoiceStatusOpen(true)}
        onOpenStreaks={() => setIsStreaksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setSelectedProfileUser(currentUser)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />
    </div>
  );
};
