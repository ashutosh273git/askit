"use client";

import { useEffect, useState } from "react";

export default function TicketChat({ ticketId }: { ticketId: string }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/ticket/message?ticketId=${ticketId}`)
      .then(res => res.json())
      .then(setMessages);
  }, [ticketId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/ticket/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: ticketId,
        message: text,
      }),
    });

    setText("");

    const res = await fetch(`/api/ticket/message?ticketId=${ticketId}`);
    setMessages(await res.json());
  };

  return (
    <div className="mt-6 bg-zinc-900 p-4 rounded">
      <h2 className="font-semibold mb-3">💬 Conversation</h2>

      <div className="space-y-2 max-h-75 overflow-y-auto">
        {messages.map((m: any) => (
          <div
            key={m._id}
            className={`p-2 rounded ${
              m.senderRole === "admin"
                ? "bg-red-600/20"
                : m.senderRole === "moderator"
                ? "bg-blue-600/20"
                : "bg-zinc-800"
            }`}
          >
            {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-zinc-800 p-2 rounded"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
