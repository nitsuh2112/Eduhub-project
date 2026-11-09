"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Search,
  GraduationCap,
  Clock,
  Users,
  ChevronRight,
  Filter,
  Code2,
  Database,
  Globe,
  Calculator,
  Brain,
  X,
} from "lucide-react";

type Course = {
  id: number;
  code: string;
  title: string;
  department: string;
  instructor: string;
  credits: number;
  duration: string;
  students: number;
  description: string;
  color: string;
  icon: "code" | "database" | "web" | "math" | "brain";
};

const courses: Course[] = [
  {
    id: 1,
    code: "SE301",
    title: "Software Engineering",
    department: "Software Engineering",
    instructor: "Course Instructor",
    credits: 3,
    duration: "14 weeks",
    students: 45,
    description:
      "Learn software development processes, requirements analysis, system design, testing, and software maintenance.",
    color: "blue",
    icon: "code",
  },
  {
    id: 2,
    code: "OOP202",
    title: "Object Oriented Programming",
    department: "Computer Science",
    instructor: "Course Instructor",
    credits: 3,
    duration: "14 weeks",
    students: 52,
    description:
      "Study classes, objects, inheritance, polymorphism, encapsulation, and abstraction using object-oriented programming.",
    color: "violet",
    icon: "code",
  },
  {
    id: 3,
    code: "DB301",
    title: "Database Systems",
    department: "Computer Science",
    instructor: "Course Instructor",
    credits: 3,
    duration: "14 weeks",
    students: 48,
    description:
      "Explore relational database design, ER diagrams, SQL queries, normalization, and database management.",
    color: "emerald",
    icon: "database",
  },
  {
    id: 4,
    code: "WD201",
    title: "Web Development",
    department: "Software Engineering",
    instructor: "Course Instructor",
    credits: 4,
    duration: "14 weeks",
    students: 40,
    description:
      "Learn modern web development concepts, HTML, CSS, JavaScript, frontend frameworks, and API integration.",
    color: "amber",
    icon: "web",
  },
  {
    id: 5,
    code: "DS202",
    title: "Data Structures and Algorithms",
    department: "Computer Science",
    instructor: "Course Instructor",
    credits: 3,
    duration: "14 weeks",
    students: 44,
    description:
      "Understand arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and algorithm analysis.",
    color: "rose",
    icon: "brain",
  },
  {
    id: 6,
    code: "MA201",
    title: "Discrete Mathematics",
    department: "Mathematics",
    instructor: "Course Instructor",
    credits: 3,
    duration: "14 weeks",
    students: 38,
    description:
      "Study logic, sets, relations, functions, combinatorics, graphs, and mathematical reasoning.",
    color: "cyan",
    icon: "math",
  },
];

const departments = [
  "All Departments",
  ...Array.from(new Set(courses.map((course) => course.department))),
];

function CourseIcon({ type }: { type: Course["icon"] }) {
  const className = "h-7 w-7";

  switch (type) {
    case "database":
      return <Database className={className} />;
    case "web":
      return <Globe className={className} />;
    case "math":
      return <Calculator className={className} />;
    case "brain":
      return <Brain className={className} />;
    default:
      return <Code2 className={className} />;
  }
}

export default function BrowseCoursesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.department.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term);

      const matchesDepartment =
        department === "All Departments" ||
        course.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/student/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-blue-100">
                <GraduationCap className="h-5 w-5" />
                <span className="text-sm font-medium">
                  EduHub Learning Portal
                </span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Browse Courses
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Discover courses, explore course descriptions, and find learning opportunities for your academic journey.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <BookOpen className="h-10 w-10" />
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available Courses</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {courses.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Departments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {departments.length - 1}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Search Results</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {filteredCourses.length}
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Find Your Course
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by course name, code, or department.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              >
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDepartment("All Departments");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              All Courses
            </h2>
            <span className="text-sm text-slate-500">
              {filteredCourses.length} course(s)
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                        course.color === "blue"
                          ? "bg-blue-50 text-blue-700"
                          : course.color === "violet"
                            ? "bg-violet-50 text-violet-700"
                            : course.color === "emerald"
                              ? "bg-emerald-50 text-emerald-700"
                              : course.color === "amber"
                                ? "bg-amber-50 text-amber-700"
                                : course.color === "rose"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-cyan-50 text-cyan-700"
                      }`}
                    >
                      <CourseIcon type={course.icon} />
                    </div>

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {course.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-blue-700">
                    {course.department}
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {course.description}
                  </p>

                  <div className="my-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      {course.credits} Credits
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {course.duration}
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4 text-slate-400" />
                      {course.students} students
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Course Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-800">
                No courses found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or department.
              </p>
            </div>
          )}
        </section>

        {selectedCourse && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedCourse(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="course-dialog-title"
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-blue-700">
                    {selectedCourse.code}
                  </span>
                  <h2
                    id="course-dialog-title"
                    className="mt-1 text-2xl font-bold text-slate-900"
                  >
                    {selectedCourse.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  aria-label="Close course details"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                {selectedCourse.description}
              </p>

              <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <p>
                  <span className="font-semibold text-slate-800">
                    Department:
                  </span>{" "}
                  {selectedCourse.department}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">
                    Instructor:
                  </span>{" "}
                  {selectedCourse.instructor}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">
                    Credits:
                  </span>{" "}
                  {selectedCourse.credits}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">
                    Duration:
                  </span>{" "}
                  {selectedCourse.duration}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Close
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}