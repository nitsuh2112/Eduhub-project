"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HelpCircle,
  PlayCircle,
  Search,
  Trophy,
  RotateCcw,
} from "lucide-react";

type QuizStatus = "Available" | "Completed";
type QuizDifficulty = "Easy" | "Medium" | "Hard";

type Quiz = {
  id: number;
  title: string;
  course: string;
  courseName: string;
  questions: number;
  duration: number;
  attempts: number;
  bestScore: number;
  status: QuizStatus;
  difficulty: QuizDifficulty;
};

const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    course: "CS401",
    courseName: "Artificial Intelligence",
    questions: 20,
    duration: 30,
    attempts: 2,
    bestScore: 85,
    status: "Available",
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "Search Algorithms Quiz",
    course: "CS401",
    courseName: "Artificial Intelligence",
    questions: 15,
    duration: 20,
    attempts: 1,
    bestScore: 92,
    status: "Completed",
    difficulty: "Hard",
  },
  {
    id: 3,
    title: "Supervised Learning",
    course: "CS402",
    courseName: "Machine Learning",
    questions: 25,
    duration: 35,
    attempts: 2,
    bestScore: 78,
    status: "Available",
    difficulty: "Medium",
  },
  {
    id: 4,
    title: "Model Evaluation",
    course: "CS402",
    courseName: "Machine Learning",
    questions: 20,
    duration: 25,
    attempts: 3,
    bestScore: 88,
    status: "Completed",
    difficulty: "Medium",
  },
  {
    id: 5,
    title: "Database Transactions",
    course: "CS403",
    courseName: "Advanced Database",
    questions: 20,
    duration: 30,
    attempts: 2,
    bestScore: 81,
    status: "Available",
    difficulty: "Hard",
  },
  {
    id: 6,
    title: "Query Optimization",
    course: "CS403",
    courseName: "Advanced Database",
    questions: 15,
    duration: 20,
    attempts: 1,
    bestScore: 95,
    status: "Completed",
    difficulty: "Hard",
  },
];

const courses = [
  { code: "ALL", name: "All Courses" },
  { code: "CS401", name: "Artificial Intelligence" },
  { code: "CS402", name: "Machine Learning" },
  { code: "CS403", name: "Advanced Database" },
];

const statuses = ["All Status", "Available", "Completed"];

export default function QuizzesPage() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredQuizzes = useMemo(() => {
    const value = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesSearch =
        !value ||
        quiz.title.toLowerCase().includes(value) ||
        quiz.course.toLowerCase().includes(value) ||
        quiz.courseName.toLowerCase().includes(value);

      const matchesCourse =
        selectedCourse === "ALL" || quiz.course === selectedCourse;

      const matchesStatus =
        selectedStatus === "All Status" ||
        quiz.status === selectedStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [search, selectedCourse, selectedStatus]);

  const availableCount = quizzes.filter(
    (quiz) => quiz.status === "Available"
  ).length;

  const completedCount = quizzes.filter(
    (quiz) => quiz.status === "Completed"
  ).length;

  const averageScore =
    quizzes.length > 0
      ? quizzes.reduce((total, quiz) => total + quiz.bestScore, 0) /
        quizzes.length
      : 0;

  const resetFilters = () => {
    setSearch("");
    setSelectedCourse("ALL");
    setSelectedStatus("All Status");
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/student/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#07192B]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
                <HelpCircle size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#07192B] sm:text-3xl">
                  Quizzes
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Test your knowledge and track your quiz performance
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs text-slate-500">Total Quizzes</p>
              <p className="mt-1 text-2xl font-bold text-[#07192B]">
                {quizzes.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section
          aria-label="Quiz summary"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <SummaryCard
            label="Total Quizzes"
            value={quizzes.length}
            icon={<HelpCircle size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            label="Available"
            value={availableCount}
            icon={<PlayCircle size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            label="Completed"
            value={completedCount}
            icon={<CheckCircle2 size={20} />}
            iconClass="bg-green-50 text-green-600"
          />

          <SummaryCard
            label="Average Score"
            value={`${averageScore.toFixed(0)}%`}
            icon={<Trophy size={20} />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        <section
          aria-label="Search and filter quizzes"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_260px_220px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search quizzes or course codes..."
                aria-label="Search quizzes"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-[#07192B] outline-none transition placeholder:text-slate-400 focus:border-[#D5AE48] focus:bg-white focus:ring-2 focus:ring-[#D5AE48]/20"
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              aria-label="Filter by course"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#07192B] outline-none transition focus:border-[#D5AE48] focus:bg-white"
            >
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code === "ALL"
                    ? course.name
                    : `${course.code} - ${course.name}`}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              aria-label="Filter by quiz status"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#07192B] outline-none transition focus:border-[#D5AE48] focus:bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {(search ||
            selectedCourse !== "ALL" ||
            selectedStatus !== "All Status") && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-[#07192B]">
                  {filteredQuizzes.length}
                </span>{" "}
                of {quizzes.length} quizzes
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#0E2A47] transition hover:bg-slate-100"
              >
                <RotateCcw size={15} />
                Reset filters
              </button>
            </div>
          )}
        </section>

        <section aria-label="Quiz list">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#07192B]">
                Your Quizzes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a quiz to start or review your result.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
              {filteredQuizzes.length} found
            </span>
          </div>

          {filteredQuizzes.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredQuizzes.map((quiz) => (
                <article
                  key={quiz.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#D5AE48] hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
                      <HelpCircle size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#0E2A47] px-2 py-1 text-[10px] font-bold text-[#D5AE48]">
                          {quiz.course}
                        </span>

                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                            quiz.status === "Completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {quiz.status}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-bold text-[#07192B] transition group-hover:text-[#9A761F]">
                        {quiz.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {quiz.courseName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <InfoBox
                      label="Questions"
                      value={quiz.questions.toString()}
                      icon={<HelpCircle size={15} />}
                    />

                    <InfoBox
                      label="Duration"
                      value={`${quiz.duration} min`}
                      icon={<Clock3 size={15} />}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[11px] text-slate-400">Best Score</p>
                      <p className="mt-1 text-lg font-bold text-[#0E2A47]">
                        {quiz.bestScore}%
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[11px] text-slate-400">Attempts</p>
                      <p className="mt-1 text-lg font-bold text-[#0E2A47]">
                        {quiz.attempts}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                      <p className="text-[11px] text-slate-400">Level</p>
                      <p
                        className={`mt-1 text-sm font-bold ${
                          quiz.difficulty === "Hard"
                            ? "text-red-600"
                            : quiz.difficulty === "Medium"
                              ? "text-amber-600"
                              : "text-green-600"
                        }`}
                      >
                        {quiz.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      href={
                        quiz.status === "Completed"
                          ? `/student/quizzes/${quiz.id}?mode=result`
                          : `/student/quizzes/${quiz.id}`
                      }
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#D5AE48] focus:ring-offset-2 ${
                        quiz.status === "Completed"
                          ? "border border-slate-200 text-[#0E2A47] hover:border-[#D5AE48] hover:bg-[#FFF9E8]"
                          : "bg-[#0E2A47] text-white hover:bg-[#07192B]"
                      }`}
                    >
                      {quiz.status === "Completed" ? (
                        <>
                          <CheckCircle2 size={17} />
                          View Result
                        </>
                      ) : (
                        <>
                          <PlayCircle size={17} />
                          Start Quiz
                        </>
                      )}
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <HelpCircle size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#07192B]">
                No Quizzes Found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or change the filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07192B]"
              >
                <RotateCcw size={16} />
                Show All Quizzes
              </button>
            </div>
          )}
        </section>

        <section className="pb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
              <BookOpen size={19} />
            </div>

            <div>
              <h2 className="font-bold text-[#07192B]">Course Quizzes</h2>
              <p className="text-xs text-slate-400">
                Access quizzes by course
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {courses
              .filter((course) => course.code !== "ALL")
              .map((course) => (
                <Link
                  key={course.code}
                  href={`/student/courses/${course.code}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D5AE48] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0E2A47] text-sm font-bold text-[#D5AE48]">
                        {course.code.substring(2)}
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#9A761F]">
                          {course.code}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-[#07192B]">
                          {course.name}
                        </h3>
                      </div>
                    </div>

                    <span className="text-slate-300 transition group-hover:text-[#D5AE48]">
                      <ChevronRight size={19} />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#07192B]">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-[#07192B]">{value}</p>
    </div>
  );
}