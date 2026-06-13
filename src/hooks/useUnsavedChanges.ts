"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Показывает браузерный confirm при:
 * 1. Закрытии / перезагрузке вкладки (beforeunload)
 * 2. Навигации внутри Next.js (router.push/replace/back)
 *
 * @param isDirty — true когда есть несохранённые изменения
 * @param message — текст подсказки (браузер может его игнорировать в beforeunload)
 */
export function useUnsavedChanges(
  isDirty: boolean,
  message = "Есть несохранённые изменения. Покинуть страницу?"
) {
  const router = useRouter();

  // 1. Закрытие / обновление вкладки
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Современные браузеры игнорируют кастомный текст,
      // но показывают стандартный диалог при наличии returnValue
      e.returnValue = message;
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, message]);

  // 2. Навигация внутри Next.js App Router
  // App Router не имеет встроенного роутер-гарда, поэтому
  // патчим router.push / router.replace / router.back
  useEffect(() => {
    if (!isDirty) return;

    const originalPush = router.push.bind(router);
    const originalReplace = router.replace.bind(router);
    const originalBack = router.back.bind(router);

    const confirm = (action: () => void) => {
      if (window.confirm(message)) action();
    };

    router.push = (...args) => confirm(() => originalPush(...args));
    router.replace = (...args) => confirm(() => originalReplace(...args));
    router.back = () => confirm(() => originalBack());

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
    };
  }, [isDirty, message, router]);
}