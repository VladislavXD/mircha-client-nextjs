// ─────────────────────────────────────────────
//  Данные для модалки "Последние обновления"
//  Добавляй новые записи в начало массива.
// ─────────────────────────────────────────────

export type ChangelogCategory =
  | "feature"   // 🟢 новая фича
  | "fix"       // 🔴 исправление
  | "improve"   // 🔵 улучшение
  | "perf"      // 🟡 производительность
  | "security"; // 🟠 безопасность

export type ChangelogEntry = {
  version: string;          // "1.3.0"
  date: string;             // "2025-06-10"
  title: string;            // Короткое описание релиза
  description?: string;     // Необязательный подзаголовок / контекст
  changes: {
    category: ChangelogCategory;
    text: string;
  }[];
};

export const changelog: ChangelogEntry[] = [
  // ──────────────────────────────────────────
  // 👇 НОВЫЕ ЗАПИСИ ДОБАВЛЯЙ СЮДА (в начало)
  // ──────────────────────────────────────────
  {
    version: "3.1.0",
    date: "2025-06-13",
    title: "Уведомления, Workspace и UI-полировка",
    description: "Реалтайм-уведомления, новая страница Workspace, переработка профиля, настроек и навигации.",
    changes: [
      { category: "feature", text: "Уведомления в реальном времени (Socket.io + NestJS + Redis)" },
      { category: "feature", text: "Новая страница Workspace — система управления проектами (в разработке)" },
      { category: "feature", text: "Poll-компонент: опросы с одиночным и множественным выбором" },
      { category: "improve", text: "Переработан профиль: удобнее навигация, форма публикации постов, новый дизайн карточек и репостов" },
      { category: "improve", text: "Настройки: drawer на мобильных, модалка на десктопе" },
      { category: "improve", text: "Навигация: dropdown перенесён в сайдбар; на мобильных — drawer в хедере с профилем и настройками" },
      { category: "perf",    text: "Оптимизация кода: рефакторинг, удаление мусора, ускорение загрузки" },
    ],
  },
  {
    version: "3.0.0",
    date: "2025-06-01",
    title: "Мессенджер: группы и каналы",
    description: "Групповые чаты, каналы и новый дизайн страницы сообщений.",
    changes: [
      { category: "feature", text: "Групповые чаты и каналы" },
      { category: "feature", text: "Новый UI страницы /messages/groups/channels" },
      { category: "improve", text: "Обновлены Prisma-модели для чатов и сообщений" },
      { category: "improve", text: "Миграция с HeroUI на shadcn/ui (60%)" },
    ],
  },
  {
    version: "2.2.0",
    date: "2025-05-01",
    title: "SEO, метаданные и авторизация сокетов",
    changes: [
      { category: "feature", text: "Динамические метаданные для страницы поста (OG, Twitter)" },
      { category: "feature", text: "Авторизация сокетов через session cookies" },
      { category: "improve", text: "i18n: локаль в URL, SEO-опции для каждой локали" },
      { category: "improve", text: "Sitemap и robots.txt обновлены" },
      { category: "fix",     text: "Исправлен middleware для http-only cookies" },
      { category: "security", text: "Удалены секреты из git-истории, добавлен .env.example" },
    ],
  },
  {
    version: "2.1.0",
    date: "2025-04-01",
    title: "Крупный UI/UX рефакторинг",
    description: "Release v2.1.0 — переработка интерфейса и новые социальные функции.",
    changes: [
      { category: "feature", text: "Система комментариев и ответов" },
      { category: "feature", text: "OAuth: Google-авторизация и объединение аккаунтов" },
      { category: "feature", text: "Карточка поста в стиле Threads + UserProfileModal" },
      { category: "feature", text: "Система упоминаний @username" },
      { category: "feature", text: "Страница поиска и новостной блок" },
      { category: "feature", text: "Модалка обратной связи (feedback)" },
      { category: "improve", text: "Мобильная адаптация всего приложения" },
      { category: "improve", text: "Статус профиля пользователя" },
      { category: "improve", text: "Переключение логотипа по теме (светлая/тёмная)" },
      { category: "fix",     text: "Исправлена ошибка isEdited в CurrentPost" },
      { category: "fix",     text: "Исправлены баги перед сборкой (build)" },
    ],
  },
  {
    version: "2.0.0",
    date: "2025-01-10",
    title: "Новый год — новый стек",
    description: "Масштабная миграция: новый бэкенд, новая авторизация, новогодний дизайн.",
    changes: [
      { category: "improve", text: "Миграция с RTK Query на React Query" },
      { category: "improve", text: "Миграция с reCAPTCHA v3 на reCAPTCHA v2" },
      { category: "improve", text: "Бэкенд переехал с Express на NestJS" },
      { category: "feature", text: "Подтверждение email и двухфакторная аутентификация (2FA)" },
      { category: "feature", text: "Страница настроек аккаунта" },
      { category: "feature", text: "Смена пароля в настройках безопасности" },
      { category: "improve", text: "Авторизация через http-only cookie v2" },
      { category: "improve", text: "Онлайн-статус перенесён на карточку поста" },
      { category: "security", text: "Исправлены CVE-уязвимости React Server Components" },
    ],
  },
  {
    version: "1.1.0",
    date: "2024-10-01",
    title: "Безопасность, оптимизация и форум",
    changes: [
      { category: "feature", text: "Оптимистичные обновления (optimistic UI) для лайков" },
      { category: "feature", text: "ReCaptcha-компонент" },
      { category: "feature", text: "Форум: категории, темы, ответы, статистика, NSFW-фильтр" },
      { category: "feature", text: "Админ-панель с модерацией" },
      { category: "feature", text: "Скелетоны (skeleton loaders)" },
      { category: "improve", text: "Lucide-иконки вместо кастомных SVG" },
      { category: "improve", text: "Эмодзи в постах" },
      { category: "fix",     text: "UI-фиксы в textarea и карточках постов" },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-07-01",
    title: "Первый запуск Mirchan",
    description: "Базовая социальная сеть на Next.js.",
    changes: [
      { category: "feature", text: "Регистрация и авторизация" },
      { category: "feature", text: "Лента постов с бесконечным скроллом" },
      { category: "feature", text: "Загрузка фото и видео" },
      { category: "feature", text: "Профиль пользователя с видео в шапке" },
      { category: "feature", text: "Посты, лайки и комментарии" },
      { category: "feature", text: "Страница «О проекте» и sitemap" },
    ],
  },
];

// ─────────────────────────────────────────────
//  Словари для отображения
// ─────────────────────────────────────────────

export const categoryConfig: Record<
  ChangelogCategory,
  { label: string; color: string; bg: string }
> = {
  feature:  { label: "Фича",         color: "text-green-700 dark:text-green-400",   bg: "bg-green-100 dark:bg-green-900/40"   },
  fix:      { label: "Исправление",  color: "text-red-700 dark:text-red-400",       bg: "bg-red-100 dark:bg-red-900/40"       },
  improve:  { label: "Улучшение",    color: "text-blue-700 dark:text-blue-400",     bg: "bg-blue-100 dark:bg-blue-900/40"     },
  perf:     { label: "Скорость",     color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40" },
  security: { label: "Безопасность", color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
};