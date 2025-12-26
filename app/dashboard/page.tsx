import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/logout-button";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const reqHeaders = await headers(); // ✅ MUST await

  const session = await auth.api.getSession({
    headers: reqHeaders, // ✅ now correct type
  });
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}</h1>

      <p className="text-zinc-400 mb-6">{session.user.email}</p>

      <LogoutButton />
    </div>
  );
}
