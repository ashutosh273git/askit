// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import LogoutButton from "../../components/logout-button";
// import { headers } from "next/headers";

// export default async function DashboardPage() {

//   // const reqHeaders = await headers();

//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   if (!session) {
//     redirect("/login");
//   }
//   if(session.user.role === "admin"){
//     redirect("/admin")
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
//       <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}</h1>

//       <p className="text-zinc-400 mb-6">{session.user.email}</p>


//       <LogoutButton />


//     </div>
//   );
// }

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import LogoutButton from "@/components/logout-button";
import DashboardButton from "@/components/dashboard-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {session.user.name}
      </h1>

      <p className="text-zinc-400 mb-8">
        {session.user.email}
      </p>

      {/* Buttons */}
      <div className="grid md:grid-cols-3 gap-4 w-full max-w-3xl">
        <DashboardButton
          label="➕ Create Ticket"
          href="/create-ticket"
          variant="primary"
        />

        <DashboardButton
          label="📋 All Tickets"
          href="/all-tickets"
          variant="secondary"
        />

        <DashboardButton
          label="👤 Your Tickets"
          href="/your-tickets"
          variant="secondary"
        />
      </div>

      {/* Logout */}
      <div className="mt-10">
        <LogoutButton />
      </div>
    </div>
  );
}
