"use client";

import { useEffect, useState, useMemo, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  Upload,
  ClipboardList,
  FileText,
  CalendarDays,
  Trash2,
  Download,
  Search,
  BookOpen,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowLeft,
  Users,
  ChevronRight,
} from "lucide-react";

type Assignment = {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  description: string;
  dueDate: string;
  points: number;
  instructor: string;
  fileName: string;
  fileData: string;
  createdAt: string;
};

type SubmissionStats = {
  total: number;
  graded: number;
};

const STORAGE_KEY = "eduhub_assignments";

const COURSES = [
  { code: "CS101", name: "Introduction to Computer Science" },
  { code: "CS202", name: "Database Management Systems" },
  { code: "CS203", name: "Object-Oriented Programming" },
  { code: "SE301", name: "Software Engineering" },
];

const EMPTY_FORM = {
  title: "",
  courseCode: "CS101",
  description: "",
  dueDate: "",
  points: "10",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100";

function getAssignments(): Assignment[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as Assignment[]) : [];
  } catch {
    return [];
  }
}

function saveAssignments(assignments: Assignment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}

function getSubmissionsStats(assignmentId: string): SubmissionStats {
  try {
    const stored = localStorage.getItem(`eduhub_submissions_${assignmentId}`);
    if (!stored) return { total: 0, graded: 0 };
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const graded = parsed.filter((s: { status?: string }) => s.status === "Graded").length;
      return { total: parsed.length, graded };
    }
    return { total: 0, graded: 0 };
  } catch {
    return { total: 0, graded: 0 };
  }
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDate(date: string) {
  if (!date) return "Not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, SubmissionStats>>({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PASTDUE">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "dueSoon" | "points">("newest");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function reloadAssignments() {
    const list = getAssignments();
    setAssignments(list);

    // Calculate submissions stats map
    const map: Record<string, SubmissionStats> = {};
    for (const a of list) {
      map[a.id] = getSubmissionsStats(a.id);
    }
    setSubmissionsMap(map);
  }

  useEffect(() => {
    reloadAssignments();
    setLoading(false);

    function handleStorage(event: StorageEvent) {
      if (
        event.key === STORAGE_KEY ||
        event.key?.startsWith("eduhub_submissions_") ||
        event.key === null
      ) {
        reloadAssignments();
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function updateForm(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function notify(text: string, type: "success" | "error" = "success") {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  }

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (publishing) return;

    const title = form.title.trim();
    const description = form.description.trim();
    const points = Number(form.points);

    if (!title || !description || !form.dueDate) {
      notify("Please complete all required fields.", "error");
      return;
    }

    if (!Number.isFinite(points) || points < 1 || points > 1000) {
      notify("Points must be between 1 and 1000.", "error");
      return;
    }

    const now = new Date();
    const todayString = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    if (form.dueDate < todayString) {
      notify("The due date cannot be in the past.", "error");
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      notify("File size must be 2 MB or less.", "error");
      return;
    }

    if (file && !/\.(pdf|doc|docx|txt)$/i.test(file.name)) {
      notify("Choose a PDF, DOC, DOCX, or TXT file.", "error");
      return;
    }

    const course = COURSES.find((item) => item.code === form.courseCode);

    if (!course) {
      notify("Please select a valid course.", "error");
      return;
    }

    setPublishing(true);

    try {
      let fileData = "";

      if (file) {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Unable to read the selected file."));
            }
          };

          reader.onerror = () =>
            reject(new Error("Unable to read the selected file."));

          reader.readAsDataURL(file);
        });
      }

      const newId = createId();

      const assignment: Assignment = {
        id: newId,
        title,
        courseCode: course.code,
        courseName: course.name,
        description,
        dueDate: form.dueDate,
        points,
        instructor: "Instructor",
        fileName: file?.name ?? "",
        fileData,
        createdAt: new Date().toISOString(),
      };

      const updated = [assignment, ...getAssignments()];
      saveAssignments(updated);
      setAssignments(updated);
      setForm(EMPTY_FORM);
      setFile(null);

      const fileInput = document.getElementById(
        "assignment-attachment"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";

      notify("Assignment published successfully!");
      setShowForm(false);
      reloadAssignments();
    } catch {
      notify(
        "Unable to save. Try a smaller file or check browser storage.",
        "error"
      );
    } finally {
      setPublishing(false);
    }
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment and its submissions?"
    );

    if (!confirmed) return;

    try {
      const updated = getAssignments().filter((item) => item.id !== id);
      saveAssignments(updated);
      localStorage.removeItem(`eduhub_submissions_${id}`);
      setAssignments(updated);
      reloadAssignments();
      notify("Assignment deleted successfully.");
    } catch {
      notify("Unable to delete this assignment.", "error");
    }
  }

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const filteredAssignments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return assignments
      .filter((assignment) => {
        const matchesSearch =
          assignment.title.toLowerCase().includes(query) ||
          assignment.courseCode.toLowerCase().includes(query) ||
          assignment.courseName.toLowerCase().includes(query) ||
          assignment.description.toLowerCase().includes(query);

        const matchesCourse =
          courseFilter === "All Courses" ||
          assignment.courseCode === courseFilter;

        const isPast = assignment.dueDate < todayString;
        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ACTIVE"
            ? !isPast
            : isPast;

        return matchesSearch && matchesCourse && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "dueSoon") {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === "points") {
          return b.points - a.points;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [assignments, search, courseFilter, statusFilter, sortBy, todayString]);

  const upcomingCount = assignments.filter(
    (item) => item.dueDate >= todayString
  ).length;

  const pastDueCount = assignments.filter(
    (item) => item.dueDate < todayString
  ).length;

  const totalSubmissionsCount = Object.values(submissionsMap).reduce(
    (acc, s) => acc + s.total,
    0
  );

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/instructor/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E2A47] transition hover:text-amber-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/instructor/mycourse" className="hover:text-[#0E2A47] underline underline-offset-4">
              My Courses
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/instructor/quizzes" className="hover:text-[#0E2A47] underline underline-offset-4">
              Quizzes & Exams
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/instructor/grading" className="font-bold text-[#0E2A47] hover:text-[#D5AE48] underline underline-offset-4">
              Grading Hub
            </Link>
          </div>
        </div>

        {/* Header Banner */}
        <header className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-[#07192B] via-[#0E2A47] to-[#204B70] p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D5AE48]/30 bg-[#D5AE48]/10 px-3 py-1.5 text-xs font-semibold text-[#E0BE61]">
                <ClipboardList size={15} />
                INSTRUCTOR WORKSPACE
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Assignments
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Create, publish, and manage course assignments. Review student submissions and assign grades.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((previous) => !previous)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-5 py-3 text-sm font-bold text-[#07192B] shadow-md transition hover:bg-[#E0BE61]"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? "Close Form" : "+ Create New Assignment"}
            </button>
          </div>
        </header>

        {/* Notifications */}
        {message && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm transition-all ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Assignments"
            value={assignments.length}
            subtitle="Published in courses"
            icon={<ClipboardList size={22} />}
          />
          <StatCard
            title="Active / Upcoming"
            value={upcomingCount}
            subtitle="Open for submissions"
            icon={<CalendarDays size={22} />}
          />
          <StatCard
            title="Past Due"
            value={pastDueCount}
            subtitle="Past deadline"
            icon={<FileText size={22} />}
          />
          <StatCard
            title="Student Submissions"
            value={totalSubmissionsCount}
            subtitle="Awaiting review & grading"
            icon={<Users size={22} />}
          />
        </section>

        {/* Create Assignment Form */}
        {showForm && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800">
                  <Plus size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0E2A47]">
                    Create New Course Assignment
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Students will receive access to this assignment and its attached materials.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handlePublish}
              className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="assignment-title"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Assignment Title *
                </label>
                <input
                  id="assignment-title"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. Database ER Model & Normalization"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="assignment-course"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Select Course *
                </label>
                <select
                  id="assignment-course"
                  required
                  value={form.courseCode}
                  onChange={(event) =>
                    updateForm("courseCode", event.target.value)
                  }
                  className={inputClass}
                >
                  {COURSES.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code} — {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="assignment-description"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Assignment Instructions & Objectives *
                </label>
                <textarea
                  id="assignment-description"
                  required
                  rows={5}
                  maxLength={3000}
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Describe the tasks, requirements, grading criteria, and submission instructions..."
                  className={inputClass}
                />
                <p className="mt-1.5 text-right text-xs text-slate-400">
                  {form.description.length}/3000 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="assignment-due-date"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Submission Deadline *
                </label>
                <input
                  id="assignment-due-date"
                  type="date"
                  required
                  min={todayString}
                  value={form.dueDate}
                  onChange={(event) => updateForm("dueDate", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="assignment-points"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Maximum Points *
                </label>
                <input
                  id="assignment-points"
                  type="number"
                  required
                  min="1"
                  max="1000"
                  value={form.points}
                  onChange={(event) => updateForm("points", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="assignment-attachment"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Attach Resource File (PDF, DOCX, TXT)
                </label>
                <label
                  htmlFor="assignment-attachment"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-amber-400 hover:bg-amber-50/40"
                >
                  <div className="mb-2.5 rounded-full bg-amber-100 p-2.5 text-amber-700">
                    <Upload size={21} />
                  </div>
                  <span className="text-sm font-semibold text-[#0E2A47]">
                    {file ? file.name : "Click or drag to select a file"}
                  </span>
                  <span className="mt-1.5 text-xs text-slate-400">
                    PDF, DOC, DOCX, or TXT · Maximum 2 MB
                  </span>
                  <input
                    id="assignment-attachment"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="sr-only"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] ?? null)
                    }
                  />
                </label>

                {file && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      const input = document.getElementById(
                        "assignment-attachment"
                      ) as HTMLInputElement | null;
                      if (input) input.value = "";
                    }}
                    className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove selected file ({file.name})
                  </button>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end lg:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setFile(null);
                    setMessage("");
                    const input = document.getElementById(
                      "assignment-attachment"
                    ) as HTMLInputElement | null;
                    if (input) input.value = "";
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E2A47] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#173C5F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={17} />
                  {publishing ? "Publishing..." : "Publish Assignment"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Filter and Assignments Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0E2A47]">
                  Published Course Assignments
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Showing {filteredAssignments.length} of {assignments.length} assignments
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[200px] flex-1 sm:w-56">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search assignments..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                {/* Course Filter */}
                <select
                  value={courseFilter}
                  onChange={(event) => setCourseFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
                >
                  <option>All Courses</option>
                  {COURSES.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "PASTDUE")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active / Open</option>
                  <option value="PASTDUE">Past Due</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "dueSoon" | "points")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="dueSoon">Sort: Due Date</option>
                  <option value="points">Sort: Max Points</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {loading ? (
              <div className="py-16 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0E2A47] border-t-transparent mx-auto" />
                <p className="mt-4 text-xs font-medium text-slate-500">
                  Loading assignments...
                </p>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <ClipboardList size={27} />
                </div>
                <h3 className="mt-4 font-bold text-[#0E2A47]">
                  {assignments.length === 0
                    ? "No assignments created yet"
                    : "No matching assignments found"}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500">
                  {assignments.length === 0
                    ? "Click the button below to create your first assignment and publish it for students."
                    : "Try clearing your search keyword or switching the course/status filter."}
                </p>
                {assignments.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#173C5F]"
                  >
                    <Plus size={17} />
                    Create First Assignment
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => {
                  const isPastDue = assignment.dueDate < todayString;
                  const stats = submissionsMap[assignment.id] || {
                    total: 0,
                    graded: 0,
                  };

                  return (
                    <article
                      key={assignment.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#D5AE48]/60 hover:shadow-md"
                    >
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 gap-4">
                          <div className="h-fit rounded-xl bg-amber-50 p-3 text-amber-700">
                            <FileText size={24} />
                          </div>

                          <div className="min-w-0">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">
                                {assignment.courseCode}
                              </span>
                              <span
                                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                                  isPastDue
                                    ? "bg-red-50 text-red-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {isPastDue ? "Past Due" : "Active"}
                              </span>
                              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {assignment.courseName}
                              </span>
                            </div>

                            {/* Title (Link to Details) */}
                            <Link
                              href={`/instructor/assignments/${assignment.id}`}
                              className="mt-2.5 inline-flex items-center gap-2 break-words text-left text-lg font-bold text-[#0E2A47] transition hover:text-amber-600"
                            >
                              <span>{assignment.title}</span>
                              <Eye size={16} className="shrink-0 text-slate-400 group-hover:text-amber-600" />
                            </Link>

                            {/* Description snippet */}
                            <p className="mt-1 line-clamp-2 max-w-3xl text-xs leading-5 text-slate-500">
                              {assignment.description}
                            </p>

                            {/* Meta info & Submissions */}
                            <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <CalendarDays size={14} className="text-amber-600" />
                                Due {formatDate(assignment.dueDate)}
                              </span>
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <BookOpen size={14} className="text-amber-600" />
                                {assignment.points} Points
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                                <Users size={13} className="text-[#0E2A47]" />
                                {stats.total} Submissions ({stats.graded} graded)
                              </span>
                            </div>

                            {/* Attached resource */}
                            {assignment.fileName && assignment.fileData && (
                              <a
                                href={assignment.fileData}
                                download={assignment.fileName}
                                onClick={(event) => event.stopPropagation()}
                                className="mt-3 inline-flex max-w-full items-center gap-2 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0E2A47] transition hover:bg-amber-50"
                              >
                                <Download size={14} className="shrink-0 text-amber-700" />
                                {assignment.fileName}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex shrink-0 items-center gap-2.5 self-end lg:self-center">
                          <Link
                            href={`/instructor/assignments/${assignment.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#173C5F]"
                          >
                            <span>View & Grade</span>
                            <ChevronRight size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(assignment.id)}
                            aria-label={`Delete ${assignment.title}`}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-2.5 text-red-600 transition hover:bg-red-100"
                            title="Delete assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          EduHub · Instructor Assignment Management · Browser demo storage
        </p>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-[#0E2A47]">{value}</p>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
      </div>
    </article>
  );
}