import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {searchParams} = new URL(req.url)
    const role = searchParams.get("role")

    const filter = role === "moderator"
    ? {assignedTo: session.user.id}
    : {createdBy: session.user.id}

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
