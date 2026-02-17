import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {

  const cronHeader = req.headers.get("x-vercel-cron");
  if (cronHeader !== "1") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const currentHour = now.getHours();

  const { data: users } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("daily_summary", true);

  if (!users) return NextResponse.json({ ok: true });

  for (const user of users) {

    if (user.summary_hour !== currentHour) continue;

    const today = now.toISOString().split("T")[0];

    const { data: alreadySent } = await supabase
      .from("daily_summaries_log")
      .select("*")
      .eq("user_id", user.user_id)
      .gte("sent_at", today);

    if (alreadySent && alreadySent.length > 0) continue;

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.user_id)
      .eq("archived", false);

    const pro = tasks?.filter(t => t.type === "pro").length || 0;
    const perso = tasks?.filter(t => t.type === "perso").length || 0;

    const overdue =
      tasks?.filter(
        t => t.deadline && new Date(t.deadline) < now
      ).length || 0;

    await supabase.from("notifications").insert({
      user_id: user.user_id,
      type: "summary",
      title: "📊 Résumé quotidien",
      message: `${pro} PRO • ${perso} PERSO • ${overdue} en retard`,
      read: false,
    });

    await supabase.from("daily_summaries_log").insert({
      user_id: user.user_id,
    });
  }

  return NextResponse.json({ ok: true });
}
