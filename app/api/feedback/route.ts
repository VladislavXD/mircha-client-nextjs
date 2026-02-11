import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/feedback
 * 
 * Отправляет сообщение обратной связи/жалобы в Telegram
 * Поддерживает FormData для загрузки скриншотов
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Извлекаем поля
    const type = formData.get('type') as string;
    const reason = formData.get('reason') as string | null;
    const targetId = formData.get('targetId') as string | null;
    const targetType = formData.get('targetType') as string | null;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const screenshot = formData.get('screenshot') as File | null;
    const userName = formData.get('userName') as string | null;
    const userEmail = formData.get('userEmail') as string | null;

    // Валидация обязательных полей
    if (!type || !subject || !description) {
      return NextResponse.json(
        { error: 'Обязательные поля: type, subject, description' },
        { status: 400 }
      );
    }

    if (subject.length < 5 || subject.length > 100) {
      return NextResponse.json(
        { error: 'Тема должна быть от 5 до 100 символов' },
        { status: 400 }
      );
    }

    if (description.length < 20 || description.length > 1000) {
      return NextResponse.json(
        { error: 'Описание должно быть от 20 до 1000 символов' },
        { status: 400 }
      );
    }

    // Telegram credentials
    const BOT_TOKEN = '8435269853:AAFNoon01j4WzKTgs3pAetmiRzTfLLAV6Gc';
    const CHAT_ID = '-1001600307357';

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { error: "Telegram не настроен на сервере" },
        { status: 500 }
      );
    }

    // Словари для перевода типов и причин
    const typeLabels: Record<string, string> = {
      POST_REPORT: '📝 Жалоба на пост',
      COMMENT_REPORT: '💬 Жалоба на комментарий',
      USER_REPORT: '👤 Жалоба на пользователя',
      BUG_REPORT: '🐛 Баг-репорт',
      FEATURE_REQUEST: '✨ Запрос функции',
      GENERAL_FEEDBACK: '📧 Обратная связь'
    };

    const reasonLabels: Record<string, string> = {
      SPAM: 'Спам',
      HARASSMENT: 'Домогательство',
      HATE_SPEECH: 'Разжигание ненависти',
      VIOLENCE: 'Насилие',
      NUDITY: 'Обнаженка',
      FALSE_INFORMATION: 'Ложная информация',
      SCAM: 'Мошенничество',
      INTELLECTUAL_PROPERTY: 'Нарушение авторских прав',
      OTHER: 'Другое'
    };

    // Формируем сообщение
    let message = `🔔 <b>${typeLabels[type] || type}</b>\n\n`;
    
    if (userName) {
      message += `<b>Отправитель:</b> ${userName}\n`;
    }
    if (userEmail) {
      message += `<b>Email:</b> ${userEmail}\n`;
    }
    
    if (reason) {
      message += `<b>Причина:</b> ${reasonLabels[reason] || reason}\n`;
    }
    
    if (targetType && targetId) {
      message += `<b>Цель:</b> ${targetType} (ID: <code>${targetId}</code>)\n`;
    }
    
    message += `\n<b>Тема:</b> ${subject}\n`;
    message += `\n<b>Описание:</b>\n${description}\n`;
    message += `\n<i>📅 ${new Date().toLocaleString('ru-RU', { 
      timeZone: 'Europe/Moscow',
      dateStyle: 'short',
      timeStyle: 'short'
    })}</i>`;

    // Отправляем текстовое сообщение
    const sendMessageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const textResponse = await fetch(sendMessageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!textResponse.ok) {
      const error = await textResponse.json().catch(() => ({}));
      console.error('Telegram sendMessage error:', error);
      throw new Error('Не удалось отправить сообщение в Telegram');
    }

    // Если есть скриншот, отправляем его отдельно
    if (screenshot && screenshot.size > 0) {
      try {
        const photoFormData = new FormData();
        photoFormData.append('chat_id', CHAT_ID);
        photoFormData.append('photo', screenshot);
        photoFormData.append('caption', `📸 Скриншот к жалобе: ${subject}`);

        const sendPhotoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
        
        const photoResponse = await fetch(sendPhotoUrl, {
          method: 'POST',
          body: photoFormData,
        });

        if (!photoResponse.ok) {
          console.error('Failed to send screenshot, but message was sent');
        }
      } catch (photoError) {
        console.error('Screenshot upload error:', photoError);
        // Не падаем, если скриншот не загрузился
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Ваше сообщение отправлено!',
      id: `feedback_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Ошибка сервера',
      },
      { status: 500 }
    );
  }
}
