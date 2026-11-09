
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

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
    description:
      "Advanced database concepts including query optimization, transactions, indexing, distributed databases, and database administration.",
  },
];

export default function MyCoursesPage() {
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.code.toLowerCase().includes(value) ||
        course.title.toLowerCase().includes(value) ||
        course.instructor.toLowerCase().includes(value)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* ============================================================
          HEADER
      ============================================================ */}
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
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E2A47] text-[#D5AE48]">
                  <GraduationCap size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#07192B] sm:text-3xl">
                    My Courses
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage and continue your current semester courses
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs text-slate-500">
                Enrolled Courses
              </p>

              <p className="mt-1 text-2xl font-bold text-[#07192B]">
                {courses.length}
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
            SEARCH
        ============================================================ */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, code, or instructor..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-[#07192B] outline-none transition placeholder:text-slate-400 focus:border-[#D5AE48] focus:bg-white focus:ring-2 focus:ring-[#D5AE48]/20"
            />
          </div>
        </div>

        {/* ============================================================
            COURSE CARDS
        ============================================================ */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <Link
                key={course.code}
                href={`/student/courses/${course.code}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D5AE48] hover:shadow-lg"
              >
                {/* Top color line */}
                <div className={`h-2 ${course.color}`} />

                <div className="p-5">

                  {/* ====================================================
                      COURSE HEADER
                  ==================================================== */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${course.color} text-sm font-bold text-white`}
                      >
                        {course.code.substring(2)}
                      </div>

                      <div>
                        <span className="rounded-md bg-[#0E2A47] px-2 py-1 text-[10px] font-bold text-[#D5AE48]">
                          {course.code}
                        </span>

                        <h2 className="mt-2 text-base font-bold text-[#07192B] transition group-hover:text-[#D5AE48]">
                          {course.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-[#0E2A47] group-hover:text-[#D5AE48]">
                      <ChevronRight size={18} />
                    </div>
                  </div>

                  {/* ====================================================
                      INSTRUCTOR
                  ==================================================== */}
                  <p className="mt-4 text-sm text-slate-500">
                    Instructor:{" "}
                    <span className="font-semibold text-[#07192B]">
                      {course.instructor}
                    </span>
                  </p>

                  {/* ====================================================
                      SEMESTER + CREDITS
                  ==================================================== */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Semester
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#07192B]">
                        {course.semester}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Credits
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#07192B]">
                        {course.credits} Credits
                      </p>
                    </div>
                  </div>

                  {/* ====================================================
                      PROGRESS
                  ==================================================== */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Course Progress
                      </span>

                      <span className="text-xs font-bold text-[#07192B]">
                        {course.progress}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#D5AE48] transition-all duration-700"
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {course.completedLessons} / {course.lessons} lessons
                      </span>

                      <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                        {course.grade}
                      </span>
                    </div>
                  </div>

                  {/* ====================================================
                      FOOTER
                  ==================================================== */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />

                      <span className="text-xs font-medium text-slate-500">
                        Active Course
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#0E2A47] transition group-hover:text-[#D5AE48]">
                      View Course →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (

          /* ============================================================
             NO RESULTS
          ============================================================ */
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <BookOpen size={26} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#07192B]">
              No Courses Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with another course name, code, or instructor.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07192B]"
            >
              Show All Courses
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
