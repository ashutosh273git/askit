"use client";

import { useState } from "react";

export default function UserCard({ user }: any) {
  const [role, setRole] = useState(user.role);
  const [skills, setSkills] = useState(user.skills?.join(",") || "");

  const updateUser = async () => {
    await fetch("/api/admin/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        role,
        skills: skills.split(",").map((s: String) => s.trim()),
      }),
    });

    alert("Updated successfully");
  };

  return (
    <div className="border p-4 rounded-lg bg-zinc-900 text-white">
      <p><b>Email:</b> {user.email}</p>

      <div className="mt-2">
        <label>Role:</label>
        <select
          className="ml-2 text-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-2">
        <label>Skills:</label>
        <input
          className="ml-2 text-black px-2"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="react,node"
        />
      </div>

      <button
        onClick={updateUser}
        className="mt-3 px-4 py-2 bg-blue-600 rounded"
      >
        Update
      </button>
    </div>
  );
}
