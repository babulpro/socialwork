import { proxyToBackend } from '@/lib/proxy';

export async function GET(req: Request) {
  const url = new URL(req.url);
  return proxyToBackend(`/events${url.search}`);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
  return proxyToBackend('/events', {
    method: 'POST',
    body,
    requireAuth: true,
  });
}
