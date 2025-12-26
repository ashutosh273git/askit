"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email(
      {
        email: form.email,
        password: form.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
          console.error(error);
        },
      }
    );
  };

  const handleGoogleLogin = async() => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    })
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-900 to-black">
      <div className="w-full max-w-md bg-zinc-900 text-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back 👋</h1>

        <p className="text-center text-zinc-400 mb-6">Login to continue</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 mb-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200"
        >
          Continue with Google
        </button>
        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-4">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-white cursor-pointer underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
