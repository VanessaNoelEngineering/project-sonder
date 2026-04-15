export default async () => {
  const url  = process.env.SUPABASE_URL;
  const key  = process.env.SUPABASE_KEY;
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  };

  // Get all IDs to pick a random one
  const idsRes = await fetch(`${url}/rest/v1/letters?select=id`, { headers });
  if (!idsRes.ok) return Response.json({ empty: true });

  const ids = await idsRes.json();
  if (!ids.length) return Response.json({ empty: true });

  const randomId = ids[Math.floor(Math.random() * ids.length)].id;

  const letterRes = await fetch(
    `${url}/rest/v1/letters?id=eq.${randomId}&select=id,name,message,created_at&limit=1`,
    { headers }
  );
  if (!letterRes.ok) return Response.json({ empty: true });

  const [letter] = await letterRes.json();
  return Response.json(letter ?? { empty: true });
};
