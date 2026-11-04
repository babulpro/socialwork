import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://mysocial-omega.vercel.app/api';

async function forwardJoin(req: Request, id: string, method: 'POST' | 'DELETE') {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized. Please sign in to join events.' }, { status: 401 });
  }

  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  // If DELETE method, call the backend leave endpoint
  const endpoint = method === 'DELETE' ? `${BACKEND_URL}/events/${id}/leave` : `${BACKEND_URL}/events/${id}/join`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': session.user.id,
        'x-user-email': session.user.email,
        'x-user-name': session.user.name,
        cookie: cookieHeader,
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error(`[proxy ${method} join] failed:`, err);
    return NextResponse.json({ message: 'Cannot reach backend server', error: err.message }, { status: 502 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardJoin(req, id, 'POST');
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardJoin(req, id, 'DELETE');
}
