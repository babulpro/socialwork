import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function forward(req: Request, id: string, method: "POST" | "DELETE") {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`http://localhost:5000/events/${id}/join`, {
      method,
      headers: { cookie: cookieHeader },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`[proxy ${method} join] failed:`, err);
    return NextResponse.json(
      { message: "Cannot reach backend server" },
      { status: 502 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return forward(req, (await params).id, "POST");
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return forward(req, (await params).id, "DELETE");
}