export default async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    console.error('Missing env vars: SUPABASE_URL or SUPABASE_KEY');
    return Response.json({ empty: true });
  }

  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  };

  const idsRes = await fetch(`${url}/rest/v1/letters?select=id`, { headers });
  if (!idsRes.ok) {
    const text = await idsRes.text();
    console.error('Failed to fetch IDs:', idsRes.status, text);
    return Response.json({ empty: true });
  }

  const ids = await idsRes.json();
  console.log('Letter count:', ids.length);
  if (!ids.length) return Response.json({ empty: true });

  const randomId = ids[Math.floor(Math.random() * ids.length)].id;

  const letterRes = await fetch(
    `${url}/rest/v1/letters?id=eq.${randomId}&select=id,name,message,created_at&limit=1`,
    { headers }
  );
  if (!letterRes.ok) {
    const text = await letterRes.text();
    console.error('Failed to fetch letter:', letterRes.status, text);
    return Response.json({ empty: true });
  }

  const [letter] = await letterRes.json();
  return Response.json(letter ?? { empty: true });
};
