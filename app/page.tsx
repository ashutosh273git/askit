import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-900 to-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        {/* Logo / Title */}
        <h1 className="text-5xl font-bold mb-4">
          Ask<span className="text-blue-500">It</span>
        </h1>

        {/* Tagline */}
        <p className="text-zinc-400 text-lg mb-10">
          Ask questions. Get AI-powered answers.  
          Get help from real moderators.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-8 py-3 rounded-lg border border-zinc-600 hover:bg-zinc-800 transition font-semibold"
          >
            Login
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-zinc-500 mt-10">
          Powered by AI • Built for curiosity
        </p>
      </div>
    </main>
  );
}
