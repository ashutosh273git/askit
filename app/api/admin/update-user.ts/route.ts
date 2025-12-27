import { auth } from "@/lib/auth";
import { success } from "better-auth";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db();

export async function POST(req: Request) {
  const session = await auth.api.getSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, role, skills } = await req.json();

  await db.collection("users").updateOne(
    { _id: userId },
    {
      $set: {
        role,
        skills,
      },
    }
  );

  return NextResponse.json({ success: true });
}
