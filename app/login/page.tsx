
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type UserRole = "student" | "instructor";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          role,
        }),
      });

      const token = data.token || data.accessToken;
      const user = data.user || data.data?.user;

      if (!token) {
        throw new Error("Login response has no token.");
      }

      const actualRole = user?.role || role;

      if (actualRole !== "student" && actualRole !== "instructor") {
        throw new Error("Unsupported account role.");
      }

      localStorage.setItem("eduhub_token", token);
      localStorage.setItem(
        "eduhub_user",
        JSON.stringify(user || { email, role: actualRole })
      );

      if (actualRole === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/instructor/dashboard");
      }
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
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-[#0E2A47] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5AE48] text-2xl font-bold text-[#07192B]">
              E
            </div>
            <h1 className="text-3xl font-bold">
              Edu<span className="text-[#D5AE48]">Hub</span>
            </h1>
            <p className="mt-2 text-sm text-[#B8C7D8]">
              Welcome back
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none placeholder:text-gray-500 focus:border-[#D5AE48]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none placeholder:text-gray-500 focus:border-[#D5AE48]"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium">
                Account Type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-white/10 bg-[#07192B] px-4 py-3 outline-none focus:border-[#D5AE48]"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#D5AE48] py-3.5 font-bold text-[#07192B] transition hover:bg-[#E0BE61] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#B8C7D8]">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#D5AE48] hover:underline"
            >
              Create account
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-[#B8C7D8] hover:text-white"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
