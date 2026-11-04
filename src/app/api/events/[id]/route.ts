import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function forward(req: Request, id: string, method: "PATCH" | "DELETE") {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const body = method === "PATCH" ? await req.text() : undefined;

  try {
    const res = await fetch(`http://localhost:5000/events/${id}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`[proxy ${method}] fetch failed:`, err);
    return NextResponse.json(
      { message: "Cannot reach backend server on port 5000" },
      { status: 502 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return forward(req, (await params).id, "PATCH");
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return forward(req, (await params).id, "DELETE");
}