
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Brain,
  Bell,
  ChevronRight,
  TrendingUp,
  Clock3,
  CheckCircle2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

/* ============================================================
   TYPES
============================================================ */

type Course = {
  code: string;
  title: string;
  instructor?: string;
  progress?: number;
  grade?: string;
  color?: string;
};

type Assignment = {
  title: string;
  course: string;
  due: string;
  status: string;
};

type DashboardData = {
  student: {
    id: number | string;
    name: string;
    email: string;
    role: string;
  };
  stats: {
    enrolledCourses: number;
    inProgress: number;
    assignments: number;
    academicProgress: number;
  };
  courses: Course[];
  recentAssignments: Assignment[];
  academicInsight: {
    riskLevel: string;
    performanceForecast: string;
    learningProgress: number;
    weakArea: string | null;
    recommendationCount: number;
  };
  progress: {
    totalCourses: number;
    completedCourses: number;
    remainingCourses: number;
    completionPercentage: number;
  };
  recommendations?: unknown[];
};

const courseColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-emerald-500",
];

/* ============================================================
   STUDENT DASHBOARD
============================================================ */

export default function StudentDashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD DASHBOARD FROM BACKEND
  ============================================================ */

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("eduhub_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const data = await apiRequest("/student/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.student) {
          throw new Error("Student information was not returned by the server.");
        }

        setDashboard(data as DashboardData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load student dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  /* ============================================================
     LOGOUT
  ============================================================ */

  function handleLogout() {
    localStorage.removeItem("eduhub_token");
    localStorage.removeItem("eduhub_user");
    router.replace("/login");
  }

  /* ============================================================
     DATA
  ============================================================ */

  const studentName = dashboard?.student?.name || "Student";
  const initials = studentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const courses = (dashboard?.courses || []).map((course, index) => ({
    ...course,
    progress: course.progress ?? 0,
    instructor: course.instructor || "Not assigned",
    grade: course.grade || "N/A",
    color: course.color || courseColors[index % courseColors.length],
  }));

  const assignments = dashboard?.recentAssignments || [];

  const stats = dashboard?.stats;
  const progress = dashboard?.progress;
  const insight = dashboard?.academicInsight;

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#D5AE48]" />
          <p className="font-semibold text-[#0E2A47]">
            Loading your dashboard...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <X size={28} />
          </div>

          <h2 className="text-xl font-bold text-[#0E2A47]">
            Unable to Load Dashboard
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#D5AE48] px-5 py-3 font-bold text-[#07192B] hover:bg-[#E0BE61]"
            >
              Try Again
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN DASHBOARD
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* MOBILE SIDEBAR OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================================================
          SIDEBAR
      ============================================================ */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#0E2A47] text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/student/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="block"
          >
            <h1 className="text-2xl font-bold tracking-wide">
              EduHub
            </h1>

            <p className="text-xs text-slate-300">
              Learning Management System
            </p>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* PROFILE */}

        <div className="border-b border-white/10 p-5">
          <Link
            href="/student/profile"
            onClick={() => setSidebarOpen(false)}
            className="group flex items-center gap-3 rounded-xl p-1 transition hover:bg-white/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#0E2A47]">
              {initials || "ST"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold group-hover:text-[#D5AE48]">
                {studentName}
              </p>

              <p className="text-xs text-slate-300">
                Student
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <SidebarItem
            href="/student/dashboard"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            active
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/courses"
            icon={<BookOpen size={19} />}
            label="My Courses"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/browse-courses"
            icon={<GraduationCap size={19} />}
            label="Browse Courses"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/materials"
            icon={<BookOpen size={19} />}
            label="Materials"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/assignments"
            icon={<ClipboardList size={19} />}
            label="Assignments"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/quizzes"
            icon={<CheckCircle2 size={19} />}
            label="Quizzes"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/grades"
            icon={<TrendingUp size={19} />}
            label="Grades"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            href="/student/ai-recommendations"
            icon={<Brain size={19} />}
            label="AI Recommendations"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        {/* LOGOUT */}

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="lg:ml-72">

        {/* TOPBAR */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg font-bold md:text-xl">
                Student Dashboard
              </h2>

              <p className="hidden text-sm text-slate-500 sm:block">
                Track your academic progress and learning activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              className="relative rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <Link
              href="/student/profile"
              className="hidden items-center gap-2 sm:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E2A47] text-sm font-bold text-white">
                {initials || "ST"}
              </div>

              <span className="max-w-36 truncate text-sm font-semibold hover:text-[#D5AE48]">
                {studentName}
              </span>
            </Link>
          </div>
        </header>

        {/* ============================================================
            CONTENT
        ============================================================ */}

        <div className="p-4 md:p-8">

          {/* WELCOME */}

          <section className="mb-7 rounded-2xl bg-gradient-to-r from-[#0E2A47] to-[#174A75] p-6 text-white shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-sm text-blue-100">
                  Welcome back 👋
                </p>

                <h1 className="text-2xl font-bold md:text-3xl">
                  Hello, {studentName}!
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                  Keep up your learning progress. Track your courses
                  and upcoming academic activities here.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Overall Academic Progress
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {stats?.academicProgress ?? 0}%
                </p>

                <div className="mt-3 flex items-center gap-1 text-xs text-green-200">
                  <TrendingUp size={14} />
                  Your learning journey
                </div>
              </div>
            </div>
          </section>

          {/* STAT CARDS */}

          <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              title="Enrolled Courses"
              value={String(stats?.enrolledCourses ?? 0)}
              subtitle="This semester"
              icon={<BookOpen size={21} />}
            />

            <StatCard
              title="In Progress"
              value={String(stats?.inProgress ?? 0)}
              subtitle="Active courses"
              icon={<TrendingUp size={21} />}
            />

            <StatCard
              title="Assignments"
              value={String(stats?.assignments ?? 0)}
              subtitle="Pending tasks"
              icon={<ClipboardList size={21} />}
            />

            <StatCard
              title="Academic Progress"
              value={`${stats?.academicProgress ?? 0}%`}
              subtitle="Overall completion"
              icon={<GraduationCap size={21} />}
            />
          </section>

          {/* MAIN GRID */}

          <div className="grid gap-6 xl:grid-cols-3">

            {/* COURSES */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    My Courses
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your current semester courses
                  </p>
                </div>

                <Link
                  href="/student/courses"
                  className="flex items-center gap-1 text-sm font-semibold text-[#0E2A47] transition hover:text-[#D5AE48]"
                >
                  View all
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Link
                      key={course.code}
                      href={`/student/courses/${course.code}`}
                      className="group block rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-[#D5AE48] hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${course.color} text-sm font-bold text-white`}
                          >
                            {course.code.substring(2)}
                          </div>

                          <div>
                            <p className="text-sm font-bold transition group-hover:text-[#D5AE48]">
                              {course.title}
                            </p>

                            <p className="text-xs text-slate-500">
                              {course.code} • {course.instructor}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="min-w-32">
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="text-slate-500">
                                Progress
                              </span>

                              <span className="font-semibold">
                                {course.progress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#D5AE48] transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, course.progress)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          <span className="rounded-lg bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                            {course.grade}
                          </span>

                          <ChevronRight
                            size={18}
                            className="text-slate-300 transition group-hover:text-[#D5AE48]"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    message="No enrolled courses are available yet."
                  />
                )}
              </div>
            </section>

            {/* AI INSIGHT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    AI Academic Insight
                  </h3>

                  <p className="text-sm text-slate-500">
                    Current learning analysis
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                  <Brain size={20} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2 text-[#0E2A47]">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-[#0E2A47]">
                      {insight?.riskLevel || "Not evaluated"}
                    </p>

                    <p className="text-xs text-slate-600">
                      Academic risk assessment
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <InsightRow
                  label="Performance Forecast"
                  value={insight?.performanceForecast || "Not available"}
                />

                <InsightRow
                  label="Learning Progress"
                  value={`${insight?.learningProgress ?? 0}%`}
                />

                <InsightRow
                  label="Weak Area"
                  value={insight?.weakArea || "Not identified"}
                />

                <InsightRow
                  label="Recommendations"
                  value={String(insight?.recommendationCount ?? 0)}
                />
              </div>

              <Link
                href="/student/ai-recommendations"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E2A47] py-3 text-sm font-semibold text-white transition hover:bg-[#123A5F]"
              >
                <Brain size={17} />
                View AI Analysis
              </Link>
            </section>
          </div>

          {/* LOWER GRID */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* ASSIGNMENTS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    Upcoming Assignments
                  </h3>

                  <p className="text-sm text-slate-500">
                    Tasks that need your attention
                  </p>
                </div>

                <Link
                  href="/student/assignments"
                  className="rounded-xl p-2 transition hover:bg-slate-50"
                >
                  <ClipboardList
                    className="text-[#0E2A47]"
                    size={21}
                  />
                </Link>
              </div>

              <div className="space-y-3">
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <Link
                      key={`${assignment.title}-${index}`}
                      href="/student/assignments"
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#D5AE48] hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-lg bg-white p-2 shadow-sm">
                          <ClipboardList
                            size={17}
                            className="text-[#0E2A47]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {assignment.title}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {assignment.course}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="flex items-center justify-end gap-1 text-xs font-semibold text-slate-600">
                          <Clock3 size={13} />
                          {assignment.due}
                        </p>

                        <p
                          className={`mt-1 text-xs font-semibold ${
                            assignment.status === "Submitted"
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {assignment.status}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    message="No recent assignments are available."
                  />
                )}
              </div>
            </section>

            {/* PROGRESS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-bold">
                  Academic Progress
                </h3>

                <p className="text-sm text-slate-500">
                  Your overall semester progress
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-4">
                <div
                  className="relative flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-slate-100"
                  style={{
                    background: `conic-gradient(#D5AE48 ${
                      Math.min(
                        100,
                        Math.max(0, progress?.completionPercentage ?? 0)
                      ) * 3.6
                    }deg, transparent 0deg)`,
                    backgroundClip: "content-box",
                  }}
                >
                  <div className="absolute inset-[-14px] rounded-full border-[14px] border-slate-100 -z-10" />

                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0E2A47]">
                      {progress?.completionPercentage ?? 0}%
                    </p>

                    <p className="text-xs text-slate-500">
                      Completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <ProgressItem
                  label="Courses"
                  value={String(progress?.totalCourses ?? 0)}
                />

                <ProgressItem
                  label="Completed"
                  value={String(progress?.completedCourses ?? 0)}
                />

                <ProgressItem
                  label="Remaining"
                  value={String(progress?.remainingCourses ?? 0)}
                />
              </div>
            </section>
          </div>

          {/* AI RECOMMENDATION */}

          <section className="mt-6 overflow-hidden rounded-2xl bg-[#0E2A47] p-5 text-white shadow-sm md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D5AE48] text-[#0E2A47]">
                  <Brain size={24} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D5AE48]">
                    AI Recommendation
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Personalized learning guidance
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                    {insight?.weakArea
                      ? `Your learning analysis has identified ${insight.weakArea} as an area that may need additional study.`
                      : "Your personalized learning recommendations will appear here when available."}
                  </p>
                </div>
              </div>

              <Link
                href="/student/ai-recommendations"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-5 py-3 text-sm font-bold text-[#0E2A47] transition hover:bg-[#E0BE61]"
              >
                Explore Recommendations
                <ChevronRight size={17} />
              </Link>
            </div>
          </section>

          {/* FOOTER */}

          <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            EduHub Learning Management System © 2026
          </footer>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SIDEBAR ITEM
============================================================ */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-[#D5AE48] text-[#0E2A47]"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#0E2A47]">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-2.5 text-[#0E2A47]">
          {icon}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

/* ============================================================
   INSIGHT ROW
============================================================ */

function InsightRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="text-right font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   PROGRESS ITEM
============================================================ */

function ProgressItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-lg font-bold text-[#0E2A47]">
        {value}
      </p>

      <p className="text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <BookOpen className="mx-auto mb-2 text-slate-400" size={25} />

      <p className="text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}
