import { NextRequest, NextResponse } from "next/server";
import { sendPushToUser } from "@/lib/push";

export async function POST(req: NextRequest) {
  const { userId, title, message } = await req.json();

  await sendPushToUser(userId, { title, message });

  return NextResponse.json({ ok: true });
}
