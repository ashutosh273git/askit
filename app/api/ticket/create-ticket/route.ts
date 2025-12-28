import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        await connectDB()

        const session = await auth.api.getSession({
            headers: await headers()
        })

        console.log(session)
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const body =await req.json()

        const {title, description, priority} = body

        if(!title || !description){
            return NextResponse.json(
                {error: "Title and description required"},
                {status: 400}
            )
        }

        const ticket = await Ticket.create({
            title,
            description,
            priority: priority || "medium",
            createdBy: session.user.id,
            status: "TODO"
        })

        return NextResponse.json(ticket, {status: 201})

    } catch (error) {
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}