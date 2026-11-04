import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const all = await cookies();

  // Build a CLEAN Cookie header: name=value; name=value
  const cookieHeader = (await cookies())
  .getAll()
  .map((c) => `${c.name}=${c.value}`)   // 👈 explicit, no Path/Expires
  .join("; ");

  console.log("[proxy] sending cookie header:", cookieHeader.slice(0, 200) + "...");

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const res = await fetch("http://localhost:5000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[proxy] fetch to Express failed:", err);
    return NextResponse.json(
      { message: "Cannot reach backend server on port 5000" },
      { status: 502 }
    );
  }
}