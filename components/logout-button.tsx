"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
