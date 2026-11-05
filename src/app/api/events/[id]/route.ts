import { proxyToBackend } from '@/lib/proxy';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/events/${id}`);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  return proxyToBackend(`/events/${id}`, {
    method: 'PUT',
    body,
    requireAuth: true,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/events/${id}`, {
    method: 'DELETE',
    requireAuth: true,
  });
}
