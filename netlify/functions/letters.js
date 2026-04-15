// Netlify serverless function — GET /api/letters?password=...
// Returns all letters if the correct password is supplied.
// Password and Supabase credentials live in Netlify env vars only.

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(req.url);
  const password = url.searchParams.get('password') || '';

  if (password !== process.env.VIEW_PASSWORD) {
    return Response.json({ error: 'Wrong password.' }, { status: 403 });
  }

  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/letters?select=*&order=created_at.desc`,
    {
      headers: {
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error('Supabase error:', text);
    return Response.json({ error: 'Database error.' }, { status: 500 });
  }

  const letters = await res.json();
  return Response.json(letters);
};

export const config = { path: '/api/letters' };
