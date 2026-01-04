export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    const tickets = await Ticket.find().sort({ createdAt: -1 });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
