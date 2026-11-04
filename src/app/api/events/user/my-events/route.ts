import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://mysocial-omega.vercel.app/api';

export async function GET() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return NextResponse.json({ success: true, count: 0, events: [] });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/events/user/my-events`, {
      headers: {
        'x-user-id': session.user.id,
        'x-user-email': session.user.email,
        'x-user-name': session.user.name,
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({ success: true, count: 0, events: [] }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: true, count: 0, events: [] });
  }
}
