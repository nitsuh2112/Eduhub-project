"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Layers3,
  Search,
  Users,
  FileText,
  ClipboardList,
  BarChart3,
  Plus,
  X,
  Eye,
  Pencil,
  Filter,
  BookMarked,
  Sparkles,
  Download,
  Trash2,
  Upload,
  HelpCircle,
  Award,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

type Course = {
  id: string;
  code: string;
  title: string;
  department: string;
  semester: string;
  academicYear: string;
  students: number;
  credits: number;
  lessons: number;
  completedLessons: number;
  assignments: number;
  quizzes: number;
  status: "Active" | "Draft";
  description: string;
  color: string;
};

type Material = {
  id: string;
  title: string;
  type: "Slides" | "PDF Document" | "Syllabus" | "Code Example" | "Notes";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  lessonNumber?: number;
};

type EnrolledStudent = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  attendance: number;
  grade: string;
  progress: number;
};

type Quiz = {
  id: string;
  title: string;
  questionsCount: number;
  durationMinutes: number;
  totalPoints: number;
  dueDate: string;
  status: "Published" | "Draft";
  attemptsCount: number;
};

type LocalAssignment = {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  points: number;
};

const COURSES_STORAGE_KEY = "eduhub_instructor_courses";

const initialCourses: Course[] = [
  {
    id: "1",
    code: "CS101",
    title: "Introduction to Computer Science",
    department: "Computer Science",
    semester: "Semester 1",
    academicYear: "2025/2026",
    students: 48,
    credits: 3,
    lessons: 24,
    completedLessons: 18,
    assignments: 4,
    quizzes: 3,
    status: "Active",
    description:
      "An introduction to fundamental computer science concepts, algorithms, programming, and computational thinking.",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "2",
    code: "CS202",
    title: "Database Management Systems",
    department: "Computer Science",
    semester: "Semester 1",
    academicYear: "2025/2026",
    students: 42,
    credits: 3,
    lessons: 30,
    completedLessons: 21,
    assignments: 5,
    quizzes: 4,
    status: "Active",
    description:
      "Learn relational databases, SQL queries, data modeling, normalization, indexing, and database administration.",
    color: "from-violet-600 to-purple-700",
  },
  {
    id: "3",
    code: "CS203",
    title: "Object-Oriented Programming",
    department: "Software Engineering",
    semester: "Semester 1",
    academicYear: "2025/2026",
    students: 36,
    credits: 4,
    lessons: 28,
    completedLessons: 15,
    assignments: 3,
    quizzes: 2,
    status: "Active",
    description:
      "Study classes, objects, inheritance, encapsulation, polymorphism, design patterns, and practical Java/C++ programming.",
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "4",
    code: "SE301",
    title: "Software Engineering",
    department: "Software Engineering",
    semester: "Semester 2",
    academicYear: "2025/2026",
    students: 32,
    credits: 3,
    lessons: 26,
    completedLessons: 8,
    assignments: 2,
    quizzes: 1,
    status: "Active",
    description:
      "Explore software development life cycles (SDLC), Agile Scrum methodologies, requirements analysis, architecture, and testing.",
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "5",
    code: "IT201",
    title: "Computer Networks",
    department: "Information Technology",
    semester: "Semester 2",
    academicYear: "2025/2026",
    students: 0,
    credits: 3,
    lessons: 20,
    completedLessons: 0,
    assignments: 0,
    quizzes: 0,
    status: "Draft",
    description:
      "An overview of network architectures, OSI and TCP/IP models, routing protocols, subnetting, and network security fundamentals.",
    color: "from-pink-600 to-rose-700",
  },
];

const departments = [
  "All Departments",
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Information Systems",
];

const DEFAULT_MATERIALS_BY_COURSE: Record<string, Material[]> = {
  CS101: [
    {
      id: "mat-1",
      title: "Course Syllabus & Schedule",
      type: "Syllabus",
      fileName: "CS101_Syllabus_2025_2026.pdf",
      fileSize: "450 KB",
      uploadedAt: "2026-10-01",
      lessonNumber: 1,
    },
    {
      id: "mat-2",
      title: "Lecture 1: Algorithms & Flowcharts",
      type: "Slides",
      fileName: "CS101_Lecture01_Algorithms.pdf",
      fileSize: "2.4 MB",
      uploadedAt: "2026-10-04",
      lessonNumber: 1,
    },
    {
      id: "mat-3",
      title: "Variables, Data Types & Control Flow",
      type: "PDF Document",
      fileName: "CS101_Lecture02_Variables.pdf",
      fileSize: "1.8 MB",
      uploadedAt: "2026-10-10",
      lessonNumber: 2,
    },
  ],
  CS202: [
    {
      id: "mat-4",
      title: "Database System Concepts - Ch. 1 & 2",
      type: "Slides",
      fileName: "CS202_Relational_Model_Slides.pdf",
      fileSize: "3.2 MB",
      uploadedAt: "2026-10-02",
      lessonNumber: 1,
    },
    {
      id: "mat-5",
      title: "SQL Query Cheat Sheet & Practice Exercises",
      type: "PDF Document",
      fileName: "SQL_Exercises_and_Solutions.pdf",
      fileSize: "980 KB",
      uploadedAt: "2026-10-08",
      lessonNumber: 3,
    },
  ],
  CS203: [
    {
      id: "mat-6",
      title: "OOP Principles: Inheritance & Polymorphism",
      type: "Slides",
      fileName: "OOP_Inheritance_Polymorphism.pdf",
      fileSize: "2.8 MB",
      uploadedAt: "2026-10-05",
      lessonNumber: 2,
    },
    {
      id: "mat-7",
      title: "Sample Code: Design Patterns in Java",
      type: "Code Example",
      fileName: "DesignPatternsDemo.zip",
      fileSize: "1.1 MB",
      uploadedAt: "2026-10-12",
      lessonNumber: 4,
    },
  ],
};

const DEFAULT_STUDENTS: EnrolledStudent[] = [
  {
    id: "std-1",
    studentId: "ETS-0142",
    name: "Abebe Bikila",
    email: "abebe.b@eduhub.edu",
    avatar: "AB",
    attendance: 94,
    grade: "A",
    progress: 85,
  },
  {
    id: "std-2",
    studentId: "ETS-0284",
    name: "Sara Tadesse",
    email: "sara.t@eduhub.edu",
    avatar: "ST",
    attendance: 88,
    grade: "B+",
    progress: 78,
  },
  {
    id: "std-3",
    studentId: "ETS-0319",
    name: "Dawit Yohannes",
    email: "dawit.y@eduhub.edu",
    avatar: "DY",
    attendance: 96,
    grade: "A",
    progress: 92,
  },
  {
    id: "std-4",
    studentId: "ETS-0401",
    name: "Meron Alemu",
    email: "meron.a@eduhub.edu",
    avatar: "MA",
    attendance: 82,
    grade: "B",
    progress: 70,
  },
  {
    id: "std-5",
    studentId: "ETS-0512",
    name: "Kidus Girma",
    email: "kidus.g@eduhub.edu",
    avatar: "KG",
    attendance: 78,
    grade: "C+",
    progress: 62,
  },
  {
    id: "std-6",
    studentId: "ETS-0628",
    name: "Tigist Haile",
    email: "tigist.h@eduhub.edu",
    avatar: "TH",
    attendance: 92,
    grade: "A-",
    progress: 88,
  },
];

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Quiz 1: Fundamentals & Basic Concepts",
    questionsCount: 15,
    durationMinutes: 25,
    totalPoints: 15,
    dueDate: "2026-10-25",
    status: "Published",
    attemptsCount: 38,
  },
  {
    id: "quiz-2",
    title: "Midterm Assessment Quiz",
    questionsCount: 25,
    durationMinutes: 45,
    totalPoints: 25,
    dueDate: "2026-11-05",
    status: "Published",
    attemptsCount: 0,
  },
];

type Tab =
  | "Overview"
  | "Materials"
  | "Assignments"
  | "Quizzes"
  | "Students"
  | "Progress";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [semester, setSemester] = useState("All Semesters");
  const [status, setStatus] = useState("All Status");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  // Create course modal
  const [showCreate, setShowCreate] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Computer Science");
  const [newSemester, setNewSemester] = useState("Semester 1");
  const [newCredits, setNewCredits] = useState("3");
  const [newDescription, setNewDescription] = useState("");

  // Edit course modal
  const [showEdit, setShowEdit] = useState(false);
  const [editCourseData, setEditCourseData] = useState<Course | null>(null);

  // Materials state for selected course
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialType, setMaterialType] = useState<Material["type"]>("Slides");
  const [materialFileName, setMaterialFileName] = useState("");

  // Enrolled students state
  const [students, setStudents] = useState<EnrolledStudent[]>([]);

  // Quizzes state
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState("10");
  const [quizDuration, setQuizDuration] = useState("20");
  const [quizPoints, setQuizPoints] = useState("10");
  const [quizDueDate, setQuizDueDate] = useState("");

  // Real assignments loaded from localStorage
  const [courseAssignments, setCourseAssignments] = useState<LocalAssignment[]>([]);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function notify(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Load courses on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COURSES_STORAGE_KEY);
      if (stored) {
        setCourses(JSON.parse(stored));
      } else {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
        setCourses(initialCourses);
      }
    } catch {
      setCourses(initialCourses);
    }
  }, []);

  // Save courses whenever updated
  function persistCourses(newCourses: Course[]) {
    setCourses(newCourses);
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(newCourses));
    } catch {
      // Storage quota or disabled
    }
  }

  // Load course details when course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    // Load Materials
    const matKey = `eduhub_materials_${selectedCourse.code}`;
    const storedMat = localStorage.getItem(matKey);
    if (storedMat) {
      setMaterials(JSON.parse(storedMat));
    } else {
      const defaultMats = DEFAULT_MATERIALS_BY_COURSE[selectedCourse.code] || [];
      setMaterials(defaultMats);
      localStorage.setItem(matKey, JSON.stringify(defaultMats));
    }

    // Load Students
    const stdKey = `eduhub_students_${selectedCourse.code}`;
    const storedStd = localStorage.getItem(stdKey);
    if (storedStd) {
      setStudents(JSON.parse(storedStd));
    } else {
      setStudents(DEFAULT_STUDENTS);
      localStorage.setItem(stdKey, JSON.stringify(DEFAULT_STUDENTS));
    }

    // Load Quizzes
    const qzKey = `eduhub_quizzes_${selectedCourse.code}`;
    const storedQz = localStorage.getItem(qzKey);
    if (storedQz) {
      setQuizzes(JSON.parse(storedQz));
    } else {
      setQuizzes(DEFAULT_QUIZZES);
      localStorage.setItem(qzKey, JSON.stringify(DEFAULT_QUIZZES));
    }

    // Load actual course assignments from localStorage
    try {
      const storedAssignments = localStorage.getItem("eduhub_assignments");
      if (storedAssignments) {
        const parsed: LocalAssignment[] = JSON.parse(storedAssignments);
        const matching = parsed.filter(
          (a) => a.courseCode === selectedCourse.code
        );
        setCourseAssignments(matching);
      } else {
        setCourseAssignments([]);
      }
    } catch {
      setCourseAssignments([]);
    }
  }, [selectedCourse]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.department.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" || course.department === department;

      const matchesSemester =
        semester === "All Semesters" || course.semester === semester;

      const matchesStatus =
        status === "All Status" || course.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSemester &&
        matchesStatus
      );
    });
  }, [courses, search, department, semester, status]);

  const activeCount = courses.filter((c) => c.status === "Active").length;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalCredits = courses.reduce(
    (sum, c) => sum + (c.status === "Active" ? c.credits : 0),
    0
  );
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);

  function openCourse(course: Course, tab: Tab = "Overview") {
    setSelectedCourse(course);
    setActiveTab(tab);
  }

  function handleCreateCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const code = newCode.trim().toUpperCase();
    const title = newTitle.trim();

    if (!code || !title) {
      notify("Please enter course code and title.", "error");
      return;
    }

    if (courses.some((c) => c.code.toLowerCase() === code.toLowerCase())) {
      notify("A course with this code already exists.", "error");
      return;
    }

    const gradients = [
      "from-blue-600 to-indigo-700",
      "from-violet-600 to-purple-700",
      "from-amber-600 to-orange-700",
      "from-emerald-600 to-teal-700",
      "from-rose-600 to-pink-700",
      "from-cyan-600 to-blue-700",
    ];
    const randomColor = gradients[Math.floor(Math.random() * gradients.length)];

    const newCourse: Course = {
      id: `${Date.now()}`,
      code,
      title,
      department: newDepartment,
      semester: newSemester,
      academicYear: "2025/2026",
      students: 35,
      credits: Number(newCredits) || 3,
      lessons: 24,
      completedLessons: 0,
      assignments: 0,
      quizzes: 0,
      status: "Active",
      description:
        newDescription.trim() ||
        "Comprehensive course curriculum designed for academic excellence.",
      color: randomColor,
    };

    const updated = [newCourse, ...courses];
    persistCourses(updated);
    setShowCreate(false);
    setNewCode("");
    setNewTitle("");
    setNewCredits("3");
    setNewDescription("");
    notify(`${code} created successfully!`);
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editCourseData) return;

    const updated = courses.map((c) =>
      c.id === editCourseData.id ? editCourseData : c
    );
    persistCourses(updated);
    if (selectedCourse?.id === editCourseData.id) {
      setSelectedCourse(editCourseData);
    }
    setShowEdit(false);
    notify("Course details updated.");
  }

  function toggleCourseStatus(course: Course) {
    const nextStatus = course.status === "Active" ? "Draft" : "Active";
    const updated = courses.map((c) =>
      c.id === course.id ? { ...c, status: nextStatus as "Active" | "Draft" } : c
    );
    persistCourses(updated);
    if (selectedCourse?.id === course.id) {
      setSelectedCourse({ ...course, status: nextStatus });
    }
    notify(`${course.code} marked as ${nextStatus}.`);
  }

  function deleteCourse(course: Course) {
    const confirmed = window.confirm(
      `Delete "${course.code} - ${course.title}"? This will remove all materials, quizzes, and records for this course.`
    );
    if (!confirmed) return;

    const updated = courses.filter((c) => c.id !== course.id);
    persistCourses(updated);
    localStorage.removeItem(`eduhub_materials_${course.code}`);
    localStorage.removeItem(`eduhub_students_${course.code}`);
    localStorage.removeItem(`eduhub_quizzes_${course.code}`);

    setSelectedCourse(null);
    notify(`${course.code} has been deleted.`);
  }

  // Material Upload
  function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse || !materialTitle.trim()) return;

    const newMat: Material = {
      id: `mat-${Date.now()}`,
      title: materialTitle.trim(),
      type: materialType,
      fileName: materialFileName.trim() || `${materialTitle.trim().replace(/\s+/g, "_")}.pdf`,
      fileSize: "1.5 MB",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newMat, ...materials];
    setMaterials(updated);
    localStorage.setItem(`eduhub_materials_${selectedCourse.code}`, JSON.stringify(updated));
    setShowAddMaterial(false);
    setMaterialTitle("");
    setMaterialFileName("");
    notify("Material uploaded successfully!");
  }

  function handleDeleteMaterial(matId: string) {
    if (!selectedCourse) return;
    const updated = materials.filter((m) => m.id !== matId);
    setMaterials(updated);
    localStorage.setItem(`eduhub_materials_${selectedCourse.code}`, JSON.stringify(updated));
    notify("Material removed.");
  }

  // Quiz Add
  function handleAddQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse || !quizTitle.trim()) return;

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle.trim(),
      questionsCount: Number(quizQuestions) || 10,
      durationMinutes: Number(quizDuration) || 20,
      totalPoints: Number(quizPoints) || 10,
      dueDate: quizDueDate || new Date().toISOString().split("T")[0],
      status: "Published",
      attemptsCount: 0,
    };

    const updated = [newQuiz, ...quizzes];
    setQuizzes(updated);
    localStorage.setItem(`eduhub_quizzes_${selectedCourse.code}`, JSON.stringify(updated));
    setShowAddQuiz(false);
    setQuizTitle("");
    notify("New quiz published!");
  }

  // Complete a lesson progress
  function incrementLesson(course: Course) {
    if (course.completedLessons >= course.lessons) return;
    const nextCompleted = course.completedLessons + 1;
    const updated = courses.map((c) =>
      c.id === course.id ? { ...c, completedLessons: nextCompleted } : c
    );
    persistCourses(updated);
    setSelectedCourse({ ...course, completedLessons: nextCompleted });
    notify(`Lesson ${nextCompleted} marked completed!`);
  }

  function progress(course: Course) {
    return course.lessons
      ? Math.round((course.completedLessons / course.lessons) * 100)
      : 0;
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-slate-800">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-[#0E2A47] text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={19} className="text-[#D5AE48]" />
          ) : (
            <AlertCircle size={19} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/instructor/dashboard"
              className="inline-flex items-center gap-1.5 font-semibold text-[#0E2A47] transition hover:text-amber-600"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">My Courses</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <CalendarDays size={14} className="text-[#D5AE48]" />
            Academic Year 2025/2026
          </div>
        </div>

        {/* Hero Header */}
        <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-[#07192B] via-[#0E2A47] to-[#173C5F] p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border-[30px] border-white/5" />
          <div className="absolute -bottom-24 right-48 h-48 w-48 rounded-full bg-[#D5AE48]/10 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#E0BE61]">
                <BookOpen size={14} />
                INSTRUCTOR PORTAL
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Courses
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Manage your teaching curriculum, organize lecture slides and materials, review assignments, and monitor student progress.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-5 py-3 text-sm font-bold text-[#07192B] shadow-md transition hover:bg-[#E0BE61]"
            >
              <Plus size={18} />
              Create New Course
            </button>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<BookOpen size={21} />}
            label="Total Courses"
            value={courses.length}
            detail="Assigned teaching courses"
            iconClass="bg-blue-50 text-blue-700"
          />
          <StatCard
            icon={<CheckCircle2 size={21} />}
            label="Active Courses"
            value={activeCount}
            detail="Currently in session"
            iconClass="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            icon={<Users size={21} />}
            label="Total Students"
            value={totalStudents}
            detail="Enrolled across courses"
            iconClass="bg-amber-50 text-amber-700"
          />
          <StatCard
            icon={<Layers3 size={21} />}
            label="Teaching Credits"
            value={totalCredits}
            detail={`${totalLessons} scheduled lessons`}
            iconClass="bg-violet-50 text-violet-700"
          />
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#0E2A47]">Course Catalog</h2>
              <p className="text-xs text-slate-500">
                Filter and manage courses you currently instruct
              </p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_minmax(150px,0.8fr)_minmax(140px,0.7fr)]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search course title or code..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              />
            </div>

            <SelectFilter
              value={department}
              onChange={setDepartment}
              options={departments}
              icon={<Filter size={15} />}
            />

            <SelectFilter
              value={semester}
              onChange={setSemester}
              options={["All Semesters", "Semester 1", "Semester 2"]}
            />

            <SelectFilter
              value={status}
              onChange={setStatus}
              options={["All Status", "Active", "Draft"]}
            />
          </div>
        </section>

        {/* Course Cards Grid */}
        {filteredCourses.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D5AE48]/70 hover:shadow-lg"
              >
                {/* Course Card Top Banner */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-r ${course.color} px-5 py-5 text-white`}
                >
                  <div className="absolute -right-5 -top-10 h-32 w-32 rounded-full border-[18px] border-white/10" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-sm">
                      <GraduationCap size={22} />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        course.status === "Active"
                          ? "border-emerald-200/40 bg-emerald-400/20 text-white"
                          : "border-white/30 bg-white/15 text-white"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="relative mt-4">
                    <p className="text-xs font-bold tracking-widest text-white/80">
                      {course.code}
                    </p>
                    <h3 className="mt-1 min-h-[3rem] text-xl font-bold leading-snug">
                      {course.title}
                    </h3>
                  </div>
                </div>

                {/* Course Card Body */}
                <div className="p-5">
                  <p className="line-clamp-2 min-h-[2.6rem] text-xs leading-5 text-slate-500">
                    {course.description}
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {course.department}
                    </span>
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      {course.credits} Credits
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      {course.semester}
                    </span>
                  </div>

                  <div className="my-4 grid grid-cols-3 gap-2 border-y border-slate-100 py-3">
                    <MiniMetric
                      icon={<Users size={15} />}
                      value={course.students}
                      label="Students"
                    />
                    <MiniMetric
                      icon={<FileText size={15} />}
                      value={course.assignments}
                      label="Assignments"
                    />
                    <MiniMetric
                      icon={<ClipboardList size={15} />}
                      value={course.quizzes}
                      label="Quizzes"
                    />
                  </div>

                  {/* Progress Indicator */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500">
                        Course Progress
                      </span>
                      <span className="font-bold text-[#0E2A47]">
                        {progress(course)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D5AE48] to-[#E0BE61] transition-all duration-500"
                        style={{ width: `${progress(course)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      {course.completedLessons} of {course.lessons} lessons completed
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex items-center gap-2">
                    <button
                      onClick={() => openCourse(course)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0E2A47] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                    >
                      <Eye size={15} />
                      Manage Course
                      <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={() => {
                        setEditCourseData(course);
                        setShowEdit(true);
                      }}
                      title="Edit Course Details"
                      className="flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={25} />
            </div>
            <h3 className="mt-4 font-bold text-[#0E2A47]">No courses found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try another search term or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDepartment("All Departments");
                setSemester("All Semesters");
                setStatus("All Status");
              }}
              className="mt-5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-semibold text-white hover:bg-[#173C5F]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* CREATE COURSE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-[#0E2A47] px-6 py-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-[#D5AE48] p-2 text-[#07192B]">
                  <Plus size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Create New Course</h2>
                  <p className="text-xs text-slate-300">
                    Add a course to your instructor workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Course Code *">
                  <input
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CS301"
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Course Title *">
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Computer Graphics"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Department">
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className={inputClass}
                  >
                    {departments.slice(1).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Semester">
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className={inputClass}
                  >
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                  </select>
                </FormField>

                <FormField label="Credits">
                  <select
                    value={newCredits}
                    onChange={(e) => setNewCredits(e.target.value)}
                    className={inputClass}
                  >
                    <option value="2">2 Credits</option>
                    <option value="3">3 Credits</option>
                    <option value="4">4 Credits</option>
                    <option value="5">5 Credits</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Course Description">
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline topics covered and course objectives..."
                  className={inputClass}
                />
              </FormField>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                >
                  <Plus size={15} />
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {showEdit && editCourseData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-[#0E2A47] px-6 py-5 text-white">
              <div className="flex items-center gap-2">
                <Pencil size={18} className="text-[#D5AE48]" />
                <h3 className="font-bold text-lg">Edit Course Information</h3>
              </div>
              <button
                onClick={() => setShowEdit(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Course Code">
                  <input
                    required
                    value={editCourseData.code}
                    onChange={(e) =>
                      setEditCourseData({ ...editCourseData, code: e.target.value.toUpperCase() })
                    }
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Course Title">
                  <input
                    required
                    value={editCourseData.title}
                    onChange={(e) =>
                      setEditCourseData({ ...editCourseData, title: e.target.value })
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Department">
                  <select
                    value={editCourseData.department}
                    onChange={(e) =>
                      setEditCourseData({ ...editCourseData, department: e.target.value })
                    }
                    className={inputClass}
                  >
                    {departments.slice(1).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Credit Hours">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editCourseData.credits}
                    onChange={(e) =>
                      setEditCourseData({ ...editCourseData, credits: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  rows={3}
                  value={editCourseData.description}
                  onChange={(e) =>
                    setEditCourseData({ ...editCourseData, description: e.target.value })
                  }
                  className={inputClass}
                />
              </FormField>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
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

      {/* COMPREHENSIVE COURSE MANAGEMENT MODAL */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#07192B]/75 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedCourse(null);
          }}
        >
          <div className="my-auto max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-[#F5F7FA] shadow-2xl">
            {/* Modal Header */}
            <div
              className={`relative overflow-hidden bg-gradient-to-r ${selectedCourse.color} p-6 text-white sm:p-8`}
            >
              <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full border-[25px] border-white/10" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-white/80">
                    <span>{selectedCourse.code}</span>
                    <span>·</span>
                    <span>{selectedCourse.department}</span>
                  </div>
                  <h2 className="mt-2 max-w-2xl text-2xl font-bold sm:text-3xl">
                    {selectedCourse.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-white/80">
                    {selectedCourse.semester} · {selectedCourse.academicYear} · {selectedCourse.credits} Credits
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative mt-5 flex flex-wrap items-center gap-2.5 text-xs">
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 font-semibold">
                  {selectedCourse.status}
                </span>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 font-medium">
                  {selectedCourse.students} Students
                </span>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 font-medium">
                  {progress(selectedCourse)}% Lesson Progress
                </span>
              </div>
            </div>

            {/* Modal Content Tabs */}
            <div className="p-4 sm:p-6">
              {/* Tab Navigation */}
              <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {(
                  [
                    "Overview",
                    "Materials",
                    "Assignments",
                    "Quizzes",
                    "Students",
                    "Progress",
                  ] as Tab[]
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      activeTab === tab
                        ? "bg-[#0E2A47] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#0E2A47]"
                    }`}
                  >
                    {tab}
                    {tab === "Materials" && ` (${materials.length})`}
                    {tab === "Assignments" && ` (${courseAssignments.length})`}
                    {tab === "Students" && ` (${students.length})`}
                    {tab === "Quizzes" && ` (${quizzes.length})`}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "Overview" && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-[#0E2A47]">
                        Course Overview
                      </h3>
                      <button
                        onClick={() => {
                          setEditCourseData(selectedCourse);
                          setShowEdit(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
                      >
                        <Pencil size={13} />
                        Edit Details
                      </button>
                    </div>
                    <p className="text-xs leading-6 text-slate-600">
                      {selectedCourse.description}
                    </p>

                    <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                      <DetailRow label="Course Code" value={selectedCourse.code} />
                      <DetailRow label="Department" value={selectedCourse.department} />
                      <DetailRow label="Semester" value={selectedCourse.semester} />
                      <DetailRow label="Academic Year" value={selectedCourse.academicYear} />
                      <DetailRow label="Credits" value={`${selectedCourse.credits} Credit Hours`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SmallSummary
                      icon={<Users size={18} />}
                      label="Enrolled Students"
                      value={selectedCourse.students}
                    />
                    <SmallSummary
                      icon={<BookOpen size={18} />}
                      label="Planned Lessons"
                      value={selectedCourse.lessons}
                    />
                    <SmallSummary
                      icon={<FileText size={18} />}
                      label="Assignments"
                      value={courseAssignments.length}
                    />
                    <SmallSummary
                      icon={<ClipboardList size={18} />}
                      label="Quizzes"
                      value={quizzes.length}
                    />

                    {/* Progress Widget */}
                    <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Lesson Completion Progress
                        </span>
                        <span className="text-sm font-bold text-[#0E2A47]">
                          {progress(selectedCourse)}%
                        </span>
                      </div>
                      <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#D5AE48] to-[#E0BE61]"
                          style={{ width: `${progress(selectedCourse)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {selectedCourse.completedLessons} of {selectedCourse.lessons} lectures delivered
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MATERIALS */}
              {activeTab === "Materials" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#0E2A47]">
                        Course Slides & Reading Materials
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload lecture slides, syllabus, and study resources for students
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddMaterial(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#173C5F]"
                    >
                      <Plus size={15} />
                      Upload Material
                    </button>
                  </div>

                  {/* Add Material Inline Form */}
                  {showAddMaterial && (
                    <form
                      onSubmit={handleAddMaterial}
                      className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0E2A47]">
                          Add New Learning Resource
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddMaterial(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <input
                          required
                          value={materialTitle}
                          onChange={(e) => setMaterialTitle(e.target.value)}
                          placeholder="Resource title (e.g. Lecture 3 Notes)"
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        />
                        <select
                          value={materialType}
                          onChange={(e) =>
                            setMaterialType(e.target.value as Material["type"])
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        >
                          <option value="Slides">Lecture Slides</option>
                          <option value="PDF Document">PDF Document</option>
                          <option value="Syllabus">Syllabus</option>
                          <option value="Code Example">Code Example</option>
                          <option value="Notes">Reading Notes</option>
                        </select>
                        <input
                          value={materialFileName}
                          onChange={(e) => setMaterialFileName(e.target.value)}
                          placeholder="File name (e.g. Chapter3.pdf)"
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddMaterial(false)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-[#0E2A47] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#173C5F]"
                        >
                          Save Resource
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Materials List */}
                  {materials.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                      <BookMarked size={28} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-xs font-bold text-[#0E2A47]">
                        No materials uploaded yet
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Upload lecture slides and syllabus for your students.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      {materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-[#0E2A47]">
                                {mat.title}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {mat.type} · {mat.fileName} · {mat.fileSize}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`#`}
                              onClick={(e) => {
                                e.preventDefault();
                                notify(`Downloading demo file: ${mat.fileName}`);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                            >
                              <Download size={13} />
                              Download
                            </a>
                            <button
                              onClick={() => handleDeleteMaterial(mat.id)}
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                              title="Delete file"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ASSIGNMENTS */}
              {activeTab === "Assignments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#0E2A47]">
                        Assignments for {selectedCourse.code}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Connected to your EduHub assignments database
                      </p>
                    </div>

                    <Link
                      href="/instructor/assignments"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#173C5F]"
                    >
                      <Plus size={15} />
                      Create New Assignment
                    </Link>
                  </div>

                  {courseAssignments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                      <FileText size={28} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-xs font-bold text-[#0E2A47]">
                        No assignments published for {selectedCourse.code} yet
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Create an assignment on the assignments page to link it here.
                      </p>
                      <Link
                        href="/instructor/assignments"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-semibold text-white hover:bg-[#173C5F]"
                      >
                        <Plus size={14} />
                        Go to Assignments
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {courseAssignments.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                              <ClipboardList size={20} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-bold text-[#0E2A47]">
                                {a.title}
                              </h4>
                              <p className="text-xs text-slate-500">
                                Due: {a.dueDate} · Points: {a.points} pts
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/instructor/assignments/${a.id}`}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0E2A47] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#173C5F]"
                          >
                            <span>Grade Submissions</span>
                            <ExternalLink size={13} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: QUIZZES */}
              {activeTab === "Quizzes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#0E2A47]">
                        Quizzes & Exams
                      </h3>
                      <p className="text-xs text-slate-500">
                        Online assessment quizzes for {selectedCourse.code}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddQuiz(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#173C5F]"
                    >
                      <Plus size={15} />
                      Add Quiz
                    </button>
                  </div>

                  {showAddQuiz && (
                    <form
                      onSubmit={handleAddQuiz}
                      className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0E2A47]">
                          Create Online Quiz
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddQuiz(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <input
                          required
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                          placeholder="Quiz Title (e.g. Quiz 2: SQL)"
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500 sm:col-span-2"
                        />
                        <input
                          type="date"
                          value={quizDueDate}
                          onChange={(e) => setQuizDueDate(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        />
                        <input
                          type="number"
                          placeholder="Questions (e.g. 15)"
                          value={quizQuestions}
                          onChange={(e) => setQuizQuestions(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        />
                        <input
                          type="number"
                          placeholder="Duration in mins"
                          value={quizDuration}
                          onChange={(e) => setQuizDuration(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        />
                        <input
                          type="number"
                          placeholder="Total Points"
                          value={quizPoints}
                          onChange={(e) => setQuizPoints(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddQuiz(false)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-[#0E2A47] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#173C5F]"
                        >
                          Publish Quiz
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {quizzes.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            {q.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            Due: {q.dueDate}
                          </span>
                        </div>
                        <h4 className="mt-2.5 font-bold text-[#0E2A47]">
                          {q.title}
                        </h4>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                          <span>{q.questionsCount} Questions</span>
                          <span>{q.durationMinutes} mins</span>
                          <span>{q.totalPoints} pts</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                          <span className="text-slate-400">
                            {q.attemptsCount} Student Attempts
                          </span>
                          <button
                            onClick={() =>
                              notify(`Managing assessment: ${q.title}`)
                            }
                            className="font-bold text-[#0E2A47] hover:underline"
                          >
                            View Submissions →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STUDENTS */}
              {activeTab === "Students" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#0E2A47]">
                        Enrolled Students ({students.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Active student roster for {selectedCourse.code}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="hidden grid-cols-12 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500 sm:grid">
                      <span className="col-span-5">Student</span>
                      <span className="col-span-3">Attendance</span>
                      <span className="col-span-2">Progress</span>
                      <span className="col-span-2 text-right">Current Grade</span>
                    </div>

                    {students.map((std) => (
                      <div
                        key={std.id}
                        className="grid grid-cols-1 items-center gap-2 p-4 transition hover:bg-slate-50 sm:grid-cols-12 sm:px-5"
                      >
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0E2A47] text-xs font-bold text-[#D5AE48]">
                            {std.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#0E2A47]">
                              {std.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {std.studentId} · {std.email}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-3 text-xs text-slate-600">
                          <span className="font-semibold">{std.attendance}%</span> attendance
                        </div>

                        <div className="col-span-2 text-xs text-slate-600">
                          <span className="font-semibold">{std.progress}%</span> complete
                        </div>

                        <div className="col-span-2 text-right">
                          <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                            Grade: {std.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PROGRESS */}
              {activeTab === "Progress" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0E2A47]">
                        Lecture & Curriculum Delivery Progress
                      </h3>
                      <p className="text-xs text-slate-500">
                        Record each completed lesson to update students&apos; overall course syllabus completion.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Lessons Completed:</span>
                      <span>
                        {selectedCourse.completedLessons} of {selectedCourse.lessons} ({progress(selectedCourse)}%)
                      </span>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D5AE48] to-[#E0BE61] transition-all duration-300"
                        style={{ width: `${progress(selectedCourse)}%` }}
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        {selectedCourse.lessons - selectedCourse.completedLessons} lessons remaining
                      </p>

                      <button
                        onClick={() => incrementLesson(selectedCourse)}
                        disabled={selectedCourse.completedLessons >= selectedCourse.lessons}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#173C5F] disabled:opacity-50"
                      >
                        <Check size={14} />
                        Mark Next Lesson Completed
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => toggleCourseStatus(selectedCourse)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:border-[#D5AE48] hover:bg-amber-50"
                >
                  {selectedCourse.status === "Active"
                    ? "Switch to Draft Mode"
                    : "Publish as Active Course"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteCourse(selectedCourse)}
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete Course
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#173C5F]"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#D5AE48] focus:bg-white focus:ring-2 focus:ring-[#D5AE48]/20";

function StatCard({
  icon,
  label,
  value,
  detail,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#0E2A47]">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${iconClass}`}>{icon}</div>
      </div>
      <p className="mt-2.5 text-[11px] text-slate-400">{detail}</p>
    </div>
  );
}

function MiniMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-0.5 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <p className="text-base font-bold text-[#0E2A47]">{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-8 text-xs font-medium text-slate-600 outline-none transition focus:border-amber-500 focus:bg-white ${
          icon ? "pl-9" : "pl-3.5"
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function SmallSummary({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2.5 inline-flex rounded-xl bg-amber-50 p-2 text-amber-700">
        {icon}
      </div>
      <p className="text-xl font-bold text-[#0E2A47]">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}
