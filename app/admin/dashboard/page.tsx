"use client";

import { useState } from "react";

const menuItems = [
  "Dashboard",
  "Users",
  "Courses",
  "Departments",
  "Enrollments",
  "Reports",
  "System Monitoring",
];

const recentUsers = [
  {
    name: "Nitsuh Tigu",
    email: "nitsuh@example.com",
    role: "Student",
    status: "Active",
  },
  {
    name: "Fitsumkal Dagnachew",
    email: "fitsumkal@example.com",
    role: "Instructor",
    status: "Active",
  },
  {
    name: "Rekik Legese",
    email: "rekik@example.com",
    role: "Student",
    status: "Active",
  },
  {
    name: "Daniel Abraham",
    email: "daniel@example.com",
    role: "Instructor",
    status: "Pending",
  },
];

const departments = [
  {
    name: "Computer Science",
    students: 186,
    instructors: 18,
    courses: 24,
  },
  {
    name: "Software Engineering",
    students: 154,
    instructors: 15,
    courses: 21,
  },
  {
    name: "Information Technology",
    students: 128,
    instructors: 12,
    courses: 18,
  },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          className="rounded-lg border border-white/10 px-3 py-2"
        >
          ☰
        </button>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#0E2A47] transition-transform duration-300 ${
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

              <p className="text-xs text-[#B8C7D8]">
                Administration
              </p>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#07192B]">
                AD
              </div>

              <div>
                <p className="font-semibold">
                  System Admin
                </p>

                <p className="text-xs text-[#B8C7D8]">
                  Administrator
                </p>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              const active = activeMenu === item;

              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveMenu(item);

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
                  <span>{getIcon(item)}</span>
                  {item}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-5 left-4 right-4">
            <button className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-[#B8C7D8] hover:bg-white/5 hover:text-white">
              ↪ Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-screen flex-1">

          {/* Desktop Topbar */}
          <header className="hidden h-20 items-center justify-between border-b border-white/10 bg-[#07192B] px-8 lg:flex">

            <div>
              <p className="text-sm text-[#B8C7D8]">
                Administration
              </p>

              <h2 className="text-xl font-bold">
                Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-4">

              <button className="relative rounded-xl border border-white/10 p-3 hover:bg-white/5">
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D5AE48]" />
              </button>

              <div className="h-9 w-px bg-white/10" />

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#07192B]">
                  AD
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    System Admin
                  </p>

                  <p className="text-xs text-[#B8C7D8]">
                    Administrator
                  </p>
                </div>

              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-5 lg:p-8">

            {/* Welcome */}
            <section className="mb-8">
              <p className="text-[#B8C7D8]">
                System overview
              </p>

              <h1 className="mt-1 text-3xl font-bold lg:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm text-[#B8C7D8]">
                Manage EduHub users, courses, enrollments and system
                activity.
              </p>
            </section>

            {/* Statistics */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">

              <StatCard
                title="Total Users"
                value="1,248"
                icon="👥"
              />

              <StatCard
                title="Students"
                value="1,080"
                icon="🎓"
              />

              <StatCard
                title="Instructors"
                value="142"
                icon="👨‍🏫"
              />

              <StatCard
                title="Courses"
                value="63"
                icon="📚"
              />

            </section>

            {/* System Overview */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6 lg:col-span-2">

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      System Activity
                    </h2>

                    <p className="mt-1 text-sm text-[#B8C7D8]">
                      Current EduHub platform status
                    </p>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    System Online
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                  <MiniCard
                    label="Active Users"
                    value="936"
                  />

                  <MiniCard
                    label="Enrollments"
                    value="2,481"
                  />

                  <MiniCard
                    label="Assignments"
                    value="384"
                  />

                  <MiniCard
                    label="Materials"
                    value="527"
                  />

                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-6">

                <h2 className="text-lg font-bold">
                  System Security
                </h2>

                <p className="mt-1 text-sm text-[#B8C7D8]">
                  Security and access overview
                </p>

                <div className="mt-6 space-y-4">

                  <SecurityItem
                    title="Authentication"
                    status="Protected"
                  />

                  <SecurityItem
                    title="Role-Based Access"
                    status="Enabled"
                  />

                  <SecurityItem
                    title="API Security"
                    status="Protected"
                  />

                  <SecurityItem
                    title="Database"
                    status="Connected"
                  />

                </div>
              </div>

            </section>

            {/* User Management */}
            <section className="mt-8">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    Recent Users
                  </h2>

                  <p className="mt-1 text-sm text-[#B8C7D8]">
                    Recently registered EduHub accounts
                  </p>
                </div>

                <button className="rounded-xl bg-[#D5AE48] px-4 py-2.5 text-sm font-bold text-[#07192B]">
                  + Add User
                </button>

              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E2A47]">

                <div className="hidden grid-cols-4 border-b border-white/10 px-5 py-4 text-xs font-semibold text-[#B8C7D8] md:grid">
                  <span>User</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                {recentUsers.map((user) => (
                  <div
                    key={user.email}
                    className="grid gap-3 border-b border-white/10 px-5 py-4 last:border-0 md:grid-cols-4 md:items-center"
                  >

                    <div>
                      <p className="font-medium">
                        {user.name}
                      </p>

                      <p className="mt-1 text-xs text-[#B8C7D8]">
                        {user.email}
                      </p>
                    </div>

                    <span className="text-sm text-[#B8C7D8]">
                      {user.role}
                    </span>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {user.status}
                    </span>

                    <button className="w-fit rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
                      Manage
                    </button>

                  </div>
                ))}

              </div>
            </section>

            {/* Departments */}
            <section className="mt-8">

              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  Departments
                </h2>

                <p className="mt-1 text-sm text-[#B8C7D8]">
                  Academic department overview
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">

                {departments.map((department) => (
                  <DepartmentCard
                    key={department.name}
                    department={department}
                  />
                ))}

              </div>
            </section>

            {/* Admin Actions */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ActionCard
                icon="👥"
                title="Manage Users"
                description="Manage accounts and roles"
              />

              <ActionCard
                icon="📚"
                title="Manage Courses"
                description="Create and manage courses"
              />

              <ActionCard
                icon="📊"
                title="View Reports"
                description="Academic and system reports"
              />

              <ActionCard
                icon="⚙"
                title="System Settings"
                description="Configure platform settings"
              />

            </section>

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
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-5">

      <div className="flex items-start justify-between">

        <p className="text-sm text-[#B8C7D8]">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>

      </div>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function MiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#07192B] p-4">
      <p className="text-xs text-[#B8C7D8]">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}

function SecurityItem({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#07192B] p-3">

      <span className="text-sm">
        {title}
      </span>

      <span className="text-xs font-semibold text-green-400">
        ✓ {status}
      </span>

    </div>
  );
}

function DepartmentCard({
  department,
}: {
  department: {
    name: string;
    students: number;
    instructors: number;
    courses: number;
  };
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E2A47] p-5">

      <h3 className="font-bold">
        {department.name}
      </h3>

      <div className="mt-5 grid grid-cols-3 gap-2">

        <div className="rounded-xl bg-[#07192B] p-3">
          <p className="text-xs text-[#B8C7D8]">
            Students
          </p>

          <p className="mt-1 font-bold">
            {department.students}
          </p>
        </div>

        <div className="rounded-xl bg-[#07192B] p-3">
          <p className="text-xs text-[#B8C7D8]">
            Instructors
          </p>

          <p className="mt-1 font-bold">
            {department.instructors}
          </p>
        </div>

        <div className="rounded-xl bg-[#07192B] p-3">
          <p className="text-xs text-[#B8C7D8]">
            Courses
          </p>

          <p className="mt-1 font-bold">
            {department.courses}
          </p>
        </div>

      </div>

      <button className="mt-5 w-full rounded-xl border border-white/10 py-2.5 text-sm font-semibold hover:bg-white/5">
        View Department
      </button>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button className="rounded-2xl border border-white/10 bg-[#0E2A47] p-5 text-left transition hover:-translate-y-1 hover:border-[#D5AE48]/40">

      <span className="text-2xl">
        {icon}
      </span>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs text-[#B8C7D8]">
        {description}
      </p>

    </button>
  );
}

function getIcon(item: string) {
  const icons: Record<string, string> = {
    Dashboard: "⌂",
    Users: "👥",
    Courses: "📚",
    Departments: "▦",
    Enrollments: "✓",
    Reports: "▤",
    "System Monitoring": "◉",
  };

  return icons[item] ?? "•";
}