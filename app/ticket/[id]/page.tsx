import GoBackButton from "@/components/back-button";
import connectDB, { db } from "@/lib/db";
import Ticket from "@/models/Ticket";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import TicketChat from "./TicketChat";

export default async function TicketPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return notFound();

  const { id } = await params;
  const ticket = await Ticket.findById(id);
  if (!ticket) return notFound();

  let assignedUser = null;
  if (ticket.assignedTo) {
    assignedUser = await db.collection("user").findOne({
      _id: new ObjectId(ticket.assignedTo),
    });
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <GoBackButton />

      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">{ticket.title}</h1>

        <p className="text-sm text-zinc-400 mb-6">
          Created on {new Date(ticket.createdAt).toLocaleDateString()}
        </p>

        {/* Status */}
        <div className="flex gap-4 mb-6">
          <span className="px-3 py-1 rounded bg-blue-600/20 text-blue-400">
            {ticket.status}
          </span>
          <span className="px-3 py-1 rounded bg-yellow-600/20 text-yellow-400">
            Priority: {ticket.priority}
          </span>
        </div>

        {/* Description */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-zinc-300">{ticket.description}</p>
        </div>

        {/* AI Answer */}
        {ticket.aiAnswer && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">
              🤖 AI Suggested Solution
            </h2>
            <pre className="whitespace-pre-wrap bg-zinc-950 text-zinc-200 p-4 rounded-md text-sm overflow-x-auto">{ticket.aiAnswer}</pre>
          </div>
        )}

        {/* Assigned To */}
        <div className="text-sm text-zinc-400 mb-8">
          Assigned to:{" "}
          {assignedUser ? (
            <span className="text-white font-medium">{assignedUser.name}</span>
          ) : (
            <span className="italic text-zinc-500">Not assigned yet</span>
          )}
        </div>

        {/* 🔥 CHAT SECTION */}
        <TicketChat ticketId={ticket._id.toString()} />
      </div>
    </div>
  );
}
