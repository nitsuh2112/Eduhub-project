"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Bell,
  Menu,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Award,
  Building2,
} from "lucide-react";

/* ──────────────────────────── sidebar menu ──────────────────────────── */
const menuItems = [
  { label: "Dashboard", href: "/dean/dashboard", icon: LayoutDashboard },
  { label: "Departments", href: "#", icon: Building2 },
  { label: "Faculty", href: "#", icon: Users },
  { label: "Programs", href: "#", icon: BookOpen },
  { label: "Students", href: "#", icon: GraduationCap },
  { label: "Reports & Analytics", href: "#", icon: BarChart3 },
  { label: "Documents", href: "#", icon: FileText },
  { label: "Settings", href: "#", icon: Settings },
];

/* ──────────────────────────── mock data ──────────────────────────── */
const departments = [
  {
    name: "Computer Science",
    head: "Dr. Abebe Tessema",
    faculty: 18,
    students: 420,
    avgGpa: 3.24,
    trend: "up" as const,
    courses: 32,
  },
  {
    name: "Information Technology",
    head: "Dr. Sara Mulatu",
    faculty: 14,
    students: 380,
    avgGpa: 3.11,
    trend: "up" as const,
    courses: 28,
  },
  {
    name: "Software Engineering",
    head: "Dr. Kidane Worku",
    faculty: 12,
    students: 310,
    avgGpa: 3.35,
    trend: "up" as const,
    courses: 24,
  },
  {
    name: "Information Systems",
    head: "Dr. Hana Bekele",
    faculty: 10,
    students: 260,
    avgGpa: 2.98,
    trend: "down" as const,
    courses: 20,
  },
];

const recentActivities = [
  {
    text: "New curriculum proposal submitted by Computer Science Dept.",
    time: "2 hours ago",
    type: "info" as const,
  },
  {
    text: "Faculty meeting scheduled for Oct 28, 2026",
    time: "4 hours ago",
    type: "event" as const,
  },
  {
    text: "Grade report finalized for Spring 2026 semester",
    time: "Yesterday",
    type: "success" as const,
  },
  {
    text: "Student complaint #1247 requires review",
    time: "Yesterday",
    type: "warning" as const,
  },
  {
    text: "Budget allocation approved for Q3 2026",
    time: "2 days ago",
    type: "success" as const,
  },
  {
    text: "3 faculty promotion requests pending",
    time: "3 days ago",
    type: "warning" as const,
  },
];

const topFaculty = [
  { name: "Dr. Abebe Tessema", dept: "Computer Science", rating: 4.8, courses: 4, publications: 12 },
  { name: "Dr. Sara Mulatu", dept: "Information Technology", rating: 4.7, courses: 3, publications: 9 },
  { name: "Dr. Meron Tadesse", dept: "Software Engineering", rating: 4.6, courses: 3, publications: 15 },
  { name: "Dr. Dawit Haile", dept: "Computer Science", rating: 4.5, courses: 5, publications: 8 },
];

const pendingApprovals = [
  { title: "New Course: AI & Machine Learning", dept: "Computer Science", date: "Oct 22", type: "Course" },
  { title: "Faculty Leave Request — Dr. Meron", dept: "Software Eng.", date: "Oct 20", type: "Leave" },
  { title: "Lab Equipment Purchase", dept: "IT Department", date: "Oct 18", type: "Budget" },
  { title: "Student Exchange Program", dept: "All Departments", date: "Oct 15", type: "Program" },
];

/* ══════════════════════════════════════════════════════════════════════ */
/* MAIN COMPONENT                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
export default function DeanDashboard() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07192B] text-white">
      {/* ─── Mobile Header ─── */}
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
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── Sidebar ─── */}
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
              <p className="text-xs text-[#B8C7D8]">Dean Portal</p>
            </div>
          </div>

          {/* Profile */}
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#07192B]">
                TG
              </div>
              <div>
                <p className="font-semibold">Dr. Teshome G.</p>
                <p className="text-xs text-[#B8C7D8]">Dean of Computing</p>
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
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
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
            <Link
              href="/login"
              className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-[#B8C7D8] transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="min-h-screen flex-1">
          {/* Top Bar */}
          <header className="hidden h-20 items-center justify-between border-b border-white/10 bg-[#07192B] px-8 lg:flex">
            <div>
              <p className="text-sm text-[#B8C7D8]">Dean Portal</p>
              <h2 className="text-xl font-bold">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-xl border border-white/10 p-3 hover:bg-white/5">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D5AE48]" />
              </button>

              <div className="h-9 w-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#07192B]">
                  TG
                </div>
                <div>
                  <p className="text-sm font-semibold">Dr. Teshome G.</p>
                  <p className="text-xs text-[#B8C7D8]">Dean of Computing</p>
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
                Dr. Teshome 👋
              </h1>
              <p className="mt-2 text-sm text-[#B8C7D8]">
                Here&apos;s an overview of your college&apos;s performance and activities.
              </p>
            </section>

            {/* ─── Statistics Cards ─── */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                title="Total Students"
                value="1,370"
                icon="🎓"
                change="+8.2%"
                trend="up"
              />
              <StatCard
                title="Faculty Members"
                value="54"
                icon="👨‍🏫"
                change="+3"
                trend="up"
              />
              <StatCard
                title="Active Courses"
                value="104"
                icon="📚"
                change="+12"
                trend="up"
              />
              <StatCard
                title="Avg. GPA"
                value="3.18"
                icon="📊"
                change="-0.04"
                trend="down"
              />
            </section>

            {/* ─── Department Overview + Quick Actions ─── */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Department Overview */}
              <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Department Overview</h2>
                    <p className="mt-1 text-sm text-[#B8C7D8]">
                      Performance across all departments
                    </p>
                  </div>
                  <button className="text-sm font-semibold text-[#D5AE48] transition hover:underline">
                    View Details
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {departments.map((dept) => (
                    <div
                      key={dept.name}
                      className="rounded-xl border border-white/5 bg-[#07192B] p-4 transition hover:border-[#D5AE48]/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{dept.name}</h3>
                          <p className="mt-0.5 text-xs text-[#B8C7D8]">
                            Head: {dept.head}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {dept.trend === "up" ? (
                            <TrendingUp size={14} className="text-emerald-400" />
                          ) : (
                            <TrendingDown size={14} className="text-red-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              dept.trend === "up"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {dept.avgGpa}
                          </span>
                          <span className="text-xs text-[#B8C7D8]">GPA</span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-bold">{dept.faculty}</p>
                          <p className="text-xs text-[#B8C7D8]">Faculty</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{dept.students}</p>
                          <p className="text-xs text-[#B8C7D8]">Students</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{dept.courses}</p>
                          <p className="text-xs text-[#B8C7D8]">Courses</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions + Pending */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="rounded-2xl border border-[#D5AE48]/30 bg-[#0E2A47] p-6">
                  <h2 className="text-lg font-bold">Quick Actions</h2>

                  <div className="mt-5 space-y-3">
                    <button className="w-full rounded-xl bg-[#D5AE48] px-4 py-3 text-left text-sm font-bold text-[#07192B] transition hover:bg-[#E0BE61]">
                      📋 Review Pending Approvals
                    </button>
                    <button className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:bg-white/5">
                      📊 Generate Semester Report
                    </button>
                    <button className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:bg-white/5">
                      📅 Schedule Faculty Meeting
                    </button>
                    <button className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:bg-white/5">
                      📝 Curriculum Review
                    </button>
                  </div>
                </div>

                {/* Semester Progress */}
                <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6">
                  <h2 className="text-lg font-bold">Semester Progress</h2>
                  <p className="mt-1 text-sm text-[#B8C7D8]">
                    Fall 2026 — Week 8 of 16
                  </p>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-[#B8C7D8]">Overall completion</span>
                      <span className="font-bold text-[#D5AE48]">50%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[#07192B]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D5AE48] to-[#E0BE61]"
                        style={{ width: "50%" }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniStat label="Weeks Left" value="8" />
                    <MiniStat label="Exams In" value="6 wks" />
                  </div>
                </div>
              </div>
            </section>

            {/* ─── Top Faculty + Pending Approvals ─── */}
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Top Faculty */}
              <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Top Faculty</h2>
                    <p className="mt-1 text-sm text-[#B8C7D8]">
                      Highest-rated instructors this semester
                    </p>
                  </div>
                  <Award size={20} className="text-[#D5AE48]" />
                </div>

                <div className="mt-5 space-y-3">
                  {topFaculty.map((faculty, i) => (
                    <div
                      key={faculty.name}
                      className="flex items-center gap-4 rounded-xl bg-[#07192B] p-4 transition hover:border hover:border-[#D5AE48]/30"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D5AE48]/20 text-sm font-bold text-[#D5AE48]">
                        #{i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold">{faculty.name}</p>
                        <p className="text-xs text-[#B8C7D8]">{faculty.dept}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#D5AE48]">
                          ⭐ {faculty.rating}
                        </p>
                        <p className="text-xs text-[#B8C7D8]">
                          {faculty.publications} pubs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Pending Approvals</h2>
                    <p className="mt-1 text-sm text-[#B8C7D8]">
                      Items requiring your attention
                    </p>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D5AE48] text-xs font-bold text-[#07192B]">
                    {pendingApprovals.length}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {pendingApprovals.map((item) => (
                    <div
                      key={item.title}
                      className="group flex items-center justify-between rounded-xl bg-[#07192B] p-4 transition hover:border hover:border-[#D5AE48]/30 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              item.type === "Course"
                                ? "bg-blue-500/20 text-blue-400"
                                : item.type === "Leave"
                                ? "bg-amber-500/20 text-amber-400"
                                : item.type === "Budget"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-xs text-[#B8C7D8]">
                            {item.date}
                          </span>
                        </div>
                        <p className="mt-1.5 truncate text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#B8C7D8]">{item.dept}</p>
                      </div>

                      <ChevronRight
                        size={16}
                        className="ml-3 shrink-0 text-[#B8C7D8] transition group-hover:text-[#D5AE48]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─── Recent Activity ─── */}
            <section className="mt-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <p className="mt-1 text-sm text-[#B8C7D8]">
                  Latest updates across the college
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E2A47]">
                {recentActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 border-b border-white/5 px-5 py-4 last:border-0 transition hover:bg-white/[0.02]"
                  >
                    <div className="mt-0.5 shrink-0">
                      {activity.type === "success" ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : activity.type === "warning" ? (
                        <AlertTriangle size={18} className="text-amber-400" />
                      ) : activity.type === "event" ? (
                        <Clock size={18} className="text-blue-400" />
                      ) : (
                        <FileText size={18} className="text-[#B8C7D8]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.text}</p>
                    </div>

                    <span className="shrink-0 text-xs text-[#B8C7D8]">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/* SUB-COMPONENTS                                                        */
/* ══════════════════════════════════════════════════════════════════════ */

function StatCard({
  title,
  value,
  icon,
  change,
  trend,
}: {
  title: string;
  value: string;
  icon: string;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-5 transition hover:-translate-y-1 hover:border-[#D5AE48]/30">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#B8C7D8]">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>

      <div className="mt-2 flex items-center gap-1">
        {trend === "up" ? (
          <TrendingUp size={12} className="text-emerald-400" />
        ) : (
          <TrendingDown size={12} className="text-red-400" />
        )}
        <span
          className={`text-xs font-medium ${
            trend === "up" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {change}
        </span>
        <span className="text-xs text-[#B8C7D8]">vs last sem.</span>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#07192B] p-4">
      <p className="text-xs text-[#B8C7D8]">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}