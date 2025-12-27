import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db();

export async function GET() {
  const session = await auth.api.getSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await db.collection("users").find().toArray()

  return NextResponse.json(users)
}
