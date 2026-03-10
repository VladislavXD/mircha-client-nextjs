'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Отправляет данные посетителя в Telegram при открытии любой страницы.
 * Добавляется один раз в корневой layout.
 */
export default function VisitorTracker() {
	const pathname = usePathname();

	useEffect(() => {
		// fire-and-forget: не блокируем рендер
		fetch(`/api/checkClient?page=${encodeURIComponent(pathname)}`).catch(
			() => {}
		);
		// Запускаем только при первом монтировании
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}
