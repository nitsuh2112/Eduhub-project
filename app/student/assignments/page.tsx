"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  GraduationCap,
  Search,
  AlertCircle,
  X,
  BookOpen,
  User,
  Award,
  Paperclip,
} from "lucide-react";
import { useMemo, useState } from "react";

const assignments = [
  {
    id: 1,
    title: "AI Search Algorithms",
    course: "CS401",
    courseName: "Artificial Intelligence",
    description:
      "Implement and analyze different uninformed and informed search algorithms.",
    instructions: [
      "Explain uninformed and informed search algorithms.",
      "Implement Breadth-First Search (BFS) and Depth-First Search (DFS).",
      "Implement one informed search algorithm, such as A*.",
      "Compare the algorithms using execution time and solution quality.",
      "Submit your source code and a short report.",
    ],
    dueDate: "Oct 03, 2026",
    status: "Pending",
    priority: "High",
    points: 20,
  },
  {
    id: 2,
    title: "Machine Learning Model",
    course: "CS402",
    courseName: "Machine Learning",
    description:
      "Build and evaluate a supervised machine learning model using a real dataset.",
    instructions: [
      "Select and describe a suitable dataset.",
      "Clean and prepare the dataset.",
      "Train a supervised machine learning model.",
      "Evaluate the model using appropriate metrics.",
      "Submit the code and explain your results in a report.",
    ],
    dueDate: "Oct 05, 2026",
    status: "In Progress",
    priority: "High",
    points: 25,
  },
  {
    id: 3,
    title: "Database Query Optimization",
    course: "CS403",
    courseName: "Advanced Database",
    description:
      "Analyze database queries and improve their performance using indexing and optimization.",
    instructions: [
      "Create sample database tables and data.",
      "Write SQL queries for the given scenario.",
      "Identify queries that could benefit from indexes.",
      "Compare query execution plans before and after optimization.",
      "Submit your SQL script and findings.",
    ],
    dueDate: "Oct 08, 2026",
    status: "Pending",
    priority: "Medium",
    points: 20,
  },
  {
    id: 4,
    title: "Midterm AI Project",
    course: "CS401",
    courseName: "Artificial Intelligence",
    description:
      "Develop a small intelligent system applying concepts learned in the first units.",
    instructions: [
      "Choose a problem that can be addressed using AI.",
      "Describe the problem and your proposed solution.",
      "Implement a small working prototype.",
      "Test the prototype and explain the results.",
      "Submit your source code and project report.",
    ],
    dueDate: "Oct 12, 2026",
    status: "Not Started",
    priority: "High",
    points: 30,
  },
  {
    id: 5,
    title: "Classification Exercise",
    course: "CS402",
    courseName: "Machine Learning",
    description:
      "Complete practical exercises on classification algorithms and model evaluation.",
    instructions: [
      "Implement two classification algorithms.",
      "Evaluate the models using suitable metrics.",
      "Compare the models and explain the results.",
      "Submit your code and answers.",
    ],
    dueDate: "Oct 15, 2026",
    status: "Completed",
    priority: "Medium",
    points: 15,
  },
  {
    id: 6,
    title: "Transaction Management",
    course: "CS403",
    courseName: "Advanced Database",
    description:
      "Study transaction processing and demonstrate ACID properties with examples.",
    instructions: [
      "Explain atomicity, consistency, isolation, and durability.",
      "Give a practical example for each ACID property.",
      "Demonstrate transaction commit and rollback.",
      "Explain a possible concurrency problem and how it can be handled.",
    ],
    dueDate: "Oct 20, 2026",
    status: "Not Started",
    priority: "Low",
    points: 20,
  },
];

const courses = [
  { code: "ALL", name: "All Courses" },
  { code: "CS401", name: "Artificial Intelligence" },
  { code: "CS402", name: "Machine Learning" },
  { code: "CS403", name: "Advanced Database" },
];

const statuses = [
  "All Status",
  "Pending",
  "In Progress",
  "Completed",
  "Not Started",
];

type Assignment = (typeof assignments)[number];

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const filteredAssignments = useMemo(() => {
    const value = search.toLowerCase().trim();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !value ||
        assignment.title.toLowerCase().includes(value) ||
        assignment.course.toLowerCase().includes(value) ||
        assignment.courseName.toLowerCase().includes(value);

      const matchesCourse =
        selectedCourse === "ALL" ||
        assignment.course === selectedCourse;

      const matchesStatus =
        selectedStatus === "All Status" ||
        assignment.status === selectedStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [search, selectedCourse, selectedStatus]);

  const pendingCount = assignments.filter(
    (item) => item.status === "Pending"
  ).length;

  const inProgressCount = assignments.filter(
    (item) => item.status === "In Progress"
  ).length;

  const completedCount = assignments.filter(
    (item) => item.status === "Completed"
  ).length;

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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
                <ClipboardList size={23} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#07192B] sm:text-3xl">
                  Assignments
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Track your assignments, deadlines, and progress
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs text-slate-500">Total Assignments</p>
              <p className="mt-1 text-2xl font-bold text-[#07192B]">
                {assignments.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* SUMMARY */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total"
            count={assignments.length}
            icon={<ClipboardList size={20} />}
            color="blue"
          />
          <SummaryCard
            label="Pending"
            count={pendingCount}
            icon={<Clock3 size={20} />}
            color="amber"
          />
          <SummaryCard
            label="In Progress"
            count={inProgressCount}
            icon={<FileText size={20} />}
            color="blue"
          />
          <SummaryCard
            label="Completed"
            count={completedCount}
            icon={<CheckCircle2 size={20} />}
            color="green"
          />
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px_220px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search assignments..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#D5AE48] focus:bg-white"
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D5AE48]"
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
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D5AE48]"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ASSIGNMENT LIST */}
        <section className="mt-6 space-y-4">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <article
                key={assignment.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D5AE48] hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        assignment.status === "Completed"
                          ? "bg-green-50 text-green-600"
                          : assignment.priority === "High"
                            ? "bg-red-50 text-red-500"
                            : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {assignment.status === "Completed" ? (
                        <CheckCircle2 size={22} />
                      ) : assignment.priority === "High" ? (
                        <AlertCircle size={22} />
                      ) : (
                        <FileText size={22} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#0E2A47] px-2 py-1 text-[10px] font-bold text-[#D5AE48]">
                          {assignment.course}
                        </span>
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                            assignment.priority === "High"
                              ? "bg-red-50 text-red-600"
                              : assignment.priority === "Medium"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {assignment.priority} Priority
                        </span>
                      </div>

                      <h2 className="mt-2 text-base font-bold text-[#07192B]">
                        {assignment.title}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {assignment.courseName}
                      </p>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        {assignment.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-2 text-xs text-slate-500">
                          <CalendarDays size={14} />
                          Due {assignment.dueDate}
                        </span>
                        <span className="text-xs text-slate-500">
                          Points: {assignment.points}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                    <span
                      className={`rounded-xl px-3 py-2 text-xs font-bold ${
                        assignment.status === "Completed"
                          ? "bg-green-50 text-green-700"
                          : assignment.status === "In Progress"
                            ? "bg-blue-50 text-blue-700"
                            : assignment.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {assignment.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(assignment)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#07192B]"
                    >
                      View Assignment
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <ClipboardList size={28} className="mx-auto text-slate-400" />
              <h2 className="mt-5 text-lg font-bold text-[#07192B]">
                No Assignments Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Try another search term or change the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCourse("ALL");
                  setSelectedStatus("All Status");
                }}
                className="mt-5 rounded-xl bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white hover:bg-[#07192B]"
              >
                Show All Assignments
              </button>
            </div>
          )}
        </section>

        {/* COURSE QUICK ACCESS */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
              <GraduationCap size={19} />
            </div>
            <div>
              <h2 className="font-bold text-[#07192B]">Course Assignments</h2>
              <p className="text-xs text-slate-400">
                View assignments by course
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
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D5AE48] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E2A47] text-sm font-bold text-[#D5AE48]">
                        {course.code.substring(2)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#B38B27]">
                          {course.code}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-[#07192B]">
                          {course.name}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-[#B38B27]" />
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* VIEW ASSIGNMENT DETAILS */}
      {selectedAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAssignment(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="assignment-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <span className="rounded-md bg-[#0E2A47] px-3 py-1 text-xs font-bold text-[#D5AE48]">
                  {selectedAssignment.course}
                </span>
                <h2
                  id="assignment-modal-title"
                  className="mt-3 text-2xl font-bold text-[#07192B]"
                >
                  {selectedAssignment.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedAssignment.courseName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                aria-label="Close assignment details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-[#07192B]">
                  <BookOpen size={18} />
                  Assignment Description
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailCard
                  label="Due Date"
                  value={selectedAssignment.dueDate}
                  icon={<CalendarDays size={18} />}
                />
                <DetailCard
                  label="Maximum Points"
                  value={`${selectedAssignment.points} points`}
                  icon={<Award size={18} />}
                />
                <DetailCard
                  label="Status"
                  value={selectedAssignment.status}
                  icon={<CheckCircle2 size={18} />}
                />
                <DetailCard
                  label="Priority"
                  value={selectedAssignment.priority}
                  icon={<AlertCircle size={18} />}
                />
              </div>

              <div>
                <h3 className="font-bold text-[#07192B]">
                  Assignment Instructions
                </h3>
                <ol className="mt-3 space-y-3">
                  {selectedAssignment.instructions.map(
                    (instruction, index) => (
                      <li
                        key={instruction}
                        className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    )
                  )}
                </ol>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Paperclip className="mt-0.5 shrink-0 text-amber-700" size={18} />
                  <div>
                    <h3 className="font-semibold text-amber-900">
                      Submission Information
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      This page currently displays demo assignment data.
                      Actual file upload and submission require a connected
                      backend and file storage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="rounded-xl bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07192B]"
                >
                  Close Details
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  count,
  icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: "blue" | "amber" | "green";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#07192B]">{count}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 flex items-center gap-2 font-semibold text-[#07192B]">
        <span className="text-slate-500">{icon}</span>
        {value}
      </p>
    </div>
  );
}