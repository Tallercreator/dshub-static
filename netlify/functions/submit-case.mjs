// submit-case — Netlify Function (бессерверная). Принимает заявку «Предложить
// кейс» из S_Form и отправляет её в Telegram через Bot API.
//
// ВАЖНО: токен бота — секрет, живёт ТОЛЬКО здесь (server-side), в env Netlify.
// В клиентский JS он не попадает. Переменные окружения:
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — id чата/канала, куда слать заявки
//
// Netlify Functions 2.0 (Web API Request/Response), Node 20 (global fetch).

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ ok: false, error: 'not_configured' }, { status: 500 });
  }

  // данные: JSON или form-data
  let data = {};
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await req.json();
    } else {
      data = Object.fromEntries(await req.formData());
    }
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  // honeypot: если заполнен скрытый botcheck — это бот, тихо «принимаем»
  if (data.botcheck) return Response.json({ ok: true });

  const name = String(data.name || '').trim();
  if (!name) return Response.json({ ok: false, error: 'name_required' }, { status: 400 });

  const fields = [
    ['Имя', name],
    ['Telegram', data.telegram],
    ['Контакт', data.contact],
    ['Компания', data.company],
  ];
  const text =
    '🆕 Новая заявка на кейс — DSHub\n\n' +
    fields
      .filter(([, v]) => v && String(v).trim())
      .map(([k, v]) => `${k}: ${String(v).trim()}`)
      .join('\n');

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });

  if (!tg.ok) {
    const detail = await tg.text().catch(() => '');
    return Response.json({ ok: false, error: 'telegram_failed', detail }, { status: 502 });
  }

  return Response.json({ ok: true });
};
