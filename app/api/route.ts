import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    connectDB()
  return NextResponse.json(
    {
      status: 200,
      message: "Hello"
    },
    // {
    //     success: true,
    //     message: "db connected"
    // }
  );
}
