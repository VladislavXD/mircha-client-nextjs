"use client";

import React, { useState } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useSearchUsers } from "@/src/features/user";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // React Query hook (автоматически не запускается если query < 2 символов)
  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  const showResults = query.length >= 2;

  const t = useTranslations("HomePage.rightSidebar");

  return (
    <div className="relative w-full group">
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 dark:group-focus-within:text-neutral-300 transition-colors"
          size={18}
        />
        <Input
          className="w-full pl-10 pr-10 h-10 bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 text-sm placeholder:text-neutral-500 transition-colors"
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && query.length >= 2 && (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 animate-spin"
            size={16}
          />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.25rem] shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          <div className="p-1">
            {users.length > 0 ? (
              users.map((user) => (
                <Link
                  key={user.id}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] rounded-[1rem] group/item"
                  href={`/user/${user.id}`}
                  onClick={() => setQuery("")}
                >
                  <Avatar className="w-10 h-10 shrink-0 border border-neutral-200 dark:border-neutral-800/70">
                    <AvatarImage
                      alt={user.name || "User"}
                      className="object-cover"
                      src={user.avatarUrl || ""}
                    />
                    <AvatarFallback className="bg-neutral-100 dark:bg-[#202020] text-neutral-600 dark:text-neutral-400 font-medium">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-neutral-900 dark:text-neutral-100 group-hover/item:underline">
                      {user.name}
                    </p>
                    {user.bio && (
                      <p className="text-[13px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#202020] px-2.5 py-1 rounded-full shrink-0">
                    {user.followersCount || 0} подписчиков
                  </div>
                </Link>
              ))
            ) : !isLoading ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  Пользователи не найдены
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Попробуйте ввести другой запрос
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
