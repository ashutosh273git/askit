"use client";

import LogoutButton from "@/components/logout-button";
import { Key, useEffect, useState } from "react";

type User = {
  _id: string;
  id: string;
  email: string;
  role?: string;
  skills?: string[];
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("USERS:", data);
        setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateUser = async (userId: string) => {
    const skills =
      skillInput[userId]
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    await fetch("/api/admin/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        role: "moderator",
        skills,
      }),
    });

    alert("User updated!");

    // refresh list
    const res = await fetch("/api/admin/users");
    setUsers(await res.json());
  };

  if (loading) {
    return (
      <div className="p-10 text-white">
        <h1 className="text-xl">Loading Admin Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-sm text-gray-400">
                    Role: {user.role || "user"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Skills: {user.skills?.join(", ") || "None"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  placeholder="react, node, mongo"
                  className="bg-zinc-800 border border-zinc-600 px-3 py-2 rounded w-full"
                  onChange={(e) =>
                    setSkillInput({
                      ...skillInput,
                      [user._id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => updateUser(user._id)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Make Moderator
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
