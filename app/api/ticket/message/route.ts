import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
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

    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return NextResponse.json(
        { error: "ticketId is required" },
        { status: 400 }
      );
    }

    const messages = await Message.find({ ticketId } as any).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET MESSAGE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, message } = await req.json();

    if (!ticketId || !message) {
      return NextResponse.json(
        { error: "ticketId and message are required" },
        { status: 400 }
      );
    }

    const allowedRoles = ["user", "moderator", "admin"];

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    const newMessage = await Message.create({
      ticketId,
      message,
      senderId: session.user.id,
      senderRole: session.user.role,
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
