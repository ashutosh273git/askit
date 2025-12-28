import { auth } from "@/lib/auth";
import Ticket from "@/models/Ticket";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if(!session){
        return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        )
    }

    const tickets = await Ticket.find({
        createdBy: session.user.id
    }).sort({createdAt: -1})

    return NextResponse.json(tickets, {status: 200})
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}