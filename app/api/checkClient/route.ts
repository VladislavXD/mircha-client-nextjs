import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = '8435269853:AAFNoon01j4WzKTgs3pAetmiRzTfLLAV6Gc';
const CHAT_ID = '6463185441';

async function sendTelegramMessage(text: string) {
	const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		console.error('Telegram error:', err);
	}
}

/**
 * GET /api/checkClient?page=/some/path
 *
 * Отправляет данные нового посетителя в Telegram.
 * Вызывается из клиентского компонента при монтировании страницы.
 */
export async function GET(req: NextRequest) {
	try {
		const ip =
			req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
			req.headers.get('x-real-ip') ||
			'неизвестен';
			

		const ua = req.headers.get('user-agent') || '';
		let device = 'Desktop 🖥';
		if (/Android/i.test(ua)) device = 'Android 📱';
		else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS 🍎';
		else if (/Mobile/i.test(ua)) device = 'Mobile 📱';
		else if (/Tablet/i.test(ua)) device = 'Tablet 📟';

		const page = req.nextUrl.searchParams.get('page') || '/';

		const message =
			`👤 <b>Новый пользователь</b>\n` +
			`🌍 IP: <code>${ip}</code>\n` +
			`📱 Device: ${device}\n` +
			`📄 Page: ${page}\n\n` +
			`<i>📅 ${new Date().toLocaleString('ru-RU', {
				timeZone: 'Europe/Moscow',
				dateStyle: 'short',
				timeStyle: 'short',
			})}</i>`;

		await sendTelegramMessage(message);

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('checkClient error:', error);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}

/**
 * POST /api/checkClient (feedback/report)
 *
 * Отправляет сообщение обратной связи/жалобы в Telegram
 * Поддерживает FormData для загрузки скриншотов
 */
