"use client";

import { useEffect, useState, useMemo, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers3,
  Pencil,
  Plus,
  Presentation,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
  AlertCircle,
  FolderOpen,
  Check,
  Share2,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  RefreshCw,
  Video,
} from "lucide-react";

export type InstructorMaterial = {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  type: "PDF" | "PPTX" | "DOCX" | "XLSX" | "ZIP" | "TXT" | "VIDEO";
  category:
    | "Lecture Slides"
    | "Lecture Notes"
    | "Syllabus"
    | "Lab Exercises"
    | "Reference Book";
  fileName: string;
  fileSize: string;
  fileData?: string;
  weekOrLesson: string;
  description: string;
  uploadedAt: string;
  status: "Published" | "Draft";
  downloadsCount: number;
  tags?: string[];
};

const MATERIALS_STORAGE_KEY = "eduhub_instructor_materials";
const COURSES_STORAGE_KEY = "eduhub_instructor_courses";

const DEFAULT_COURSES = [
  { code: "CS101", name: "Introduction to Computer Science" },
  { code: "CS202", name: "Database Management Systems" },
  { code: "CS203", name: "Object-Oriented Programming" },
  { code: "SE301", name: "Software Engineering" },
  { code: "IT201", name: "Computer Networks" },
];

const SEED_MATERIALS: InstructorMaterial[] = [
  {
    id: "mat-1",
    title: "Introduction to Computing & Algorithms",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    type: "PPTX",
    category: "Lecture Slides",
    fileName: "CS101_Lecture01_Intro_Algorithms.pptx",
    fileSize: "3.4 MB",
    weekOrLesson: "Week 1 · Lecture 1",
    description:
      "Overview of computational thinking, pseudocode, algorithm complexity, and flowchart design.",
    uploadedAt: "2026-10-04",
    status: "Published",
    downloadsCount: 46,
    tags: ["Algorithms", "Flowcharts", "Basics"],
  },
  {
    id: "mat-2",
    title: "Variables, Control Flow & Functions Guide",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    type: "PDF",
    category: "Lecture Notes",
    fileName: "CS101_Variables_and_Loops.pdf",
    fileSize: "1.8 MB",
    weekOrLesson: "Week 2 · Lecture 3",
    description:
      "Detailed notes and syntax explanations covering conditional logic, while/for loops, and function scoping.",
    uploadedAt: "2026-10-10",
    status: "Published",
    downloadsCount: 42,
    tags: ["Control Flow", "Functions", "Syntax"],
  },
  {
    id: "mat-3",
    title: "Relational Database Design & ER Modeling",
    courseCode: "CS202",
    courseName: "Database Management Systems",
    type: "PPTX",
    category: "Lecture Slides",
    fileName: "CS202_Ch2_ER_Modeling.pptx",
    fileSize: "4.2 MB",
    weekOrLesson: "Week 2 · Lecture 2",
    description:
      "Entities, attributes, relationships, Cardinality ratios, and transforming conceptual models to relational tables.",
    uploadedAt: "2026-10-06",
    status: "Published",
    downloadsCount: 39,
    tags: ["ER Model", "Entities", "Relationships"],
  },
  {
    id: "mat-4",
    title: "Complete SQL Practice Exercises & Solutions",
    courseCode: "CS202",
    courseName: "Database Management Systems",
    type: "PDF",
    category: "Lab Exercises",
    fileName: "CS202_SQL_Lab_Exercises.pdf",
    fileSize: "950 KB",
    weekOrLesson: "Week 4 · Lab 2",
    description:
      "Hands-on SQL queries: SELECT, JOIN, GROUP BY, subqueries, and table constraints with sample datasets.",
    uploadedAt: "2026-10-12",
    status: "Published",
    downloadsCount: 37,
    tags: ["SQL", "Queries", "Joins", "Hands-on"],
  },
  {
    id: "mat-5",
    title: "Object-Oriented Design Patterns & Principles",
    courseCode: "CS203",
    courseName: "Object-Oriented Programming",
    type: "PDF",
    category: "Lecture Notes",
    fileName: "CS203_OOP_Design_Patterns.pdf",
    fileSize: "2.7 MB",
    weekOrLesson: "Week 3 · Lecture 4",
    description:
      "SOLID principles, Singleton, Factory, and Observer patterns implemented in clean object-oriented code.",
    uploadedAt: "2026-10-08",
    status: "Published",
    downloadsCount: 33,
    tags: ["OOP", "SOLID", "Patterns", "Architecture"],
  },
  {
    id: "mat-6",
    title: "Java Lab Exercises & Starter Code Package",
    courseCode: "CS203",
    courseName: "Object-Oriented Programming",
    type: "ZIP",
    category: "Lab Exercises",
    fileName: "CS203_Lab_Starter_Code.zip",
    fileSize: "1.2 MB",
    weekOrLesson: "Week 3 · Lab 1",
    description:
      "Starter workspace code for student lab assignments on inheritance and interface implementations.",
    uploadedAt: "2026-10-11",
    status: "Published",
    downloadsCount: 29,
    tags: ["Java", "Starter Code", "Inheritance"],
  },
  {
    id: "mat-7",
    title: "Software Engineering Syllabus & Course Roadmap",
    courseCode: "SE301",
    courseName: "Software Engineering",
    type: "DOCX",
    category: "Syllabus",
    fileName: "SE301_Course_Syllabus_2025_2026.docx",
    fileSize: "620 KB",
    weekOrLesson: "Semester Overview",
    description:
      "Full academic course syllabus, grading distribution, assignment schedules, and textbook references.",
    uploadedAt: "2026-10-01",
    status: "Published",
    downloadsCount: 32,
    tags: ["Syllabus", "Grading", "Schedule"],
  },
  {
    id: "mat-8",
    title: "Agile Scrum Sprint Planning Guide",
    courseCode: "SE301",
    courseName: "Software Engineering",
    type: "PDF",
    category: "Lecture Notes",
    fileName: "SE301_Agile_Scrum_Guide.pdf",
    fileSize: "2.1 MB",
    weekOrLesson: "Week 4 · Lecture 2",
    description:
      "Practical instructions on managing Jira backlogs, sprint cycles, daily standups, and retrospective meetings.",
    uploadedAt: "2026-10-14",
    status: "Draft",
    downloadsCount: 0,
    tags: ["Agile", "Scrum", "Sprint Planning"],
  },
];

function getStoredMaterials(): InstructorMaterial[] {
  try {
    const raw = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (!raw) return SEED_MATERIALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_MATERIALS;
  } catch {
    return SEED_MATERIALS;
  }
}

function saveStoredMaterials(items: InstructorMaterial[]) {
  try {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage fallback
  }
}

function getStoredCourses(): { code: string; name: string }[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) return DEFAULT_COURSES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((c: { code?: string; title?: string; name?: string }) => ({
        code: c.code || "CS101",
        name: c.title || c.name || "Course",
      }));
    }
    return DEFAULT_COURSES;
  } catch {
    return DEFAULT_COURSES;
  }
}

function MaterialIcon({ type }: { type: InstructorMaterial["type"] }) {
  switch (type) {
    case "PPTX":
      return <Presentation className="h-5 w-5 text-amber-500" />;
    case "DOCX":
      return <File className="h-5 w-5 text-blue-500" />;
    case "XLSX":
      return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
    case "ZIP":
      return <FolderOpen className="h-5 w-5 text-purple-500" />;
    case "VIDEO":
      return <Video className="h-5 w-5 text-rose-500" />;
    default:
      return <FileText className="h-5 w-5 text-red-500" />;
  }
}

export default function InstructorMaterialsPage() {
  const [materials, setMaterials] = useState<InstructorMaterial[]>([]);
  const [coursesList, setCoursesList] = useState(DEFAULT_COURSES);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Published" | "Draft">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "downloads">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Upload Modal State
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCourseCode, setUploadCourseCode] = useState("CS101");
  const [uploadCategory, setUploadCategory] =
    useState<InstructorMaterial["category"]>("Lecture Slides");
  const [uploadWeek, setUploadWeek] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"Published" | "Draft">("Published");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadTags, setUploadTags] = useState("");
  const [uploading, setUploading] = useState(false);

  // Preview, Edit & Delete Confirm Modals
  const [previewMaterial, setPreviewMaterial] = useState<InstructorMaterial | null>(null);
  const [previewTab, setPreviewTab] = useState<"details" | "preview">("details");
  const [editMaterial, setEditMaterial] = useState<InstructorMaterial | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<InstructorMaterial | null>(null);

  // Toast message
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  function notify(message: string, type: "success" | "error" | "info" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    setMaterials(getStoredMaterials());
    setCoursesList(getStoredCourses());
  }, []);

  function persist(items: InstructorMaterial[]) {
    setMaterials(items);
    saveStoredMaterials(items);
  }

  function handleResetSeed() {
    if (window.confirm("Reset all materials to the initial seed dataset?")) {
      persist(SEED_MATERIALS);
      setSelectedIds([]);
      notify("Materials library reset to default seed data.");
    }
  }

  // Upload handler
  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      notify("Please provide a material title.", "error");
      return;
    }

    const courseObj = coursesList.find((c) => c.code === uploadCourseCode);
    const courseName = courseObj ? courseObj.name : "Course Resource";

    let fileName = `${uploadTitle.trim().replace(/\s+/g, "_")}.pdf`;
    let fileSize = "1.5 MB";
    let fileData = "";
    let fileType: InstructorMaterial["type"] = "PDF";

    if (uploadedFile) {
      fileName = uploadedFile.name;
      const sizeInMb = (uploadedFile.size / (1024 * 1024)).toFixed(1);
      fileSize = `${sizeInMb} MB`;

      const ext = fileName.split(".").pop()?.toUpperCase() || "";
      if (ext === "PPTX" || ext === "PPT") fileType = "PPTX";
      else if (ext === "DOCX" || ext === "DOC") fileType = "DOCX";
      else if (ext === "XLSX" || ext === "XLS" || ext === "CSV") fileType = "XLSX";
      else if (ext === "ZIP" || ext === "RAR" || ext === "TAR") fileType = "ZIP";
      else if (ext === "MP4" || ext === "MOV" || ext === "MKV") fileType = "VIDEO";
      else if (ext === "TXT") fileType = "TXT";
      else fileType = "PDF";

      setUploading(true);
      try {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("File read error"));
          reader.readAsDataURL(uploadedFile);
        });
      } catch {
        fileData = "";
      } finally {
        setUploading(false);
      }
    } else {
      if (uploadCategory === "Lecture Slides") fileType = "PPTX";
      else if (uploadCategory === "Syllabus") fileType = "DOCX";
      else fileType = "PDF";
    }

    const parsedTags = uploadTags
      ? uploadTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const newMaterial: InstructorMaterial = {
      id: `mat-${Date.now()}`,
      title: uploadTitle.trim(),
      courseCode: uploadCourseCode,
      courseName,
      type: fileType,
      category: uploadCategory,
      fileName,
      fileSize,
      fileData,
      weekOrLesson: uploadWeek.trim() || "Course Resource",
      description: uploadDescription.trim() || "Comprehensive learning resource for enrolled students.",
      uploadedAt: new Date().toISOString().split("T")[0],
      status: uploadStatus,
      downloadsCount: 0,
      tags: parsedTags.length > 0 ? parsedTags : ["Learning Resource"],
    };

    const updated = [newMaterial, ...materials];
    persist(updated);
    setShowUpload(false);
    setUploadTitle("");
    setUploadWeek("");
    setUploadDescription("");
    setUploadTags("");
    setUploadedFile(null);
    notify(`"${newMaterial.title}" uploaded and saved successfully!`);
  }

  // Edit handler
  function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editMaterial) return;

    const courseObj = coursesList.find((c) => c.code === editMaterial.courseCode);
    const updatedMaterial = {
      ...editMaterial,
      courseName: courseObj ? courseObj.name : editMaterial.courseName,
    };

    const updated = materials.map((m) =>
      m.id === updatedMaterial.id ? updatedMaterial : m
    );
    persist(updated);
    if (previewMaterial && previewMaterial.id === updatedMaterial.id) {
      setPreviewMaterial(updatedMaterial);
    }
    setEditMaterial(null);
    notify("Material details updated.");
  }

  // Delete execution
  function confirmDelete() {
    if (!materialToDelete) return;
    const updated = materials.filter((m) => m.id !== materialToDelete.id);
    persist(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== materialToDelete.id));
    if (previewMaterial?.id === materialToDelete.id) {
      setPreviewMaterial(null);
    }
    notify(`"${materialToDelete.title}" deleted successfully.`);
    setMaterialToDelete(null);
  }

  // Toggle Publish / Draft
  function toggleStatus(item: InstructorMaterial) {
    const nextStatus = item.status === "Published" ? "Draft" : "Published";
    const updated = materials.map((m) =>
      m.id === item.id ? { ...m, status: nextStatus as "Published" | "Draft" } : m
    );
    persist(updated);
    if (previewMaterial?.id === item.id) {
      setPreviewMaterial({ ...item, status: nextStatus });
    }
    notify(`"${item.title}" is now set to ${nextStatus}.`);
  }

  // Download simulation
  function triggerDownload(item: InstructorMaterial) {
    if (item.fileData) {
      const a = document.createElement("a");
      a.href = item.fileData;
      a.download = item.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      notify(`Preparing download for ${item.fileName}...`, "info");
    }

    const updated = materials.map((m) =>
      m.id === item.id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m
    );
    persist(updated);
    if (previewMaterial?.id === item.id) {
      setPreviewMaterial({ ...item, downloadsCount: item.downloadsCount + 1 });
    }
  }

  // Copy shareable link
  function handleCopyShareLink(item: InstructorMaterial) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/student/materials?search=${encodeURIComponent(item.title)}`
      );
      notify("Student access link copied to clipboard!");
    } else {
      notify("Link copied: /student/materials");
    }
  }

  // Bulk actions
  function handleSelectAll() {
    if (selectedIds.length === filteredMaterials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMaterials.map((m) => m.id));
    }
  }

  function toggleSelectItem(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleBulkStatus(status: "Published" | "Draft") {
    if (selectedIds.length === 0) return;
    const updated = materials.map((m) =>
      selectedIds.includes(m.id) ? { ...m, status } : m
    );
    persist(updated);
    notify(`${selectedIds.length} materials updated to ${status}.`);
    setSelectedIds([]);
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected materials?`
      )
    ) {
      const updated = materials.filter((m) => !selectedIds.includes(m.id));
      persist(updated);
      notify(`${selectedIds.length} materials deleted.`);
      setSelectedIds([]);
    }
  }

  // Filtered & Sorted list
  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();

    return materials
      .filter((item) => {
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.courseCode.toLowerCase().includes(q) ||
          item.courseName.toLowerCase().includes(q) ||
          item.fileName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

        const matchesCourse =
          courseFilter === "All Courses" || item.courseCode === courseFilter;

        const matchesCategory =
          categoryFilter === "All Categories" || item.category === categoryFilter;

        const matchesType =
          typeFilter === "All Types" || item.type === typeFilter;

        const matchesStatus =
          statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesCourse && matchesCategory && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "downloads") return b.downloadsCount - a.downloadsCount;
        if (sortBy === "oldest")
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });
  }, [materials, search, courseFilter, categoryFilter, typeFilter, statusFilter, sortBy]);

  const totalPublished = materials.filter((m) => m.status === "Published").length;
  const totalDownloads = materials.reduce((acc, m) => acc + m.downloadsCount, 0);
  const coveredCoursesCount = new Set(materials.map((m) => m.courseCode)).size;

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-4 text-slate-800 sm:p-6 lg:p-8">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-[#0E2A47] text-white border border-[#D5AE48]/40"
              : toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={19} className="text-[#D5AE48] shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle size={19} className="text-white shrink-0" />
          ) : (
            <Sparkles size={19} className="text-[#D5AE48] shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-white/70 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/instructor/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E2A47] transition hover:text-[#D5AE48]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/instructor/mycourse"
              className="text-xs font-semibold text-slate-600 hover:text-[#0E2A47] underline underline-offset-4"
            >
              My Courses
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/instructor/assignments"
              className="text-xs font-semibold text-slate-600 hover:text-[#0E2A47] underline underline-offset-4"
            >
              Assignments
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/instructor/quizzes"
              className="text-xs font-semibold text-slate-600 hover:text-[#0E2A47] underline underline-offset-4"
            >
              Quizzes & Exams
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <header className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-[#07192B] via-[#0E2A47] to-[#173C5F] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-20 right-48 h-48 w-48 rounded-full bg-[#D5AE48]/15 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D5AE48]/30 bg-[#D5AE48]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E0BE61]">
                <FileText size={15} />
                INSTRUCTOR LEARNING RESOURCES & FILES
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Course Materials & Slides
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-300">
                Centralized hub for all syllabus docs, presentation decks, reading guides, code packages, and lab exercises. Files marked as <strong>Published</strong> are accessible instantly by your students.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleResetSeed}
                title="Reset to default seed data"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <RefreshCw size={14} />
                Reset Data
              </button>

              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-5 py-3 text-sm font-bold text-[#07192B] shadow-lg transition hover:bg-[#E0BE61] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={18} />
                Upload New Material
              </button>
            </div>
          </div>
        </header>

        {/* Quick Statistics Bar */}
        <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Materials"
            value={materials.length}
            subtitle="Uploaded teaching files"
            badge="Library"
            icon={<FileText size={22} />}
          />
          <StatCard
            title="Published & Live"
            value={totalPublished}
            subtitle="Visible to enrolled students"
            badge="Active"
            icon={<CheckCircle2 size={22} />}
          />
          <StatCard
            title="Courses Covered"
            value={coveredCoursesCount}
            subtitle={`Across ${coursesList.length} assigned courses`}
            badge="Coverage"
            icon={<BookOpen size={22} />}
          />
          <StatCard
            title="Total Downloads"
            value={totalDownloads}
            subtitle="Student engagement count"
            badge="Traffic"
            icon={<Download size={22} />}
          />
        </section>

        {/* Category Pills Quick Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {[
            "All Categories",
            "Lecture Slides",
            "Lecture Notes",
            "Syllabus",
            "Lab Exercises",
            "Reference Book",
          ].map((cat) => {
            const isActive = categoryFilter === cat;
            const count =
              cat === "All Categories"
                ? materials.length
                : materials.filter((m) => m.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0E2A47] text-white shadow-md shadow-[#0E2A47]/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#D5AE48] hover:text-[#0E2A47]"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-[#D5AE48] text-[#07192B]"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Filter & View Controls */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#0E2A47]">Materials Catalog</h2>
              <p className="text-xs text-slate-500">
                Filter, organize, preview, download, or edit all instructor course resources
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Showing {filteredMaterials.length} of {materials.length} resources
              </span>

              {/* View Switcher */}
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === "grid"
                      ? "bg-white text-[#0E2A47] shadow-sm font-bold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="Table List View"
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === "list"
                      ? "bg-white text-[#0E2A47] shadow-sm font-bold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, tag, file..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-xs outline-none transition focus:border-amber-500 focus:bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
            >
              <option>All Courses</option>
              {coursesList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>

            {/* File Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
            >
              <option>All Types</option>
              <option value="PDF">PDF Documents</option>
              <option value="PPTX">PowerPoint (PPTX)</option>
              <option value="DOCX">Word (DOCX)</option>
              <option value="XLSX">Spreadsheet (XLSX)</option>
              <option value="ZIP">Archive (ZIP)</option>
              <option value="VIDEO">Video Files</option>
              <option value="TXT">Text Files</option>
            </select>

            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "Published" | "Draft")
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Status</option>
              <option value="Published">Published (Live)</option>
              <option value="Draft">Draft (Hidden)</option>
            </select>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "newest" | "oldest" | "title" | "downloads"
                )
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
            >
              <option value="newest">Sort: Newest Uploads</option>
              <option value="oldest">Sort: Oldest Uploads</option>
              <option value="downloads">Sort: Most Downloaded</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>

          {/* Bulk Selection Bar */}
          {filteredMaterials.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-[#0E2A47]"
                >
                  {selectedIds.length === filteredMaterials.length &&
                  filteredMaterials.length > 0 ? (
                    <CheckSquare size={16} className="text-[#0E2A47]" />
                  ) : (
                    <Square size={16} className="text-slate-400" />
                  )}
                  <span>
                    Select All ({selectedIds.length}/{filteredMaterials.length})
                  </span>
                </button>
              </div>

              {selectedIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#0E2A47]">
                    {selectedIds.length} item(s) selected:
                  </span>
                  <button
                    onClick={() => handleBulkStatus("Published")}
                    className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    Mark Published
                  </button>
                  <button
                    onClick={() => handleBulkStatus("Draft")}
                    className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100"
                  >
                    Mark Draft
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-slate-400 hover:text-slate-600 underline px-1"
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Empty state */}
        {filteredMaterials.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <FileText size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0E2A47]">
              No teaching materials found
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              No files matched your search or selected filters. Try searching for different keywords or resetting filters.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearch("");
                  setCourseFilter("All Courses");
                  setCategoryFilter("All Categories");
                  setTypeFilter("All Types");
                  setStatusFilter("ALL");
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#173C5F]"
              >
                + Upload Resource
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D5AE48]/70 hover:shadow-lg ${
                    isSelected ? "border-[#0E2A47] ring-2 ring-[#0E2A47]/20" : "border-slate-200"
                  }`}
                >
                  <div>
                    {/* Top Badges, Checkbox & Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSelectItem(item.id)}
                          className="text-slate-400 hover:text-[#0E2A47]"
                        >
                          {isSelected ? (
                            <CheckSquare size={17} className="text-[#0E2A47]" />
                          ) : (
                            <Square size={17} />
                          )}
                        </button>
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">
                          {item.courseCode}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {item.category}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleStatus(item)}
                        title="Click to toggle publish status"
                        className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-bold transition hover:opacity-80 ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </button>
                    </div>

                    {/* Title & Type Icon */}
                    <div className="mt-4 flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 p-2.5 shadow-inner">
                        <MaterialIcon type={item.type} />
                      </div>

                      <div className="min-w-0">
                        <h3
                          onClick={() => {
                            setPreviewMaterial(item);
                            setPreviewTab("details");
                          }}
                          className="cursor-pointer text-sm font-bold text-[#0E2A47] transition hover:text-amber-600 leading-snug line-clamp-2"
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">
                          {item.weekOrLesson} · {item.courseName}
                        </p>
                      </div>
                    </div>

                    {/* Description snippet */}
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-100"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Metadata & Action Buttons */}
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[170px]" title={item.fileName}>
                        {item.fileName}
                      </span>
                      <span className="font-semibold text-slate-600">{item.fileSize}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Download size={13} className="text-amber-600" />
                        <span className="font-semibold">{item.downloadsCount}</span>
                        <span className="text-slate-400 text-[11px]">downloads</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setPreviewMaterial(item);
                            setPreviewTab("preview");
                          }}
                          title="Interactive Preview"
                          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#0E2A47]"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={() => handleCopyShareLink(item)}
                          title="Share student link"
                          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#0E2A47]"
                        >
                          <Share2 size={13} />
                        </button>

                        <button
                          onClick={() => triggerDownload(item)}
                          title="Download file"
                          className="inline-flex items-center gap-1 rounded-xl bg-[#0E2A47] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                        >
                          <Download size={13} />
                          Get
                        </button>

                        <button
                          onClick={() => setEditMaterial(item)}
                          title="Edit material details"
                          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#0E2A47]"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          onClick={() => setMaterialToDelete(item)}
                          title="Delete material"
                          className="rounded-xl border border-red-100 p-2 text-red-500 transition hover:bg-red-50 hover:border-red-200"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          /* LIST / TABLE VIEW */
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                  <tr>
                    <th className="p-4 w-10">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-slate-400 hover:text-[#0E2A47]"
                      >
                        {selectedIds.length === filteredMaterials.length &&
                        filteredMaterials.length > 0 ? (
                          <CheckSquare size={16} className="text-[#0E2A47]" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="p-4">Resource & Format</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Size & Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Downloads</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`transition hover:bg-slate-50/80 ${
                          isSelected ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => toggleSelectItem(item.id)}
                            className="text-slate-400 hover:text-[#0E2A47]"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-[#0E2A47]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-2 shadow-inner">
                              <MaterialIcon type={item.type} />
                            </div>
                            <div>
                              <p
                                onClick={() => {
                                  setPreviewMaterial(item);
                                  setPreviewTab("details");
                                }}
                                className="cursor-pointer font-bold text-[#0E2A47] hover:text-amber-600 line-clamp-1"
                              >
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {item.weekOrLesson} · {item.fileName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">
                            {item.courseCode}
                          </span>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[140px]">
                            {item.courseName}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-700">{item.fileSize}</p>
                          <p className="text-[11px] text-slate-400">{item.uploadedAt}</p>
                        </td>
                        <td className="p-4">
                          <span
                            onClick={() => toggleStatus(item)}
                            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              item.status === "Published"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700">
                          {item.downloadsCount}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setPreviewMaterial(item);
                                setPreviewTab("preview");
                              }}
                              title="Preview"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0E2A47]"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => triggerDownload(item)}
                              title="Download"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0E2A47]"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => setEditMaterial(item)}
                              title="Edit"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0E2A47]"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setMaterialToDelete(item)}
                              title="Delete"
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* UPLOAD MATERIAL MODAL */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#07192B] to-[#0E2A47] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#D5AE48] p-2 text-[#07192B]">
                  <Upload size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Upload Course Resource</h2>
                  <p className="text-xs text-slate-300">
                    Add slides, notes, assignments resources, or lab guides
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Resource Title *
                </label>
                <input
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Chapter 4: Database Normalization Slides"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Assign to Course *
                  </label>
                  <select
                    value={uploadCourseCode}
                    onChange={(e) => setUploadCourseCode(e.target.value)}
                    className={inputClass}
                  >
                    {coursesList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Resource Category *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) =>
                      setUploadCategory(
                        e.target.value as InstructorMaterial["category"]
                      )
                    }
                    className={inputClass}
                  >
                    <option>Lecture Slides</option>
                    <option>Lecture Notes</option>
                    <option>Syllabus</option>
                    <option>Lab Exercises</option>
                    <option>Reference Book</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Week or Lecture Identifier
                  </label>
                  <input
                    value={uploadWeek}
                    onChange={(e) => setUploadWeek(e.target.value)}
                    placeholder="e.g. Week 4 · Lecture 2"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Publication Status
                  </label>
                  <select
                    value={uploadStatus}
                    onChange={(e) =>
                      setUploadStatus(e.target.value as "Published" | "Draft")
                    }
                    className={inputClass}
                  >
                    <option value="Published">Published (Students can see)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Topic Description & Instructions
                </label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Explain topics covered, prerequisites, and student expectations..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Keywords & Tags (comma separated)
                </label>
                <input
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="e.g. Normalization, SQL, ER Diagrams"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Select File from Computer (PPTX, PDF, DOCX, XLSX, ZIP)
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#D5AE48] hover:bg-amber-50/40">
                  <div className="mb-2 rounded-full bg-amber-100 p-2 text-amber-800">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-bold text-[#0E2A47]">
                    {uploadedFile ? uploadedFile.name : "Click or drag & drop file to browse"}
                  </span>
                  <span className="mt-1 text-[11px] text-slate-400">
                    PDF, PPTX, DOCX, XLSX, ZIP, MP4 up to 25 MB
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.zip,.txt,.mp4"
                    className="sr-only"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {uploadedFile && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-100 px-3 py-1.5 text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[280px]">
                      {uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F] disabled:opacity-60 shadow-md"
                >
                  <Upload size={14} />
                  {uploading ? "Uploading..." : "Publish Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MATERIAL MODAL */}
      {editMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#07192B] to-[#0E2A47] px-6 py-5 text-white">
              <div className="flex items-center gap-2">
                <Pencil size={18} className="text-[#D5AE48]" />
                <h3 className="font-bold text-lg">Edit Material Details</h3>
              </div>
              <button
                onClick={() => setEditMaterial(null)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Resource Title *
                </label>
                <input
                  required
                  value={editMaterial.title}
                  onChange={(e) =>
                    setEditMaterial({ ...editMaterial, title: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Course Code
                  </label>
                  <select
                    value={editMaterial.courseCode}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        courseCode: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {coursesList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    value={editMaterial.category}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        category: e.target.value as InstructorMaterial["category"],
                      })
                    }
                    className={inputClass}
                  >
                    <option>Lecture Slides</option>
                    <option>Lecture Notes</option>
                    <option>Syllabus</option>
                    <option>Lab Exercises</option>
                    <option>Reference Book</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Status
                  </label>
                  <select
                    value={editMaterial.status}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        status: e.target.value as "Published" | "Draft",
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Week or Lesson Identifier
                  </label>
                  <input
                    value={editMaterial.weekOrLesson}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        weekOrLesson: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Topic Description
                </label>
                <textarea
                  rows={3}
                  value={editMaterial.description}
                  onChange={(e) =>
                    setEditMaterial({
                      ...editMaterial,
                      description: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditMaterial(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE PREVIEW MATERIAL MODAL */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#07192B] to-[#0E2A47] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2.5">
                  <MaterialIcon type={previewMaterial.type} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E0BE61]">
                      {previewMaterial.courseCode} · {previewMaterial.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        previewMaterial.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {previewMaterial.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-tight mt-0.5">
                    {previewMaterial.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-bold">
              <button
                onClick={() => setPreviewTab("details")}
                className={`py-3 px-4 border-b-2 transition ${
                  previewTab === "details"
                    ? "border-[#0E2A47] text-[#0E2A47]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                Resource Metadata
              </button>
              <button
                onClick={() => setPreviewTab("preview")}
                className={`py-3 px-4 border-b-2 transition ${
                  previewTab === "preview"
                    ? "border-[#0E2A47] text-[#0E2A47]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                Document Outline & Preview
              </button>
            </div>

            <div className="p-6 space-y-4">
              {previewTab === "details" ? (
                <>
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Course Name</span>
                      <span className="font-bold text-[#0E2A47]">
                        {previewMaterial.courseName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">File Name</span>
                      <span className="font-mono text-slate-800 break-all">
                        {previewMaterial.fileName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">File Size & Format</span>
                      <span className="font-semibold text-slate-700">
                        {previewMaterial.fileSize} · {previewMaterial.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Week / Milestone</span>
                      <span className="font-semibold text-slate-700">
                        {previewMaterial.weekOrLesson}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date Uploaded</span>
                      <span className="font-semibold text-slate-700">
                        {previewMaterial.uploadedAt}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Downloads</span>
                      <span className="font-bold text-amber-700">
                        {previewMaterial.downloadsCount} student downloads
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-1.5">
                      Description & Learning Topics
                    </h4>
                    <p className="text-xs leading-6 text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
                      {previewMaterial.description}
                    </p>
                  </div>

                  {previewMaterial.tags && previewMaterial.tags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 mb-1.5">Keywords & Topics</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {previewMaterial.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white text-xs">
                  <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <MaterialIcon type={previewMaterial.type} />
                      <span className="font-mono font-bold text-amber-400">
                        {previewMaterial.fileName}
                      </span>
                    </div>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                      Read Mode
                    </span>
                  </div>

                  <div className="space-y-3 font-sans leading-relaxed text-slate-200">
                    <p className="font-bold text-base text-white">
                      {previewMaterial.title}
                    </p>
                    <p className="text-slate-400 text-xs">
                      Module: {previewMaterial.weekOrLesson} | Course: {previewMaterial.courseCode} ({previewMaterial.courseName})
                    </p>

                    <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                      <h5 className="font-bold text-amber-400 mb-2">Key Highlights & Syllabus Summary:</h5>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                        <li>Core conceptual framework and theoretical foundations.</li>
                        <li>Detailed examples and implementation walkthroughs.</li>
                        <li>Practice problem sets and recommended student exercises.</li>
                        <li>Referenced reading materials and next week preparation.</li>
                      </ul>
                    </div>

                    <p className="text-slate-400 italic text-[11px]">
                      Full document preview rendered from local file storage ({previewMaterial.fileSize}).
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleStatus(previewMaterial)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    previewMaterial.status === "Published"
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  Set to {previewMaterial.status === "Published" ? "Draft" : "Published"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(previewMaterial)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Share2 size={13} />
                    Copy Link
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerDownload(previewMaterial);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-bold text-white hover:bg-[#173C5F] shadow-sm"
                  >
                    <Download size={14} />
                    Download File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
              <Trash2 size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#0E2A47]">Delete Course Material?</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete <strong>&quot;{materialToDelete.title}&quot;</strong> ({materialToDelete.courseCode})? Students will no longer be able to access or download this resource.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-md shadow-red-600/20"
              >
                Yes, Delete Material
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100";

function StatCard({
  title,
  value,
  subtitle,
  badge,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  badge: string;
  icon: ReactNode;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-amber-50 p-3 text-amber-700 shadow-sm">{icon}</div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {badge}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-black text-[#0E2A47]">{value}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </article>
  );
}
