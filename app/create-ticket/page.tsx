"use client";
import GoBackButton from "@/components/back-button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTicket() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/ticket/create-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Ticket created successfully");
      router.push("/dashboard");
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create Ticket</h1>
        <GoBackButton />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm text-gray-400">Title</label>
            <input
              type="text"
              required
              className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-600 rounded"
              placeholder="Bug in login..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              required
              rows={4}
              className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-600 rounded"
              placeholder="Explain the issue clearly..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
