"use client";

import { ReactNode } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthWrapperProps {
  /** Заголовок формы */
  heading?: string;
  /** Описание/подзаголовок */
  description?: string;
  /** Текст ссылки "назад" */
  backButtonLabel?: string;
  /** URL для ссылки "назад" */
  backButtonHref?: string;
  /** Содержимое формы */
  children: ReactNode;
  /** Ширина карточки (по умолчанию 340px как в AuthPage) */
  cardWidth?: string;
}

/**
 * Универсальная обертка для auth-форм.
 * Рендерит карточку с заголовком и содержимым, без табов.
 * Используется для страниц сброса пароля, подтверждения и т.д.
 */
export function AuthWrapper({
  heading,
  description,
  backButtonLabel,
  backButtonHref,
  children,
  cardWidth = "w-[340px]",
}: AuthWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="flex flex-col">
        <Card className={`max-w-full ${cardWidth}`}>
          {(heading || description) && (
            <CardHeader className="flex flex-col gap-2 pb-2 pt-6">
              {heading && (
                <CardTitle className="text-2xl text-center">
                  {heading}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="text-center">
                  {description}
                </CardDescription>
              )}
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
          {backButtonLabel && backButtonHref && (
            <div className="px-6 pb-6 pt-0">
              <Link
                className="text-sm text-center block text-blue-600 hover:text-blue-800 underline"
                href={backButtonHref}
              >
                {backButtonLabel}
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
