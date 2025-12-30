"use client";

import LogoutButton from "@/components/logout-button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Moderator Dashboard
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/all-tickets")}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium"
          >
            📋 View All Tickets
          </button>

          <button
            onClick={() => router.push("/your-tickets")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 transition text-white py-3 rounded-lg font-medium"
          >
            🧑‍💻 Assigned Tickets
          </button>
        </div>

        <div className="pt-4 border-t border-zinc-700">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
