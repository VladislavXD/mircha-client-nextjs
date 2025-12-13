import React from 'react';
import { Badge, User } from '@heroui/react';

interface OnlineBadgeProps {
  /** URL аватара пользователя */
  avatarUrl?: string;
  /** Имя пользователя (для компонента User) */
  name?: string;
  /** Описание пользователя (для компонента User) */
  description?: string;
  /** Статус онлайн */
  isOnline: boolean;
  /** Размер аватара */
  size?: 'sm' | 'md' | 'lg';
  /** Дополнительные пропы для Badge компонента */
  badgeProps?: Omit<React.ComponentProps<typeof Badge>, 'content' | 'color' | 'variant' | 'size' | 'isInvisible' | 'placement' | 'children'>;
}

/**
 * Компонент для отображения аватара пользователя со статусом онлайн
 * Badge показывается только если пользователь онлайн
 */
export const OnlineBadge: React.FC<OnlineBadgeProps> = ({
  avatarUrl,
  name = '',
  description = '',
  isOnline,
  size = 'md',
  badgeProps = {}
}) => {
  return (
    <Badge
      content=""
      color={isOnline ? "success" : "default"}
      variant={isOnline ? "solid" : "flat"}
      size="sm"
      isInvisible={!isOnline}
      placement="bottom-right"
      {...badgeProps}
    >
      <User
        name={name}
        description={description}
        avatarProps={{
          src: avatarUrl,
          size
        }}
      />
    </Badge>
  );
};

export default OnlineBadge;