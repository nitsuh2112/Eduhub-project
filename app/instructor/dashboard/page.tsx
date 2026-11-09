
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Users,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/instructor/mycourse", icon: BookOpen },
  { label: "Materials", href: "/instructor/materials", icon: FileText },
  { label: "Assignments", href: "/instructor/assignments", icon: ClipboardList },
  { label: "Quizzes & Exams", href: "/instructor/quizzes", icon: HelpCircle },
  { label: "Grading", href: "/instructor/grading", icon: BarChart3 },
  { label: "Student Performance", href: "#", icon: Users },
];

type Instructor = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
};

type Course = {
  id?: number;
  code?: string;
  title?: string;
  name?: string;
  students?: number;
  assignments?: number;
  progress?: number;
};

type Assignment = {
  id?: number;
  title: string;
  course?: string;
  submissions?: number;
  total?: number;
  due?: string;
  dueDate?: string;
};

type DashboardData = {
  success: boolean;
  message?: string;
  instructor: Instructor;
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalAssignments: number;
    pendingGrading: number;
    performance: number;
  };
  courses: Course[];
  recentAssignments: Assignment[];
};

export default function InstructorDashboard() {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load instructor dashboard from backend
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("eduhub_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        // apiRequest already includes the /api base URL and auth token.
        const data = await apiRequest("/instructor/dashboard");

        if (!data.success) {
          throw new Error(data.message || "Failed to load dashboard.");
        }

        setDashboard(data as DashboardData);
        setError("");
      } catch (err) {
        console.error("Dashboard error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "Unable to connect to the backend.";

        if (
          message.toLowerCase().includes("token") ||
          message.toLowerCase().includes("unauthorized")
        ) {
          localStorage.removeItem("eduhub_token");
          router.replace("/login");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("eduhub_token");
    router.push("/login");
  };

  const instructorName = dashboard?.instructor?.name || "Instructor";

  const initials = instructorName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = dashboard?.stats;

  return (
    <div className="min-h-screen bg-[#07192B] text-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0E2A47] px-5 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D5AE48] font-bold text-[#07192B]">
            E
          </div>
          <span className="text-xl font-bold">
            Edu<span className="text-[#D5AE48]">Hub</span>
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg border border-white/10 p-2 text-white"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
      </header>

      <div className="flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-[#0E2A47] transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:translate-x-0`}
        >
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D5AE48] text-xl font-bold text-[#07192B]">
              E
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Edu<span className="text-[#D5AE48]">Hub</span>
              </h1>
              <p className="text-xs text-[#B8C7D8]">Instructor Portal</p>
            </div>
          </div>

          {/* Profile */}
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#07192B]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold">{instructorName}</p>
                <p className="text-xs text-[#B8C7D8]">Instructor</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-[#D5AE48] font-semibold text-[#07192B]"
                      : "text-[#B8C7D8] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-5 left-4 right-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-[#B8C7D8] transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-screen flex-1">
          {/* Top Bar */}
          <header className="hidden h-20 items-center justify-between border-b border-white/10 bg-[#07192B] px-8 lg:flex">
            <div>
              <p className="text-sm text-[#B8C7D8]">Instructor Portal</p>
              <h2 className="text-xl font-bold">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative rounded-xl border border-white/10 p-3">
                <Bell size={18} />
              </div>

              <div className="h-9 w-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#07192B]">
                  {initials}
                </div>

                <div>
                  <p className="text-sm font-semibold">{instructorName}</p>
                  <p className="text-xs text-[#B8C7D8]">Instructor</p>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-5 lg:p-8">
            {/* Welcome */}
            <section className="mb-8">
              <p className="text-[#B8C7D8]">Welcome back,</p>

              <h1 className="mt-1 text-3xl font-bold lg:text-4xl">
                {instructorName} 👋
              </h1>

              <p className="mt-2 text-sm text-[#B8C7D8]">
                Manage your courses and monitor student learning.
              </p>
            </section>

            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-8 text-center">
                <p className="text-[#D5AE48]">Loading dashboard...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
                <h2 className="font-bold text-red-300">
                  Unable to load dashboard
                </h2>
                <p className="mt-2 text-sm text-[#B8C7D8]">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-[#D5AE48] px-4 py-2 text-sm font-bold text-[#07192B]"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Dashboard Data */}
            {!loading && !error && dashboard && (
              <>
                {/* Statistics */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Link
                    href="/instructor/mycourse"
                    className="block transition hover:opacity-90"
                  >
                    <StatCard
                      title="My Courses"
                      value={stats?.totalCourses ?? 0}
                      icon="📚"
                    />
                  </Link>

                  <StatCard
                    title="Total Students"
                    value={stats?.totalStudents ?? 0}
                    icon="👥"
                  />

                  <Link
                    href="/instructor/assignments"
                    className="block transition hover:opacity-90"
                  >
                    <StatCard
                      title="Assignments"
                      value={stats?.totalAssignments ?? 0}
                      icon="📝"
                    />
                  </Link>

                  <StatCard
                    title="Pending Grading"
                    value={stats?.pendingGrading ?? 0}
                    icon="✓"
                  />
                </section>

                {/* Performance and Quick Actions */}
                <section className="mt-6 grid gap-6 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">
                          Student Performance
                        </h2>
                        <p className="mt-1 text-sm text-[#B8C7D8]">
                          Overall performance across your courses
                        </p>
                      </div>

                      <span className="text-2xl font-bold text-[#D5AE48]">
                        {stats?.performance ?? 0}%
                      </span>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#07192B]">
                      <div
                        className="h-full rounded-full bg-[#D5AE48]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, stats?.performance ?? 0)
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-4 text-xs text-[#B8C7D8]">
                      Performance data provided by the backend.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-2xl border border-[#D5AE48]/30 bg-[#0E2A47] p-6">
                    <h2 className="text-lg font-bold">Quick Actions</h2>

                    <div className="mt-5 space-y-3">
                      <Link
                        href="/instructor/assignments"
                        className="block w-full rounded-xl bg-[#D5AE48] px-4 py-3 text-left text-sm font-bold text-[#07192B] transition hover:bg-[#E0BE61]"
                      >
                        + Create Assignment
                      </Link>

                      <Link
                        href="/instructor/materials"
                        className="block w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:bg-white/5"
                      >
                        + Upload Material
                      </Link>

                      <Link
                        href="/instructor/quizzes"
                        className="block w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:bg-white/5"
                      >
                        + Create Quiz
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Courses */}
                <section className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">My Courses</h2>
                      <p className="mt-1 text-sm text-[#B8C7D8]">
                        Courses you currently teach
                      </p>
                    </div>

                    <Link
                      href="/instructor/mycourse"
                      className="text-sm font-semibold text-[#D5AE48] transition hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  {dashboard.courses?.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-3">
                      {dashboard.courses.map((course, index) => (
                        <CourseCard
                          key={course.id ?? course.code ?? index}
                          course={course}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyMessage message="No courses are available yet." />
                  )}
                </section>

                {/* Assignments */}
                <section className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">
                        Recent Assignments
                      </h2>
                      <p className="mt-1 text-sm text-[#B8C7D8]">
                        Monitor submissions and grading
                      </p>
                    </div>

                    <Link
                      href="/instructor/assignments"
                      className="text-sm font-semibold text-[#D5AE48] transition hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E2A47]">
                    <div className="hidden grid-cols-5 border-b border-white/10 px-5 py-4 text-xs font-semibold text-[#B8C7D8] md:grid">
                      <span>Assignment</span>
                      <span>Course</span>
                      <span>Submissions</span>
                      <span>Due Date</span>
                      <span>Action</span>
                    </div>

                    {dashboard.recentAssignments?.length > 0 ? (
                      dashboard.recentAssignments.map((assignment, index) => (
                        <div
                          key={assignment.id ?? assignment.title ?? index}
                          className="grid gap-3 border-b border-white/10 px-5 py-4 last:border-0 md:grid-cols-5 md:items-center"
                        >
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                          </div>

                          <span className="text-sm text-[#B8C7D8]">
                            {assignment.course || "—"}
                          </span>

                          <span className="text-sm">
                            {assignment.submissions ?? 0} /{" "}
                            {assignment.total ?? 0}
                          </span>

                          <span className="text-sm text-[#D5AE48]">
                            {assignment.due || assignment.dueDate || "—"}
                          </span>

                          <Link
                            href="/instructor/assignments"
                            className="inline-block w-fit rounded-lg border border-white/10 px-3 py-1.5 text-center text-sm transition hover:bg-white/5"
                          >
                            View
                          </Link>
                        </div>
                      ))
                    ) : (
                      <EmptyMessage message="No assignments are available yet." />
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#B8C7D8]">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-8 text-center">
      <p className="text-sm text-[#B8C7D8]">{message}</p>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const progress = Math.min(100, Math.max(0, course.progress ?? 0));

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-5 transition hover:-translate-y-1 hover:border-[#D5AE48]/40">
      <span className="rounded-lg bg-[#07192B] px-3 py-1 text-xs font-semibold text-[#D5AE48]">
        {course.code || "Course"}
      </span>

      <h3 className="mt-5 min-h-[52px] text-lg font-bold">
        {course.title || course.name || "Untitled course"}
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#07192B] p-3">
          <p className="text-xs text-[#B8C7D8]">Students</p>
          <p className="mt-1 font-bold">{course.students ?? 0}</p>
        </div>

        <div className="rounded-xl bg-[#07192B] p-3">
          <p className="text-xs text-[#B8C7D8]">Assignments</p>
          <p className="mt-1 font-bold">{course.assignments ?? 0}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-[#B8C7D8]">Course progress</span>
          <span className="text-[#D5AE48]">{progress}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#07192B]">
          <div
            className="h-full rounded-full bg-[#D5AE48]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        href="/instructor/mycourse"
        className="mt-5 block w-full rounded-xl border border-white/10 py-2.5 text-center text-sm font-semibold transition hover:bg-white/5"
      >
        Manage Course
      </Link>
    </div>
  );
}
