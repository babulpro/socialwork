import { proxyToBackend } from '@/lib/proxy';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/events/${id}/join`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/events/${id}/leave`, {
    method: 'POST',
    requireAuth: true,
  });
}
