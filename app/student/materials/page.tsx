"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Download,
  FileText,
  File,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";

type Material = {
  id: number;
  title: string;
  course: string;
  type: "PDF" | "DOCX" | "PPTX" | "XLSX";
  size: string;
  date: string;
};

const materials: Material[] = [
  {
    id: 1,
    title: "Introduction to Software Engineering",
    course: "Software Engineering",
    type: "PDF",
    size: "2.4 MB",
    date: "Oct 10, 2026",
  },
  {
    id: 2,
    title: "Object Oriented Programming Notes",
    course: "Object Oriented Programming",
    type: "PDF",
    size: "1.8 MB",
    date: "Oct 08, 2026",
  },
  {
    id: 3,
    title: "Database Design and SQL",
    course: "Database Systems",
    type: "PPTX",
    size: "3.1 MB",
    date: "Oct 06, 2026",
  },
  {
    id: 4,
    title: "Data Structures Practice",
    course: "Data Structures",
    type: "DOCX",
    size: "950 KB",
    date: "Oct 04, 2026",
  },
  {
    id: 5,
    title: "Web Development Lecture Notes",
    course: "Web Development",
    type: "PDF",
    size: "2.0 MB",
    date: "Oct 02, 2026",
  },
  {
    id: 6,
    title: "Software Engineering Exercises",
    course: "Software Engineering",
    type: "XLSX",
    size: "780 KB",
    date: "Sep 29, 2026",
  },
];

const courses = [
  "All Courses",
  ...Array.from(new Set(materials.map((material) => material.course))),
];

function MaterialIcon({ type }: { type: Material["type"] }) {
  if (type === "PPTX") {
    return <Presentation className="h-6 w-6" />;
  }

  if (type === "XLSX") {
    return <FileSpreadsheet className="h-6 w-6" />;
  }

  if (type === "DOCX") {
    return <File className="h-6 w-6" />;
  }

  return <FileText className="h-6 w-6" />;
}

export default function StudentMaterialsPage() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedType, setSelectedType] = useState("All Types");

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(search.toLowerCase()) ||
        material.course.toLowerCase().includes(search.toLowerCase());

      const matchesCourse =
        selectedCourse === "All Courses" ||
        material.course === selectedCourse;

      const matchesType =
        selectedType === "All Types" ||
        material.type === selectedType;

      return matchesSearch && matchesCourse && matchesType;
    });
  }, [search, selectedCourse, selectedType]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/student/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <section className="mb-8 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-blue-100">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Student Learning Center</span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Learning Materials
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Browse your course notes, lecture slides, documents, and study resources in one place.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15">
              <BookOpen className="h-10 w-10" />
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Materials</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {materials.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available Courses</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {courses.length - 1}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Filtered Results</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {filteredMaterials.length}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              All Materials
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter the available study resources.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search materials..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option>All Types</option>
              <option>PDF</option>
              <option>DOCX</option>
              <option>PPTX</option>
              <option>XLSX</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredMaterials.map((material) => (
              <article
                key={material.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <MaterialIcon type={material.type} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {material.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {material.course}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-medium">
                        {material.type}
                      </span>
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>{material.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Preview is not connected yet: ${material.title}`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `No file is attached yet for: ${material.title}`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </article>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                <Search className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 font-semibold text-slate-800">
                  No materials found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search term or filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCourse("All Courses");
                    setSelectedType("All Types");
                  }}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}