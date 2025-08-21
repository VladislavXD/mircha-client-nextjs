# Mirchan - Next.js Client

Современное веб-приложение социальной сети, построенное на Next.js 14 с использованием TypeScript, Tailwind CSS и Hero UI.

## 🚀 Особенности

### Основной функционал
- **Аутентификация и авторизация** - Регистрация, вход в систему с JWT токенами
- **Профили пользователей** - Настраиваемые профили с аватарами, рамками и видео-фонами
- **Система постов** - Создание, просмотр, лайки и комментарии к постам
- **Загрузка изображений** - Интеграция с Cloudinary для загрузки фото к постам
- **Система подписок** - Подписка/отписка от других пользователей
- **Чат система** - Мессенджер с Socket.IO для общения в реальном времени
- **Уведомления** - Система уведомлений о новых событиях

### UI/UX Особенности
- **Адаптивный дизайн** - Полная поддержка мобильных устройств
- **Темная/светлая тема** - Переключение между темами
- **Анимированные рамки** - Кастомные рамки для аватаров и имен пользователей
- **Tooltip с информацией о пользователе** - Интерактивные карточки с деталями профиля
- **Модальные окна** - Подтверждение действий, редактирование профиля
- **Бесконечная прокрутка** - Оптимизированная загрузка контента

## 🛠 Технологический стек

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Hero UI (Next UI)
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: JWT токены
- **Real-time**: Socket.IO Client
- **Image Upload**: Cloudinary
- **Icons**: React Icons, Lucide React
- **Date Handling**: Date-fns
- **Animations**: CSS Transitions, Canvas Confetti

## 📦 Установка

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Backend API (express-api) должен быть запущен

### Клонирование и установка зависимостей

```bash
# Перейти в директорию проекта
cd client-next

# Установить зависимости
npm install
# или
yarn install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Cloudinary (если используется)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### Сборка для продакшена

```bash
npm run build
npm start
# или
yarn build
yarn start
```

## 📁 Структура проекта

```
client-next/
├── app/                          # App Router (Next.js 14)
│   ├── (customer)/              # Группированные маршруты
│   │   ├── auth/               # Страницы аутентификации
│   │   ├── user/[id]/          # Динамические маршруты профилей
│   │   ├── chat/               # Чат страницы
│   │   ├── notifications/      # Уведомления
│   │   └── search/             # Поиск
│   ├── components/             # React компоненты
│   │   ├── layout/            # Layout компоненты
│   │   │   ├── Header/        # Шапка сайта
│   │   │   ├── Navbar/        # Боковая навигация
│   │   │   └── BottomNavbar/  # Мобильная навигация
│   │   └── ui/                # UI компоненты
│   │       ├── post/          # Компоненты постов
│   │       ├── User/          # Компонент пользователя с tooltip
│   │       └── profile/       # Компоненты профиля
│   ├── utils/                 # Утилиты
│   ├── AuthGuard.tsx          # Защита маршрутов
│   ├── LayoutContent.tsx      # Основной layout
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Главная страница
├── src/                       # Исходники
│   ├── services/              # RTK Query API сервисы
│   ├── store/                 # Redux store
│   ├── types/                 # TypeScript типы
│   ├── hooks/                 # Кастомные хуки
│   ├── constants/             # Константы
│   └── Providers/             # React провайдеры
├── public/                    # Статические файлы
├── tailwind.config.js         # Конфигурация Tailwind
├── next.config.ts             # Конфигурация Next.js
└── package.json
```

## 🔧 Основные компоненты

### Компонент User с Tooltip
```tsx
import User from "@/app/components/ui/User";

<User
  name="Имя пользователя"
  avatarUrl="/path/to/avatar.jpg"
  bio="Биография пользователя"
  usernameFrameUrl="/path/to/frame.png"
  followersCount={100}
  followingCount={50}
  isFollowing={false}
  onFollowToggle={() => handleFollow()}
/>
```

### Компонент Card для постов
```tsx
import Card from "@/app/components/ui/post/Card";

<Card
  name="Автор поста"
  content="Текст поста"
  imageUrl="/path/to/image.jpg"
  avatarUrl="/path/to/avatar.jpg"
  likes={25}
  comments={5}
  onLike={() => handleLike()}
  onComment={() => handleComment()}
/>
```

## 🎨 Кастомизация темы

Проект использует Hero UI с поддержкой темной и светлой темы. Настройки темы находятся в:
- `src/Providers/providers.tsx` - Конфигурация провайдера темы
- `tailwind.config.js` - Кастомные цвета и настройки

## 📱 Адаптивность

- **Desktop (1024px+)**: Полный sidebar, header, основной контент
- **Tablet (768px-1023px)**: Скрытый sidebar, header, основной контент
- **Mobile (<768px)**: Скрытый sidebar, header, нижняя навигация

## 🔐 Аутентификация

JWT токены хранятся в localStorage и автоматически добавляются к API запросам через RTK Query middleware.

### Защищенные маршруты
- Все маршруты кроме `/auth` требуют аутентификации
- `AuthGuard` компонент автоматически перенаправляет неавторизованных пользователей

## 🌐 API Интеграция

RTK Query используется для всех API вызовов:
- `userApi` - Управление пользователями
- `postApi` - Управление постами
- `chatApi` - Чат функционал
- `followApi` - Система подписок

## 🎭 Анимации и эффекты

- **Confetti анимация** при подписке на пользователя
- **Smooth transitions** для UI элементов
- **Hover эффекты** для интерактивных элементов
- **Loading states** для всех асинхронных операций

## 🐛 Отладка

### Логирование
```bash
# Включить подробные логи
DEBUG=* npm run dev
```

### Общие проблемы
1. **Hydration ошибки** - Убедитесь что `suppressHydrationWarning` установлен на body
2. **CORS ошибки** - Проверьте настройки backend API
3. **Socket.IO подключение** - Убедитесь что backend Socket.IO сервер запущен

## 🚀 Деплой

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t mirchan-client .
docker run -p 3000:3000 mirchan-client
```

## 🤝 Вклад в разработку

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Сделайте коммит (`git commit -m 'Add amazing feature'`)
4. Запушьте изменения (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 👥 Авторы

- **Основной разработчик** - [Ваше имя]

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) за отличный фреймворк
- [Hero UI](https://heroui.com/) за красивые компоненты
- [Tailwind CSS](https://tailwindcss.com/) за утилиты стилизации
- [Redux Toolkit](https://redux-toolkit.js.org/) за управление состоянием

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
