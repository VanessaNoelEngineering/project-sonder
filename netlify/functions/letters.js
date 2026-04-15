export default async (req) => {
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
