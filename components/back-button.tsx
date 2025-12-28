"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard")}
      className="
        mb-6
        flex items-center gap-2
        px-4 py-2
        rounded-md
        bg-zinc-800
        border border-zinc-700
        text-sm text-white
        hover:bg-zinc-700
        hover:border-zinc-500
        transition
        shadow-sm
      "
    >
      ← Back to Dashboard
    </button>
  );
}
