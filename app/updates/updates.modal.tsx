import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@heroui/react";
import { CheckCircle2, Circle, Clock, Zap, Map } from "lucide-react";

type UpdatesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type PhaseStatus = "done" | "active" | "planned";

const phases: { status: PhaseStatus; phase: string; items: string[] }[] = [
  {
    status: "done",
    phase: "Фаза 1 — Основа",
    items: [
      "Регистрация и авторизация http-only cookie",
      "Лента постов с бесконечным скроллом",
      "Лайки с оптимистичным UI",
      "Загрузка медиа (фото / видео)",
      "Система спойлеров в тексте",
      "Комментарии и ответы",
      "Система подписок",
    ],
  },
  {
    status: "active",
    phase: "Фаза 2 — Социальность",
    items: [
      "Страница поста с полной лентой комментариев",
      "Карта развития проекта ",
      "Репосты",
      "Система упоминаний @username",
      "Уведомления в реальном времени",
      "Поиск пользователей и постов",
    ],
  },
  {
    status: "planned",
    phase: "Фаза 3 — Мессенджер",
    items: [
      "Приватные чаты",
      "Групповые чаты",
      "Медиа в чатах",
      "Статус онлайн и индикатор набора",
      "Прочитанность сообщений",
    ],
  },
  {
    status: "planned",
    phase: "Фаза 4 — Форум",
    items: [
      "Доски и темы форума",
      "Категории и теги",
      "Модерация и роли",
      "Голосования в постах",
    ],
  },
  {
    status: "planned",
    phase: "Фаза 5 — Платформа",
    items: [
      "Мобильное приложение (React Native)",
      "Рекомендательная лента",
      "Профильные кастомизации",
      "API для сторонних клиентов",
    ],
  },
];

const statusConfig: Record<PhaseStatus, { icon: any; color: string; dot: string; label: string; chip: string }> = {
  done:    { icon: CheckCircle2, color: "text-success",  dot: "bg-success",  label: "Готово",       chip: "success"  },
  active:  { icon: Zap,          color: "text-warning",  dot: "bg-warning",  label: "В разработке", chip: "warning"  },
  planned: { icon: Circle,       color: "text-default-400", dot: "bg-default-300", label: "Запланировано", chip: "default" },
} as const satisfies Record<PhaseStatus, any>;

export default function UpdatesModal({ isOpen, onClose }: UpdatesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside"
      classNames={{ base: "max-h-[90vh]", body: "py-4 px-4 sm:px-6" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 border-b border-divider pb-3">
              <Map size={20} className="text-primary" />
              <span>Карта развития Mirchan</span>
              <Chip size="sm" color="warning" variant="flat" className="ml-auto">В разработке</Chip>
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-default-500 mb-4">
                Mirchan — анонимная социальная сеть. Ниже — дорожная карта проекта: что уже работает, что делается прямо сейчас и что будет дальше.
              </p>

              <div className="relative">
                {/* Вертикальная линия */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-success via-warning to-default-200 rounded-full" />

                <div className="flex flex-col gap-6 pl-1">
                  {phases.map((phase) => {
                    const cfg = statusConfig[phase.status];
                    const Icon = cfg.icon;
                    return (
                      <div key={phase.phase} className="flex gap-4">
                        {/* Иконка-маркер */}
                        <div className="flex-shrink-0 w-6 flex flex-col items-center pt-0.5">
                          <Icon size={22} className={cfg.color} />
                        </div>

                        {/* Контент фазы */}
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{phase.phase}</span>
                            <Chip size="sm" color={cfg.chip as any} variant="flat">{cfg.label}</Chip>
                          </div>
                          <ul className="space-y-1">
                            {phase.items.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-default-600">
                                <span className={`mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-divider pt-3">
              <span className="text-xs text-default-400 mr-auto">Обновляется по мере разработки</span>
              <Button variant="flat" onPress={onClose}>Закрыть</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

