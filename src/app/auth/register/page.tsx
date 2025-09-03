"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register as registerApi, User } from "../../../lib/authEndpoints";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const data = await registerApi({ name, email, password });

      if (data.user) {
        const safeUser: User = data.user; // exclude password
        localStorage.setItem("user", JSON.stringify(safeUser));
        setMessage("Registration successful");
        router.push("/dashboard");
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Registration failed");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#0A192F]">
          Register
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#0A192F]"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 text-sm text-[#0A192F] shadow-inner focus:border-[#64FFDA] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-[#0A192F]"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm"
              placeholder="********"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 text-sm text-[#0A192F] shadow-inner focus:border-[#64FFDA] focus:outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#64FFDA] px-4 py-3 font-semibold text-[#0A192F] shadow-lg transition hover:bg-[#52e0c4]"
          >
            Create Account
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-[#021024]">{message}</p>
        )}

        <div className="mt-6 flex justify-between text-sm text-[#0A192F]">
          <Link href="/" className="hover:underline">
            Back to Homepage
          </Link>
          <Link href="/auth/login" className="hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </main>
  );
}
