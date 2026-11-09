
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  GraduationCap,
  PlayCircle,
  Users,
} from "lucide-react";

const courses = [
  {
    code: "CS401",
    title: "Artificial Intelligence",
    instructor: "Dr. Michael",
    progress: 82,
    grade: "A",
    color: "bg-blue-500",
    semester: "Semester I",
    credits: 3,
    lessons: 24,
    completedLessons: 20,
    students: 42,
    description:
      "Introduction to artificial intelligence, intelligent agents, search algorithms, knowledge representation, and machine learning fundamentals.",
  },
  {
    code: "CS402",
    title: "Machine Learning",
    instructor: "Dr. Sarah",
    progress: 68,
    grade: "B+",
    color: "bg-purple-500",
    semester: "Semester I",
    credits: 3,
    lessons: 30,
    completedLessons: 20,
    students: 38,
    description:
      "Study of supervised and unsupervised learning, model training, evaluation, feature engineering, and practical machine learning techniques.",
  },
  {
    code: "CS403",
    title: "Advanced Database",
    instructor: "Mr. Daniel",
    progress: 54,
    grade: "B",
    color: "bg-amber-500",
    semester: "Semester I",
    credits: 3,
    lessons: 28,
    completedLessons: 15,
    students: 45,
    description:
      "Advanced database concepts including query optimization, transactions, indexing, distributed databases, and database administration.",
  },
];

const materials = [
  {
    title: "Course Introduction",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    title: "Lecture Notes - Chapter 1",
    type: "PDF",
    size: "4.1 MB",
  },
  {
    title: "Lecture Slides",
    type: "PPT",
    size: "6.8 MB",
  },
];

const assignments = [
  {
    title: "Assignment 1",
    dueDate: "Oct 03, 2026",
    status: "Pending",
  },
  {
    title: "Midterm Project",
    dueDate: "Oct 12, 2026",
    status: "Pending",
  },
  {
    title: "Practical Exercise",
    dueDate: "Oct 20, 2026",
    status: "Not Started",
  },
];

export default function CourseDetailsPage() {
  const params = useParams();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;

  const course = courses.find(
    (item) => item.code.toLowerCase() === String(courseId).toLowerCase()
  );

  // ============================================================
  // COURSE NOT FOUND
  // ============================================================

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <BookOpen size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#07192B]">
            Course Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The course you are looking for does not exist.
          </p>

          <Link
            href="/student/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07192B]"
          >
            <ArrowLeft size={17} />
            Back to My Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/student/dashboard"
              className="font-medium text-slate-400 transition hover:text-[#0E2A47]"
            >
              Dashboard
            </Link>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

            <Link
              href="/student/courses"
              className="font-medium text-slate-400 transition hover:text-[#0E2A47]"
            >
              My Courses
            </Link>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

            <span className="font-semibold text-[#07192B]">
              {course.code}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${course.color} text-lg font-bold text-white shadow-sm`}
              >
                {course.code.substring(2)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#0E2A47] px-2.5 py-1 text-xs font-bold text-[#D5AE48]">
                    {course.code}
                  </span>

                  <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <h1 className="mt-2 text-2xl font-bold text-[#07192B] sm:text-3xl">
                  {course.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Instructor:{" "}
                  <span className="font-semibold text-[#07192B]">
                    {course.instructor}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
              <p className="text-xs text-slate-500">
                Current Grade
              </p>

              <p className="mt-1 text-3xl font-bold text-[#0E2A47]">
                {course.grade}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ============================================================
            BACK BUTTON
        ============================================================ */}

        <Link
          href="/student/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0E2A47]"
        >
          <ArrowLeft size={17} />
          Back to My Courses
        </Link>

        {/* ============================================================
            COURSE STATS
        ============================================================ */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Total Lessons
                </p>

                <p className="mt-2 text-2xl font-bold text-[#07192B]">
                  {course.lessons}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Completed Lessons
                </p>

                <p className="mt-2 text-2xl font-bold text-[#07192B]">
                  {course.completedLessons}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Enrolled Students
                </p>

                <p className="mt-2 text-2xl font-bold text-[#07192B]">
                  {course.students}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Progress
                </p>

                <p className="mt-2 text-2xl font-bold text-[#07192B]">
                  {course.progress}%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <GraduationCap size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================
            PROGRESS
        ============================================================ */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#07192B]">
                Course Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep learning to complete this course.
              </p>
            </div>

            <span className="text-2xl font-bold text-[#0E2A47]">
              {course.progress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#D5AE48] transition-all duration-700"
              style={{
                width: `${course.progress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>
              {course.completedLessons} lessons completed
            </span>

            <span>
              {course.lessons - course.completedLessons} lessons remaining
            </span>
          </div>
        </section>

        {/* ============================================================
            MAIN GRID
        ============================================================ */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ==========================================================
              LEFT CONTENT
          ========================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* ========================================================
                OVERVIEW
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
                  <BookOpen size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-[#07192B]">
                    Course Overview
                  </h2>

                  <p className="text-xs text-slate-400">
                    About this course
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {course.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Semester
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#07192B]">
                    {course.semester}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Credits
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#07192B]">
                    {course.credits} Credits
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Instructor
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#07192B]">
                    {course.instructor}
                  </p>
                </div>

              </div>
            </section>

            {/* ========================================================
                MATERIALS
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#07192B]">
                      Course Materials
                    </h2>

                    <p className="text-xs text-slate-400">
                      Learning resources
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {materials.length} Files
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.title}
                    className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#D5AE48] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm">
                        <FileText size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#07192B]">
                          {material.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {material.type} • {material.size}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0E2A47] transition hover:border-[#D5AE48] hover:bg-[#0E2A47] hover:text-white"
                    >
                      Open
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================
                ASSIGNMENTS
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <ClipboardList size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-[#07192B]">
                    Assignments
                  </h2>

                  <p className="text-xs text-slate-400">
                    Course tasks and deadlines
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.title}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-sm font-semibold text-[#07192B]">
                          {assignment.title}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays size={14} />
                          Due {assignment.dueDate}
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          assignment.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ==========================================================
              RIGHT SIDEBAR
          ========================================================== */}

          <aside className="space-y-6">

            {/* ========================================================
                CONTINUE LEARNING
            ======================================================== */}

            <section className="overflow-hidden rounded-2xl bg-[#0E2A47] shadow-sm">

              <div className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#D5AE48]">
                  <PlayCircle size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-white">
                  Continue Learning
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Continue your course from where you stopped last time.
                </p>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-4 py-3 text-sm font-bold text-[#07192B] transition hover:bg-[#E0BE61]"
                >
                  Continue Course
                  <ChevronRight size={17} />
                </button>
              </div>

              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Current progress
                  </span>

                  <span className="font-bold text-[#D5AE48]">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </section>

            {/* ========================================================
                COURSE INFORMATION
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="font-bold text-[#07192B]">
                Course Information
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <GraduationCap size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Course Code
                    </p>

                    <p className="text-sm font-semibold text-[#07192B]">
                      {course.code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Semester
                    </p>

                    <p className="text-sm font-semibold text-[#07192B]">
                      {course.semester}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Lessons
                    </p>

                    <p className="text-sm font-semibold text-[#07192B]">
                      {course.lessons} Lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Users size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Students
                    </p>

                    <p className="text-sm font-semibold text-[#07192B]">
                      {course.students} Students
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}