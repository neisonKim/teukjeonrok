/** Server-only storage adapter. Called exclusively by app/api/metrics/route.ts. */
export async function recordMetric(event: string, target: string) {
  const baseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !key) throw new Error('Metrics storage is not configured.');
  const url = new URL('/rest/v1/rpc/increment_metric', baseUrl);
  if (url.protocol !== 'https:') throw new Error('Metrics storage requires HTTPS.');
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: key };
  // New sb_secret keys use apikey. Legacy service_role JWTs also use Bearer auth.
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
  const response = await fetch(url, {
    method: 'POST', headers,
    body: JSON.stringify({ metric_day: day, metric_event: event, metric_target: target }),
    cache: 'no-store', signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('Metrics storage request failed.');
}
