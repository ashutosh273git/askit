import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
// import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("➡️ Update user API hit");

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    console.log("🧠 Session:", session);

    if (!session || session.user.role !== "admin") {
      console.log("❌ Unauthorized access");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { userId, role, skills } = await req.json();

    console.log("📦 Payload:", { userId, role, skills });

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role,
          skills
        },
      }
    );

    console.log("✅ Mongo Update Result:", result);

    return NextResponse.json({
      success: true,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error("🔥 UPDATE USER ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
