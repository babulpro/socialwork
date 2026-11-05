import { proxyToBackend } from '@/lib/proxy';

export async function GET() {
  return proxyToBackend('/events/user/my-events', {
    requireAuth: true,
  });
}
