import GoBackButton from "@/components/back-button";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

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

  const {id} = await params
  const ticket = await Ticket.findById(id);

  if (!ticket) return notFound();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <GoBackButton />

      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          {ticket.title}
        </h1>

        {/* Meta */}
        <p className="text-sm text-zinc-400 mb-6">
          Created on{" "}
          {new Date(ticket.createdAt).toLocaleDateString()}
        </p>

        {/* Status & Priority */}
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
          <h2 className="text-lg font-semibold mb-2">
            Description
          </h2>
          <p className="text-zinc-300">
            {ticket.description}
          </p>
        </div>

        {/* AI Summary */}
        {ticket.summary && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">
              🤖 AI Summary
            </h2>
            <p className="text-zinc-300">
              {ticket.summary}
            </p>
          </div>
        )}

        {/* AI Answer */}
        {ticket.aiAnswer && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">
              💡 AI Suggested Solution
            </h2>
            <p className="text-zinc-300">
              {ticket.aiAnswer}
            </p>
          </div>
        )}

        {/* Skills */}
        {ticket.relatedSkills?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Related Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {ticket.relatedSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded bg-zinc-800 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Assigned To */}
        <div className="text-sm text-zinc-400">
          Assigned To:{" "}
          {ticket.assignedTo || "Not assigned yet"}
        </div>
      </div>
    </div>
  );
}
