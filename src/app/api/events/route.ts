import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://mysocial-omega.vercel.app/api';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/events${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ message: 'Cannot reach backend server', error: err.message }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': session.user.id,
        'x-user-email': session.user.email,
        'x-user-name': session.user.name,
        cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ message: 'Cannot reach backend server', error: err.message }, { status: 502 });
  }
}
