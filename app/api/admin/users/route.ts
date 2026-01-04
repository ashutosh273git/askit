export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      console.log("❌ No session found");
      return Response.json({ error: "No session" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      console.log("❌ Not admin:", session.user.role);
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await db.collection("user").find({}).toArray();

    return Response.json(users);
  } catch (error: any) {
    console.error("🔥 ADMIN API ERROR:", error);

    return Response.json(
      {
        error: "Internal Server Error",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
