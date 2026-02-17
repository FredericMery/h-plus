import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ⚠️ Mets TON user id ici pour le test
  const userId = "COLLE_TON_USER_ID_ICI";

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title: "🔥 Test direct",
    message: "Insertion directe OK",
    read: false,
  });

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ ok: true });
}
