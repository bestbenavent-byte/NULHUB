import {
  User,
  Chat,
  Message,
  StreakMedal,
  Wallpaper,
  AppSettings,
  AppNotification
} from '../types/messenger';

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#3b82f6',
  language: 'uk',
  bubbleStyle: 'modern',
  wallpaperId: 'default',
  messageDensity: 'comfortable',
  enterToSend: true,
  soundEnabled: true,
  soundVolume: 0.7,
  notificationSound: true,
  privacyLastSeen: 'everyone',
  privacyReadReceipts: true
};

export const MOCK_USERS: User[] = [
  {
    id: 'user_current',
    username: 'andriy_tk',
    displayName: 'Андрій Ткаченко',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Lead Product Designer & React Architect. Будую інтерфейси майбутнього 🚀',
    email: 'andriy.tkachenko@example.com',
    phone: '+380 67 123 4567',
    isOnline: true,
    streak: 42,
    voiceStatus: {
      id: 'vs_current',
      userId: 'user_current',
      waveform: [20, 45, 70, 90, 80, 60, 40, 85, 95, 60, 30, 70, 50, 40, 20],
      duration: 12,
      caption: 'Фіналізуємо новий реліз месенджера! ⚡️',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
      listensCount: 38
    }
  },
  {
    id: 'user_sofia',
    username: 'sofia_koval',
    displayName: 'Софія Ковальчук',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Art director & 3D motion enthusiast. Люблю каву, гори та чистий дизайн ☕️🏔',
    email: 'sofia.koval@designlab.io',
    phone: '+380 50 987 6543',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    streak: 42,
    voiceStatus: {
      id: 'vs_sofia',
      userId: 'user_sofia',
      waveform: [15, 30, 65, 80, 100, 75, 45, 90, 100, 85, 55, 35, 20],
      duration: 14,
      caption: 'Ранкова кава на терасі під вініл ☕️✨',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
      listensCount: 52
    }
  },
  {
    id: 'user_oleksiy',
    username: 'oleksiy_dev',
    displayName: 'Олексій Мельник',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Senior Backend & Distributed Systems Engineer. Rust, Go, WebSocket, Postgres.',
    email: 'oleksiy.melnyk@techcore.ua',
    phone: '+380 93 456 7890',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    streak: 15
  },
  {
    id: 'user_kateryna',
    username: 'katya_bilous',
    displayName: 'Катерина Білоус',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Product Manager. Робимо релізи вчасно і без стресу 🎯',
    email: 'kateryna.bilous@aether.app',
    phone: '+380 63 333 4455',
    isOnline: true,
    streak: 28,
    voiceStatus: {
      id: 'vs_katya',
      userId: 'user_kateryna',
      waveform: [10, 40, 60, 80, 65, 90, 70, 50, 80, 60, 30, 20],
      duration: 9,
      caption: 'Хто на командний дзвінок о 15:00? 🎧',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
      listensCount: 24
    }
  },
  {
    id: 'user_danylo',
    username: 'danylo_sh',
    displayName: 'Данило Шевченко',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'iOS & macOS engineer. Swift, Metal, CoreAnimation lover 🍏',
    email: 'danylo.sh@appledev.net',
    phone: '+380 97 777 8899',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    streak: 7
  },
  {
    id: 'user_marta',
    username: 'marta_lev',
    displayName: 'Марта Левченко',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'UI/UX Researcher & Design System lead. Користувачі понад усе ❤️',
    email: 'marta.levchenko@uxstudio.com',
    phone: '+380 50 112 2334',
    isOnline: true,
    streak: 65
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_sofia',
    type: 'direct',
    name: 'Софія Ковальчук',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    participants: ['user_current', 'user_sofia'],
    unreadCount: 2,
    pinned: true,
    mutedUntil: null,
    streak: 42,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  },
  {
    id: 'chat_group_release',
    type: 'group',
    name: '🚀 Aether 2.0 Core Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    participants: ['user_current', 'user_sofia', 'user_oleksiy', 'user_kateryna', 'user_marta'],
    unreadCount: 0,
    pinned: true,
    mutedUntil: null,
    streak: 21,
    description: 'Координація головного релізу месенджера. Дизайн, API, WebSockets та QA.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString()
  },
  {
    id: 'chat_oleksiy',
    type: 'direct',
    name: 'Олексій Мельник',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    participants: ['user_current', 'user_oleksiy'],
    unreadCount: 0,
    pinned: false,
    mutedUntil: null,
    streak: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
  },
  {
    id: 'chat_kateryna',
    type: 'direct',
    name: 'Катерина Білоус',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    participants: ['user_current', 'user_kateryna'],
    unreadCount: 0,
    pinned: false,
    mutedUntil: '2026-12-31T23:59:59.000Z',
    streak: 28,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
  },
  {
    id: 'chat_danylo',
    type: 'direct',
    name: 'Данило Шевченко',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    participants: ['user_current', 'user_danylo'],
    unreadCount: 0,
    pinned: false,
    mutedUntil: null,
    streak: 7,
    isArchived: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  chat_sofia: [
    {
      id: 'm_sofia_1',
      chatId: 'chat_sofia',
      senderId: 'user_sofia',
      text: 'Привіт, Андрію! Переглянула новий прототип головного екрана месенджера. Контраст та мікроанімації просто неймовірні! 🔥',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      status: 'read',
      reactions: { '🔥': ['user_current'], '❤️': ['user_sofia'] }
    },
    {
      id: 'm_sofia_2',
      chatId: 'chat_sofia',
      senderId: 'user_current',
      text: 'Дякую, Софіє! Ми спеціально прибрали всі зайві плашки й декоративні рамки, зробивши чистий фокус на листуванні.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
      status: 'read',
      reactions: { '👍': ['user_sofia'] }
    },
    {
      id: 'm_sofia_3',
      chatId: 'chat_sofia',
      senderId: 'user_sofia',
      text: 'Ось як виглядає оновлена палітра темного режиму для скляних та класичних бульбашок. Що скажеш?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'read',
      media: [
        {
          id: 'att_1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          name: 'dark_theme_tokens_v2.png',
          size: '2.4 MB'
        }
      ],
      reactions: { '❤️': ['user_current'] }
    },
    {
      id: 'm_sofia_4',
      chatId: 'chat_sofia',
      senderId: 'user_current',
      text: 'Виглядає дуже солідно та преміально! Тіні м\'які, а акцентний колір не ріже очі вночі.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'read',
      replyTo: {
        id: 'm_sofia_3',
        senderId: 'user_sofia',
        senderName: 'Софія Ковальчук',
        text: 'Ось як виглядає оновлена палітра темного режиму...',
        mediaType: 'image'
      },
      reactions: {}
    },
    {
      id: 'm_sofia_5',
      chatId: 'chat_sofia',
      senderId: 'user_sofia',
      text: 'Записала тобі коротке голосове щодо інтеграції звукових ефектів:',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      status: 'read',
      type: 'voice',
      audioDuration: '0:18',
      waveform: [25, 40, 75, 90, 60, 45, 80, 95, 70, 50, 85, 60, 40, 20],
      reactions: { '✨': ['user_current'] }
    },
    {
      id: 'm_sofia_6',
      chatId: 'chat_sofia',
      senderId: 'user_sofia',
      text: 'І не забудь перевірити стріки! У нас сьогодні рівно 42 дні щоденного спілкування безперервно 🔥',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      status: 'delivered',
      reactions: {}
    }
  ],
  chat_group_release: [
    {
      id: 'm_grp_1',
      chatId: 'chat_group_release',
      senderId: 'user_kateryna',
      text: 'Усім привіт! До релізу Aether 2.0 залишається фінальний етап перевірки. Олексій, як там WebSocket конекшн?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'read',
      isPinned: true,
      reactions: { '🚀': ['user_current', 'user_oleksiy'] }
    },
    {
      id: 'm_grp_2',
      chatId: 'chat_group_release',
      senderId: 'user_oleksiy',
      text: 'Бекенд відпрацьовує бездоганно. Всі статуси sent -> delivered -> read та typing sync тестуються із затримкою до 20ms.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(),
      status: 'read',
      reactions: { '👍': ['user_current', 'user_kateryna'] }
    },
    {
      id: 'm_grp_3',
      chatId: 'chat_group_release',
      senderId: 'user_current',
      text: 'На фронтенді повністю реалізовано: змінні теми, адаптивні бульбашки повідомлень, кастомні шпалери, голосові статуси та медалі стріків.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.8).toISOString(),
      status: 'read',
      reactions: { '🔥': ['user_kateryna', 'user_sofia', 'user_marta'] }
    },
    {
      id: 'm_grp_4',
      chatId: 'chat_group_release',
      senderId: 'user_marta',
      text: 'Провела швидке тестування на мобільних пристроях. Все ідеально адаптується, приховуючи сайдбар при відкритті чату 📱',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      status: 'read',
      reactions: { '❤️': ['user_kateryna'] }
    }
  ],
  chat_oleksiy: [
    {
      id: 'm_olek_1',
      chatId: 'chat_oleksiy',
      senderId: 'user_oleksiy',
      text: 'Андрію, надішли, будь ласка, специфікацію структури WebSocket подій для realtime сервісу.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'read',
      reactions: {}
    },
    {
      id: 'm_olek_2',
      chatId: 'chat_oleksiy',
      senderId: 'user_current',
      text: 'Тримай схему! Ось типи подій: message:new, typing:start, reaction:update, voice_status:published.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      status: 'read',
      reactions: { '🙌': ['user_oleksiy'] }
    }
  ],
  chat_kateryna: [
    {
      id: 'm_kat_1',
      chatId: 'chat_kateryna',
      senderId: 'user_kateryna',
      text: 'Андрію, оновила таски на сьогодні. Все йде чітко за планом!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      status: 'read',
      reactions: { '👍': ['user_current'] }
    }
  ],
  chat_danylo: [
    {
      id: 'm_dan_1',
      chatId: 'chat_danylo',
      senderId: 'user_danylo',
      text: 'Чудовий реліз! Скинь посилання, коли з\'явиться на веб-продакшені.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      status: 'read',
      reactions: {}
    }
  ]
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'message',
    title: 'Софія Ковальчук',
    body: 'І не забудь перевірити стріки! У нас сьогодні рівно 42 дні 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    isRead: false,
    linkChatId: 'chat_sofia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'notif_2',
    type: 'streak',
    title: 'Досягнення розблоковано!',
    body: 'Ви розблокували медаль «Золоте Багаття» (30 днів стріку)! 🏅',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isRead: false
  },
  {
    id: 'notif_3',
    type: 'reaction',
    title: 'Олексій Мельник',
    body: 'поставив реакцію 🚀 на ваше повідомлення у групі Aether 2.0',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true,
    linkChatId: 'chat_group_release'
  }
];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'default',
    name: 'Стандартний мінімалізм',
    type: 'default',
    value: 'transparent',
    textColor: 'light'
  },
  {
    id: 'messenger_doodle',
    name: 'Месенджер Дудли',
    type: 'pattern',
    value: `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08), transparent 70%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.06' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
    textColor: 'light'
  },
  {
    id: 'midnight_nebula',
    name: 'Глибока Північ',
    type: 'gradient',
    value: 'radial-gradient(at 100% 0%, #1e1b4b 0px, transparent 55%), radial-gradient(at 0% 100%, #0f172a 0px, transparent 50%), #07090e',
    textColor: 'light'
  },
  {
    id: 'aurora_borealis',
    name: 'Полярне Сяйво',
    type: 'gradient',
    value: 'radial-gradient(ellipse at 80% 10%, rgba(13, 148, 136, 0.28), transparent 60%), radial-gradient(ellipse at 15% 90%, rgba(59, 130, 246, 0.25), transparent 60%), #090e17',
    textColor: 'light'
  },
  {
    id: 'emerald_luxury',
    name: 'Смарагдовий Оксамит',
    type: 'gradient',
    value: 'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.22), transparent 55%), radial-gradient(circle at 10% 85%, rgba(6, 78, 59, 0.4), transparent 60%), #06110d',
    textColor: 'light'
  },
  {
    id: 'sunset_glow',
    name: 'Теплий Захід',
    type: 'gradient',
    value: 'radial-gradient(circle at 15% 20%, rgba(244, 63, 94, 0.2), transparent 50%), radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.18), transparent 55%), #110914',
    textColor: 'light'
  },
  {
    id: 'cyber_grid',
    name: 'Техно Сітка',
    type: 'pattern',
    value: 'radial-gradient(circle, rgba(148, 163, 184, 0.18) 1.2px, transparent 1.2px) 0 0 / 22px 22px, #0b0f19',
    textColor: 'light'
  },
  {
    id: 'studio_graphite',
    name: 'Студійний Графіт',
    type: 'solid',
    value: 'linear-gradient(180deg, #161b26 0%, #0f131c 100%)',
    textColor: 'light'
  }
];

export const STREAK_MEDALS: StreakMedal[] = [
  {
    id: 'medal_bronze',
    name: 'Бронзова Іскра',
    daysRequired: 1,
    icon: '✨',
    color: '#d97706',
    description: 'Перший крок у щоденній дружбі. Спілкуйтеся щодня!'
  },
  {
    id: 'medal_silver',
    name: 'Срібне Полум\'я',
    daysRequired: 7,
    icon: '⚡️',
    color: '#94a3b8',
    description: '7 днів безперервного спілкування. Чудовий ритм!'
  },
  {
    id: 'medal_gold',
    name: 'Золоте Багаття',
    daysRequired: 30,
    icon: '🔥',
    color: '#eab308',
    description: '30 днів! Справжня незламна дружба та щоденний зв\'язок.'
  },
  {
    id: 'medal_diamond',
    name: 'Діамантовий Спалах',
    daysRequired: 100,
    icon: '💎',
    color: '#06b6d4',
    description: '100 днів без жодної перерви! Рідкісне досягнення.'
  },
  {
    id: 'medal_phoenix',
    name: 'Легендарний Фенікс',
    daysRequired: 365,
    icon: '🦅',
    color: '#ef4444',
    description: 'Рік безперервного полум\'я. Легенда Aether Messenger!'
  }
];

export const MOCK_STICKERS = [
  { id: 'st_1', name: 'Cool Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80', pack: 'Cats' },
  { id: 'st_2', name: 'Happy Vibe', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=200&q=80', pack: 'Cats' },
  { id: 'st_3', name: 'Party Time', url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=200&q=80', pack: 'Cats' },
  { id: 'st_4', name: 'Coffee Mode', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=200&q=80', pack: 'Cats' },
  { id: 'st_5', name: 'Code Fire', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80', pack: 'Dev' },
  { id: 'st_6', name: 'Rocket Launch', url: 'https://images.unsplash.com/photo-1517976487502-5f65f32a74c4?auto=format&fit=crop&w=200&q=80', pack: 'Dev' }
];

export const MOCK_GIFS = [
  { id: 'gif_1', title: 'Cheers celebration', url: 'https://media.giphy.com/media/artj92V8o75VPL7Ae9/giphy.gif', category: 'celebrate' },
  { id: 'gif_2', title: 'Mind blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif', category: 'reaction' },
  { id: 'gif_3', title: 'Typing fast hacker', url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif', category: 'dev' },
  { id: 'gif_4', title: 'High five friend', url: 'https://media.giphy.com/media/l0ErFafpUCQTQFMSk/giphy.gif', category: 'celebrate' },
  { id: 'gif_5', title: 'Thumbs up nod', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif', category: 'reaction' },
  { id: 'gif_6', title: 'Coffee cheer', url: 'https://media.giphy.com/media/hPTZgtzfRIB5Nfb5rL/giphy.gif', category: 'vibe' }
];

export const POPULAR_EMOJIS = [
  '❤️', '😂', '🔥', '👍', '😮', '😢', '✨', '🚀', '🙌', '💯', '😍', '👏', '🎉', '😎', '☕️', '⚡️',
  '🥳', '🤝', '💪', '🎯', '👌', '🤩', '💡', '🌈', '🙏', '👀', '💬', '🌟', '💎', '🌿', '🍕', '🎮'
];
