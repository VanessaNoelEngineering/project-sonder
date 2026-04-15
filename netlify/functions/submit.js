export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = (body.message || '').trim();
  if (!message) {
    return Response.json({ error: 'Message is required.' }, { status: 400 });
  }

  const name = (body.name || '').trim() || 'Anonymous';

  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/letters`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ name, message: message.slice(0, 600) }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Supabase error:', text);
    return Response.json({ error: 'Database error.' }, { status: 500 });
  }

  return Response.json({ ok: true });
};
