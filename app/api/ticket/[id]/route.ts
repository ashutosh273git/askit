import { NextResponse } from "next/server";
import connectDB, { db } from "@/lib/db";
import Ticket from "@/models/Ticket";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const ticket = await Ticket.findById(params.id);

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // let assignedUser = null
    // if(ticket.assignedTo){
    //     assignedUser = await db.collection("user").findOne({
    //         _id: new ObjectId(ticket.assignedTo)
    //     })
    // }

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}
