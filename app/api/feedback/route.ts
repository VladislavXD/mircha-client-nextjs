import { NextResponse } from "next/server";

type Body = {
  name?: string;
  contact?: string;
  topic?: string;
  message: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const BOT_TOKEN = '8435269853:AAFNoon01j4WzKTgs3pAetmiRzTfLLAV6Gc'
    const CHAT_ID = '-1001600307357'
    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json({ error: "Bot credentials not configured" }, { status: 500 });
    }

    const parts: string[] = [];
    if (body.topic) parts.push(`Тема: ${body.topic}`);
    parts.push(`Сообщение:\n${body.message}`);
    if (body.name) parts.push(`От: ${body.name}`);
    if (body.contact) parts.push(`Контакт: ${body.contact}`);

    const text = parts.join("\n\n");

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text
      })
    });

    if (!tgRes.ok) {
      const err = await tgRes.text().catch(() => "");
      return NextResponse.json({ error: `Telegram error: ${err || tgRes.status}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
