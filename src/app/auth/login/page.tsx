"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi, User } from "../../../lib/authEndpoints";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginApi({ email, password });

      if (data.user) {
        const safeUser: User = data.user; // ignore password
        localStorage.setItem("user", JSON.stringify(safeUser));
        setMessage("Login successful");
        router.push("/dashboard");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Login failed");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#0A192F]">
          Login
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0A192F]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 text-sm text-[#0A192F] shadow-inner focus:border-[#64FFDA] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0A192F]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 text-sm text-[#0A192F] shadow-inner focus:border-[#64FFDA] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#64FFDA] px-4 py-3 font-semibold text-[#0A192F] shadow-lg transition hover:bg-[#52e0c4]"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-[#021024]">{message}</p>
        )}

        <div className="mt-6 flex justify-between text-sm text-[#0A192F]">
          <Link href="/" className="hover:underline">
            Back to Homepage
          </Link>
          <Link href="/auth/register" className="hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
