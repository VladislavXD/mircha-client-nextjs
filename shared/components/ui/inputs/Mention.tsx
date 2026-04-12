import type { IUser } from "@/src/features/user/types";

import React from "react";
import { Loader2 } from "lucide-react";

import { useDebounce } from "@/src/hooks/useDebounce";
import { useSearchUsers } from "@/src/features/user/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  showHit: boolean;
  mention: string | null;
  onSelect?: (user: IUser) => void;
};

/**
 * Mention - компонент для поиска и выбора пользователей при упоминании
 *
 * Поддерживает:
 * - Debounced поиск (300ms)
 * - @упоминания
 * - Минимум 2 символа для поиска
 * - Отображение аватара, имени и био
 */
const Mention = (props: Props) => {
  const { showHit, mention, onSelect } = props;

  if (!mention) {
    return null;
  }

  const debouncedQuery = useDebounce(mention || "", 300);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useSearchUsers(debouncedQuery, {
    enabled: debouncedQuery.length >= 2,
  });

  const showResults = mention.length >= 2;

  return (
    <div className="absolute z-50 w-72 mt-1 bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.25rem] shadow-xl overflow-hidden shadow-neutral-900/5">
      <div className="px-4 py-3 bg-neutral-50/50 dark:bg-[#161616]/50 border-b border-neutral-200 dark:border-neutral-800/70 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={12} /> Загрузка...
          </>
        ) : showHit ? (
          `Результаты по запросу: ${mention}`
        ) : (
          "Введите минимум 2 символа"
        )}
      </div>
      <div className="max-h-64 overflow-y-auto w-full p-2 space-y-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
        {showResults && !isLoading && (
          <>
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 w-full hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded-xl cursor-pointer transition-colors"
                  onClick={() => onSelect?.(user)}
                >
                  <Avatar className="w-9 h-9 border border-neutral-200 dark:border-neutral-800/70">
                    <AvatarImage
                      alt={user.name}
                      className="object-cover"
                      src={user.avatarUrl || ""}
                    />
                    <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium text-xs">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                      {user.name}
                    </span>
                    {user.bio && (
                      <span className="text-[12px] text-neutral-500 dark:text-neutral-400 truncate">
                        {user.bio}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="p-3 text-sm text-neutral-500 text-center">
                Нет пользователей для отображения
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Mention;
