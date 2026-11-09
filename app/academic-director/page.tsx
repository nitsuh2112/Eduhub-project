"use client";

import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";

const departments = [
  {
    name: "Software Engineering",
    students: 428,
    performance: 84,
    trend: "+6.2%",
  },
  {
    name: "Computer Science",
    students: 512,
    performance: 81,
    trend: "+4.8%",
  },
  {
    name: "Information Technology",
    students: 365,
    performance: 78,
    trend: "+3.5%",
  },
  {
    name: "Information Systems",
    students: 294,
    performance: 76,
    trend: "+2.9%",
  },
];

const activities = [
  {
    title: "Semester academic review completed",
    department: "Computer Science",
    time: "2 hours ago",
    type: "review",
  },
  {
    title: "12 students identified as academically at risk",
    department: "Software Engineering",
    time: "5 hours ago",
    type: "warning",
  },
  {
    title: "Course performance report submitted",
    department: "Information Technology",
    time: "Yesterday",
    type: "report",
  },
  {
    title: "Department performance improved",
    department: "Information Systems",
    time: "Yesterday",
    type: "success",
  },
];

export default function AcademicDirectorDashboard() {
  return (
    <DashboardLayout
      title="Academic Director Dashboard"
      description="Monitor academic performance, departments, and institutional progress"
      role="academic-director"
    >
      <div className="space-y-7">
        {/* HEADER */}
        <section>
          <div>
            <p className="text-sm font-medium text-[#B18A25]">
              Academic Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#07192B] md:text-3xl">
              Academic Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor academic performance across departments, identify
              students who need support, and review institutional progress.
            </p>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            title="Total Students"
            value="1,599"
            subtitle="+8.4% this semester"
            icon={<Users size={21} />}
            trend="up"
          />

          <StatCard
            title="Active Courses"
            value="86"
            subtitle="Across departments"
            icon={<BookOpen size={21} />}
            trend="neutral"
          />

          <StatCard
            title="Departments"
            value="4"
            subtitle="Academic departments"
            icon={<Building2 size={21} />}
            trend="neutral"
          />

          <StatCard
            title="Academic Performance"
            value="80.2%"
            subtitle="+4.3% this semester"
            icon={<GraduationCap size={21} />}
            trend="up"
          />
        </section>

        {/* MAIN ANALYTICS */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* DEPARTMENT PERFORMANCE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#07192B]">
                  Department Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Academic performance by department
                </p>
              </div>

              <div className="rounded-xl bg-[#0E2A47]/5 p-2.5 text-[#0E2A47]">
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="space-y-5">
              {departments.map((department) => (
                <DepartmentRow
                  key={department.name}
                  department={department}
                />
              ))}
            </div>
          </section>

          {/* AI INSIGHT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#07192B]">
                  AI Academic Insight
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Institutional analysis
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                <Brain size={20} />
              </div>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="font-bold text-green-800">
                    Stable Academic Performance
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-700">
                    Overall academic performance is showing a positive trend.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <InsightRow
                label="Performance Forecast"
                value="Positive"
              />

              <InsightRow
                label="Overall Performance"
                value="80.2%"
              />

              <InsightRow
                label="At-Risk Students"
                value="47"
              />

              <InsightRow
                label="Improvement Areas"
                value="Database"
              />

              <InsightRow
                label="Departments Improving"
                value="4 / 4"
              />
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E2A47] py-3 text-sm font-semibold text-white transition hover:bg-[#123A5F]"
            >
              <Brain size={17} />
              View AI Analytics
            </button>
          </section>
        </div>

        {/* LOWER SECTION */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* AT RISK STUDENTS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#07192B]">
                  Academic Risk Monitoring
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Students requiring academic attention
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <AlertTriangle size={20} />
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Students At Risk
                  </p>

                  <p className="mt-1 text-xs text-amber-700">
                    Requires academic intervention
                  </p>
                </div>

                <p className="text-3xl font-bold text-amber-700">
                  47
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <RiskRow
                department="Computer Science"
                count="14"
              />

              <RiskRow
                department="Software Engineering"
                count="12"
              />

              <RiskRow
                department="Information Technology"
                count="11"
              />

              <RiskRow
                department="Information Systems"
                count="10"
              />
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-[#0E2A47] transition hover:bg-slate-50"
            >
              View Academic Risk Report
              <ChevronRight size={16} />
            </button>
          </section>

          {/* SEMESTER PROGRESS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#07192B]">
                Semester Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current academic semester overview
              </p>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[15px] border-slate-100">
                <div className="absolute inset-[-15px] rounded-full border-[15px] border-[#D5AE48] border-r-transparent border-b-transparent rotate-[-35deg]" />

                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0E2A47]">
                    68%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Semester Completed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <ProgressItem
                label="Weeks"
                value="11"
              />

              <ProgressItem
                label="Completed"
                value="68%"
              />

              <ProgressItem
                label="Remaining"
                value="5"
              />
            </div>
          </section>
        </div>

        {/* RECENT ACTIVITIES */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#07192B]">
                Recent Academic Activities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest academic management activities
              </p>
            </div>

            <button
              type="button"
              className="hidden items-center gap-1 text-sm font-semibold text-[#0E2A47] sm:flex"
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityRow
                key={activity.title}
                activity={activity}
              />
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#07192B]">
              Academic Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Frequently used academic management tools
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              icon={<BarChart3 size={21} />}
              title="Academic Reports"
              description="Review institutional reports"
            />

            <QuickAction
              icon={<Users size={21} />}
              title="Student Performance"
              description="Monitor student outcomes"
            />

            <QuickAction
              icon={<BookOpen size={21} />}
              title="Course Performance"
              description="Analyze course results"
            />

            <QuickAction
              icon={<Brain size={21} />}
              title="AI Analytics"
              description="View AI-powered insights"
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          EduHub Learning Management System © 2026
        </footer>
      </div>
    </DashboardLayout>
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
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0E2A47]">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-[#D5AE48]/15 p-2.5 text-[#B18A25]">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs">
        {trend === "up" && (
          <TrendingUp
            size={13}
            className="text-green-600"
          />
        )}

        {trend === "down" && (
          <TrendingDown
            size={13}
            className="text-red-600"
          />
        )}

        <span
          className={
            trend === "up"
              ? "text-green-600"
              : trend === "down"
                ? "text-red-600"
                : "text-slate-400"
          }
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   DEPARTMENT ROW
============================================================ */

function DepartmentRow({
  department,
}: {
  department: {
    name: string;
    students: number;
    performance: number;
    trend: string;
  };
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#07192B]">
            {department.name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {department.students} students
          </p>
        </div>

        <div className="flex items-center gap-4 sm:w-1/2">
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-500">
                Performance
              </span>

              <span className="font-semibold text-[#0E2A47]">
                {department.performance}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#D5AE48]"
                style={{
                  width: `${department.performance}%`,
                }}
              />
            </div>
          </div>

          <span className="whitespace-nowrap text-xs font-semibold text-green-600">
            {department.trend}
          </span>
        </div>
      </div>
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
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   RISK ROW
============================================================ */

function RiskRow({
  department,
  count,
}: {
  department: string;
  count: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">
        {department}
      </span>

      <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
        {count} students
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
   ACTIVITY ROW
============================================================ */

function ActivityRow({
  activity,
}: {
  activity: {
    title: string;
    department: string;
    time: string;
    type: string;
  };
}) {
  const icon =
    activity.type === "warning" ? (
      <AlertTriangle size={17} />
    ) : activity.type === "success" ? (
      <CheckCircle2 size={17} />
    ) : activity.type === "report" ? (
      <BookOpen size={17} />
    ) : (
      <BarChart3 size={17} />
    );

  const iconClass =
    activity.type === "warning"
      ? "bg-amber-50 text-amber-600"
      : activity.type === "success"
        ? "bg-green-50 text-green-600"
        : "bg-[#0E2A47]/5 text-[#0E2A47]";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#07192B]">
          {activity.title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {activity.department}
        </p>
      </div>

      <span className="hidden whitespace-nowrap text-xs text-slate-400 sm:block">
        {activity.time}
      </span>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#D5AE48] hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D5AE48]/15 text-[#B18A25] transition group-hover:bg-[#D5AE48] group-hover:text-[#07192B]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#07192B]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
}