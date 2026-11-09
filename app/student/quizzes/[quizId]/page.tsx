"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function QuizDetailPage() {
  const params = useParams<{ quizId: string }>();

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">
          Quiz Details
        </h1>

        <p className="mt-4 text-lg">
          Quiz ID: {params.quizId}
        </p>

        <Link
          href="/student/quizzes"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white"
        >
          Back to Quizzes
        </Link>
      </div>
    </main>
  );
}