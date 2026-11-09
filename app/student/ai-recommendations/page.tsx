"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
  Clock3,
  Award,
  Lightbulb,
  BarChart3,
} from "lucide-react";

const recommendations = [
  {
    code: "CS405",
    name: "Web Application Development",
    instructor: "Dr. Helen",
    score: 94,
    match: "Excellent Match",
    reason:
      "Your current programming and database performance indicate strong preparation for this course.",
    difficulty: "Intermediate",
    credits: 3,
    prerequisites: ["CS202", "CS301"],
    category: "Recommended",
  },
  {
    code: "CS404",
    name: "Computer Networks",
    instructor: "Dr. John",
    score: 89,
    match: "Strong Match",
    reason:
      "This course complements your current computer science coursework and academic progress.",
    difficulty: "Intermediate",
    credits: 3,
    prerequisites: ["CS203"],
    category: "Recommended",
  },
  {
    code: "CS406",
    name: "Software Engineering",
    instructor: "Mr. Samuel",
    score: 84,
    match: "Good Match",
    reason:
      "Your completed programming courses provide a suitable foundation for software engineering.",
    difficulty: "Intermediate",
    credits: 3,
    prerequisites: ["CS202", "SE301"],
    category: "Recommended",
  },
  {
    code: "CS407",
    name: "Advanced Artificial Intelligence",
    instructor: "Dr. Michael",
    score: 81,
    match: "Good Match",
    reason:
      "Your strong performance in Artificial Intelligence makes this an appropriate advanced option.",
    difficulty: "Advanced",
    credits: 3,
    prerequisites: ["CS401"],
    category: "Recommended",
  },
];

const strengths = [
  {
    title: "Artificial Intelligence",
    score: 82,
    message: "Strong performance",
  },
  {
    title: "Machine Learning",
    score: 68,
    message: "Good progress",
  },
  {
    title: "Database Systems",
    score: 54,
    message: "Needs improvement",
  },
];

const completedCourses = [
  "CS101",
  "CS202",
  "CS203",
  "CS301",
];

export default function AIRecommendationsPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/student/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0E2A47]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0E2A47] text-[#E0BE61]">
                <Brain size={25} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#07192B]">
                    AI Course Recommendations
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF9E8] px-3 py-1 text-xs font-semibold text-[#0E2A47]">
                    <Sparkles size={13} />
                    AI Powered
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Personalized course suggestions based on your academic
                  performance and learning progress.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#E0BE61]/40 bg-[#FFF9E8] px-5 py-3">
              <p className="text-xs text-slate-500">
                Recommendation Status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-bold text-[#0E2A47]">
                  Updated for 2025 / 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          CONTENT
      ============================================================ */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ============================================================
            AI SUMMARY
        ============================================================ */}
        <section className="overflow-hidden rounded-2xl bg-[#0E2A47] shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#E0BE61]">
                <Sparkles size={18} />
                <span className="text-sm font-semibold">
                  EduHub AI Analysis
                </span>
              </div>

              <h2 className="max-w-3xl text-xl font-bold text-white sm:text-2xl">
                Your academic profile is ready for personalized
                recommendations.
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#B8C7D8]">
                The recommendation system analyzes your completed courses,
                grades, current semester, academic strengths, and course
                prerequisites to identify courses that may fit your learning
                path.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs text-[#B8C7D8]">
                    Current GPA
                  </p>
                  <p className="mt-1 font-bold text-white">
                    3.72 / 4.00
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs text-[#B8C7D8]">
                    Courses Completed
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {completedCourses.length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs text-[#B8C7D8]">
                    Recommendations
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {recommendations.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-full border border-[#E0BE61]/30 bg-[#E0BE61]/10 lg:flex">
              <Brain size={52} className="text-[#E0BE61]" />
            </div>
          </div>
        </section>

        {/* ============================================================
            ACADEMIC PROFILE
        ============================================================ */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Strengths */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <TrendingUp size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#07192B]">
                  Academic Profile
                </h2>

                <p className="text-xs text-slate-500">
                  Areas considered by the recommendation system
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {strengths.map((item) => (
                <div key={item.title}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#07192B]">
                        {item.title}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.message}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-[#0E2A47]">
                      {item.score}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#D5AE48]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goal */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9E8] text-[#0E2A47]">
                <Target size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#07192B]">
                  Learning Focus
                </h2>

                <p className="text-xs text-slate-500">
                  Current AI insight
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#FFF9E8] p-4">
              <p className="text-sm font-semibold text-[#0E2A47]">
                Improve Database Skills
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Your database score is currently lower than your AI
                performance. Consider strengthening SQL, transactions,
                indexing, and query optimization.
              </p>
            </div>

            <Link
              href="/student/courses/CS403"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0E2A47] transition hover:bg-slate-50"
            >
              Review CS403
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* ============================================================
            RECOMMENDED COURSES
        ============================================================ */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold text-[#07192B]">
                Recommended Courses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Courses selected from your academic profile.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
              <Sparkles size={14} className="text-[#D5AE48]" />
              AI Match Score
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {recommendations.map((course) => (
              <div
                key={course.code}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Card top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0E2A47] text-white">
                      <BookOpen size={21} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#0E2A47]/10 px-2 py-1 text-xs font-bold text-[#0E2A47]">
                          {course.code}
                        </span>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {course.match}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-bold text-[#07192B]">
                        {course.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-center">
                    <div className="text-2xl font-bold text-[#0E2A47]">
                      {course.score}%
                    </div>

                    <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Match
                    </div>
                  </div>
                </div>

                {/* Match bar */}
                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#D5AE48]"
                      style={{ width: `${course.score}%` }}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="mt-5 rounded-xl bg-[#F5F7FA] p-4">
                  <div className="flex gap-3">
                    <Lightbulb
                      size={18}
                      className="mt-0.5 shrink-0 text-[#D5AE48]"
                    />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#0E2A47]">
                        Why this course?
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {course.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Award size={15} />
                      <span className="text-xs">Difficulty</span>
                    </div>

                    <p className="mt-1 text-xs font-semibold text-[#07192B]">
                      {course.difficulty}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <GraduationCap size={15} />
                      <span className="text-xs">Credits</span>
                    </div>

                    <p className="mt-1 text-xs font-semibold text-[#07192B]">
                      {course.credits} Credits
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock3 size={15} />
                      <span className="text-xs">Prerequisites</span>
                    </div>

                    <p className="mt-1 truncate text-xs font-semibold text-[#07192B]">
                      {course.prerequisites.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <Link
                  href={`/student/courses/${course.code}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E2A47] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#07192B]"
                >
                  View Course
                  <ChevronRight size={17} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            HOW AI WORKS
        ============================================================ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#07192B]">
              How EduHub AI Recommends Courses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recommendation factors used by the system
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-[#F5F7FA] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0E2A47]">
                <GraduationCap size={18} />
              </div>

              <h3 className="text-sm font-bold text-[#07192B]">
                Academic History
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Completed courses and previous grades.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#F5F7FA] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0E2A47]">
                <BarChart3Icon />
              </div>

              <h3 className="text-sm font-bold text-[#07192B]">
                Performance
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Current scores, GPA, assignments, and quizzes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#F5F7FA] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0E2A47]">
                <BookOpen size={18} />
              </div>

              <h3 className="text-sm font-bold text-[#07192B]">
                Prerequisites
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Required courses are checked before recommending a course.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#F5F7FA] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0E2A47]">
                <Target size={18} />
              </div>

              <h3 className="text-sm font-bold text-[#07192B]">
                Learning Path
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Recommendations consider your academic direction.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            NOTE
        ============================================================ */}
        <section className="flex gap-3 rounded-2xl border border-[#E0BE61]/40 bg-[#FFF9E8] p-5">
          <Lightbulb
            size={20}
            className="mt-0.5 shrink-0 text-[#0E2A47]"
          />

          <div>
            <h3 className="text-sm font-bold text-[#0E2A47]">
              AI Recommendation Note
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              These recommendations are currently based on sample academic
              data for the EduHub interface. The real recommendation engine
              can later connect to the Python machine-learning service and
              generate recommendations from the student&apos;s actual
              academic records.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function BarChart3Icon() {
  return <BarChart3 size={18} />;
}