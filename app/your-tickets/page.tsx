"use client";

import { useEffect, useState } from "react";

type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
};

export default function GetAllTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ticket/get-your-tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Your Tickets</h1>

      {loading ? (
        <p className="text-gray-400">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-400">No tickets found</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {ticket.title}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {ticket.description}
                  </p>
                </div>

                <div className="text-right">
                  <span className="block text-blue-400 text-sm">
                    {ticket.status}
                  </span>
                  <span className="block text-yellow-400 text-sm">
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Created:{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
