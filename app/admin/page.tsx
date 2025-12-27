"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserCard from "@/components/usercard";
import LogoutButton from "@/components/logout-button";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [users, setUsers] = useState([]);

  // 🔒 Protect route
  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== "admin")) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // 📦 Fetch users
  useEffect(() => {
    if ((session?.user as any)?.data?.role === "admin") {
      fetch("/api/admin/users")
        .then(res => res.json())
        .then(setUsers);
    }
  }, [session]);

  if (isPending) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="space-y-4">
        {users.map((user: any) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user.name}</h1>
      
            <p className="text-zinc-400 mb-6">{session?.user.email}</p>
      
            <LogoutButton />
          </div>
    </div>
  );
}
