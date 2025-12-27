import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db();

export async function POST() {
  const session = await auth.api.getSession();
  if (!session) return NextResponse.json({});

  await db.collection("users").updateOne(
    { _id: new ObjectId(session.user.id) },
    {
      $setOnInsert: {
        role: "user",
        skills: [],
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
