
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          password,
          confirmPassword,
        }),
      });

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07192B] px-4 py-10 text-white">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-[#0E2A47] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Create <span className="text-[#D5AE48]">Account</span>
            </h1>
            <p className="mt-2 text-sm text-[#B8C7D8]">
              Join EduHub
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none focus:border-[#D5AE48]"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none focus:border-[#D5AE48]"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none focus:border-[#D5AE48]"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>

            <input
              type="password"
              placeholder="Password (at least 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none focus:border-[#D5AE48]"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none focus:border-[#D5AE48]"
            />

            {error && (
              <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#D5AE48] py-3.5 font-bold text-[#07192B] hover:bg-[#E0BE61] disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#B8C7D8]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D5AE48]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
