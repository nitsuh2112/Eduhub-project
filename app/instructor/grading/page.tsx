"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers3,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  User,
  Users,
  X,
  AlertCircle,
  Award,
  ChevronRight,
  Send,
  SlidersHorizontal,
  HelpCircle,
  ClipboardList,
  Check,
  Save,
  Printer,
  Table,
  UploadCloud,
  FileCheck,
  Lock,
  Unlock,
} from "lucide-react";

export type AssessmentCategory =
  | "Assignment"
  | "Quiz"
  | "Midterm Exam"
  | "Final Exam"
  | "Practice Test"
  | "Lab Assessment";

export type EvaluationItem = {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  category: AssessmentCategory;
  kind: "Assignment" | "Quiz/Exam";
  description?: string;
  dueDate: string;
  maxPoints: number;
  fileName?: string;
};

export type StudentSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
  score?: number;
  maxPoints: number;
  status: "Graded" | "Pending" | "Late" | "Needs Review";
  feedback?: string;
  notes?: string;
  timeSpentMinutes?: number;
};

export type GradebookRow = {
  item: EvaluationItem;
  submission: StudentSubmission;
};

// Types for Grade Entry Sheet (የ Grade መሙያ)
export type GradeColumn = {
  id: string;
  label: string;
  shortLabel: string;
  maxScore: number;
  weight: number; // Percentage or points
};

export type StudentGradeRecord = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  scores: Record<string, number | "">; // columnId -> score
  remarks?: string;
};

const DEFAULT_COURSES = [
  { code: "CS101", name: "Introduction to Computer Science", studentsCount: 42, credits: 4 },
  { code: "CS202", name: "Database Management Systems", studentsCount: 36, credits: 4 },
  { code: "CS203", name: "Object-Oriented Programming", studentsCount: 31, credits: 3 },
  { code: "SE301", name: "Software Engineering", studentsCount: 28, credits: 3 },
  { code: "IT201", name: "Computer Networks", studentsCount: 35, credits: 3 },
];

const GRADE_COLUMNS_CONFIG: Record<string, GradeColumn[]> = {
  CS101: [
    { id: "quiz1", label: "Quiz 1: Logic & Flow", shortLabel: "Quiz 1", maxScore: 10, weight: 10 },
    { id: "quiz2", label: "Quiz 2: Functions", shortLabel: "Quiz 2", maxScore: 10, weight: 10 },
    { id: "assign", label: "Assignments & Labs", shortLabel: "Labs/HW", maxScore: 20, weight: 20 },
    { id: "midterm", label: "Midterm Exam", shortLabel: "Midterm", maxScore: 25, weight: 25 },
    { id: "final", label: "Final Exam", shortLabel: "Final Exam", maxScore: 35, weight: 35 },
  ],
  CS202: [
    { id: "quiz1", label: "Quiz 1: Relational Model", shortLabel: "Quiz 1", maxScore: 10, weight: 10 },
    { id: "assign", label: "ER Design Project", shortLabel: "Project", maxScore: 20, weight: 20 },
    { id: "midterm", label: "Midterm Exam", shortLabel: "Midterm", maxScore: 30, weight: 30 },
    { id: "final", label: "Final Exam", shortLabel: "Final Exam", maxScore: 40, weight: 40 },
  ],
  CS203: [
    { id: "quiz1", label: "Quiz: OOP Concepts", shortLabel: "Quiz 1", maxScore: 10, weight: 10 },
    { id: "assign", label: "Banking System Project", shortLabel: "Project", maxScore: 25, weight: 25 },
    { id: "midterm", label: "Midterm Exam", shortLabel: "Midterm", maxScore: 25, weight: 25 },
    { id: "final", label: "Final Exam", shortLabel: "Final Exam", maxScore: 40, weight: 40 },
  ],
  SE301: [
    { id: "assign1", label: "Requirement Spec (SRS)", shortLabel: "SRS Doc", maxScore: 20, weight: 20 },
    { id: "assign2", label: "UML Architecture Design", shortLabel: "Architecture", maxScore: 20, weight: 20 },
    { id: "midterm", label: "Midterm Exam", shortLabel: "Midterm", maxScore: 25, weight: 25 },
    { id: "final", label: "Final Project Defense", shortLabel: "Final Defense", maxScore: 35, weight: 35 },
  ],
  IT201: [
    { id: "quiz1", label: "Quiz: OSI & TCP/IP", shortLabel: "Quiz 1", maxScore: 15, weight: 15 },
    { id: "lab", label: "Packet Tracer Lab", shortLabel: "Lab 1", maxScore: 20, weight: 20 },
    { id: "midterm", label: "Midterm Exam", shortLabel: "Midterm", maxScore: 25, weight: 25 },
    { id: "final", label: "Final Exam", shortLabel: "Final Exam", maxScore: 40, weight: 40 },
  ],
};

const SEED_STUDENT_ROSTER: Omit<StudentGradeRecord, "scores">[] = [
  { studentId: "ETS-0142", studentName: "Abebe Bikila", studentEmail: "abebe.b@eduhub.edu", avatar: "AB" },
  { studentId: "ETS-0284", studentName: "Sara Tadesse", studentEmail: "sara.t@eduhub.edu", avatar: "ST" },
  { studentId: "ETS-0319", studentName: "Dawit Yohannes", studentEmail: "dawit.y@eduhub.edu", avatar: "DY" },
  { studentId: "ETS-0401", studentName: "Meron Alemu", studentEmail: "meron.a@eduhub.edu", avatar: "MA" },
  { studentId: "ETS-0512", studentName: "Kidus Girma", studentEmail: "kidus.g@eduhub.edu", avatar: "KG" },
  { studentId: "ETS-0623", studentName: "Bethlehem Haile", studentEmail: "bethlehem.h@eduhub.edu", avatar: "BH" },
  { studentId: "ETS-0711", studentName: "Yonas Mulugeta", studentEmail: "yonas.m@eduhub.edu", avatar: "YM" },
  { studentId: "ETS-0834", studentName: "Hana Bekele", studentEmail: "hana.b@eduhub.edu", avatar: "HB" },
];

const SEED_EVALUATION_ITEMS: EvaluationItem[] = [
  {
    id: "asm-1",
    title: "Midterm Exam: Relational Databases & SQL Mastery",
    courseCode: "CS202",
    courseName: "Database Management Systems",
    category: "Midterm Exam",
    kind: "Quiz/Exam",
    description: "Covers relational algebra, ER diagram transformation, SQL SELECT joins, grouping, and normal forms.",
    dueDate: "2026-11-15",
    maxPoints: 100,
  },
  {
    id: "asm-2",
    title: "CS101 Week 3: Python Fundamentals & Logic Quiz",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    category: "Quiz",
    kind: "Quiz/Exam",
    description: "Assessment on variables, boolean expressions, looping, and function declarations.",
    dueDate: "2026-10-30",
    maxPoints: 50,
  },
  {
    id: "assign-1",
    title: "Database ER Diagram & Normalization Project",
    courseCode: "CS202",
    courseName: "Database Management Systems",
    category: "Assignment",
    kind: "Assignment",
    description: "Design an ER diagram for a hospital management database with at least 5 entities and normalize up to 3NF.",
    dueDate: "2026-10-25",
    maxPoints: 20,
    fileName: "cs202_er_spec.pdf",
  },
  {
    id: "assign-2",
    title: "OOP Banking System Implementation",
    courseCode: "CS203",
    courseName: "Object-Oriented Programming",
    category: "Assignment",
    kind: "Assignment",
    description: "Implement polymorphic account types with transaction logs, custom exceptions, and unit tests.",
    dueDate: "2026-10-28",
    maxPoints: 30,
    fileName: "oop_project_rubric.pdf",
  },
  {
    id: "assign-3",
    title: "Algorithm Complexity Analysis",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    category: "Assignment",
    kind: "Assignment",
    description: "Analyze Big-O runtime and space complexity for recursive vs iterative search algorithms.",
    dueDate: "2026-10-20",
    maxPoints: 15,
    fileName: "cs101_homework_algorithms.pdf",
  },
];

const SEED_SUBMISSIONS_BY_ITEM: Record<string, StudentSubmission[]> = {
  "asm-1": [
    {
      id: "sub-q1",
      studentId: "ETS-0142",
      studentName: "Abebe Bikila",
      studentEmail: "abebe.b@eduhub.edu",
      avatar: "AB",
      submittedAt: "2026-10-20 14:48",
      score: 95,
      maxPoints: 100,
      timeSpentMinutes: 52,
      status: "Graded",
      feedback: "Outstanding work on SQL query optimization and normalization proofs.",
    },
    {
      id: "sub-q2",
      studentId: "ETS-0284",
      studentName: "Sara Tadesse",
      studentEmail: "sara.t@eduhub.edu",
      avatar: "ST",
      submittedAt: "2026-10-20 15:10",
      score: 88,
      maxPoints: 100,
      timeSpentMinutes: 65,
      status: "Graded",
      feedback: "Strong performance on relational algebra; review Boyce-Codd constraints.",
    },
    {
      id: "sub-q3",
      studentId: "ETS-0319",
      studentName: "Dawit Yohannes",
      studentEmail: "dawit.y@eduhub.edu",
      avatar: "DY",
      submittedAt: "2026-10-21 09:30",
      score: 74,
      maxPoints: 100,
      timeSpentMinutes: 71,
      status: "Graded",
      feedback: "Good grasp of basic queries. Review index usage and nested joins.",
    },
    {
      id: "sub-q4",
      studentId: "ETS-0512",
      studentName: "Kidus Girma",
      studentEmail: "kidus.g@eduhub.edu",
      avatar: "KG",
      submittedAt: "2026-10-22 08:30",
      maxPoints: 100,
      timeSpentMinutes: 68,
      status: "Needs Review",
      notes: "Auto-grader flagged short answer section 4 for manual instructor grading.",
    },
  ],
  "asm-2": [
    {
      id: "sub-q201",
      studentId: "ETS-0401",
      studentName: "Meron Alemu",
      studentEmail: "meron.a@eduhub.edu",
      avatar: "MA",
      submittedAt: "2026-10-19 16:20",
      score: 48,
      maxPoints: 50,
      timeSpentMinutes: 24,
      status: "Graded",
      feedback: "Great job on Python list comprehensions and scoping rules.",
    },
    {
      id: "sub-q202",
      studentId: "ETS-0623",
      studentName: "Bethlehem Haile",
      studentEmail: "bethlehem.h@eduhub.edu",
      avatar: "BH",
      submittedAt: "2026-10-20 11:15",
      maxPoints: 50,
      timeSpentMinutes: 29,
      status: "Needs Review",
      notes: "Requires manual check on custom function docstring explanations.",
    },
  ],
  "assign-1": [
    {
      id: "sub-101",
      studentId: "ETS-0142",
      studentName: "Abebe Bikila",
      studentEmail: "abebe.b@eduhub.edu",
      avatar: "AB",
      submittedAt: "2026-10-18T14:30:00",
      fileName: "er_diagram_solution.pdf",
      fileSize: "1.4 MB",
      score: 18,
      maxPoints: 20,
      status: "Graded",
      feedback: "Excellent database normalization and clear entity relationships.",
    },
    {
      id: "sub-102",
      studentId: "ETS-0284",
      studentName: "Sara Tadesse",
      studentEmail: "sara.t@eduhub.edu",
      avatar: "ST",
      submittedAt: "2026-10-19T09:15:00",
      fileName: "database_design_v2.pdf",
      fileSize: "2.1 MB",
      maxPoints: 20,
      status: "Pending",
      notes: "Submitted revision; please review composite key choices.",
    },
    {
      id: "sub-103",
      studentId: "ETS-0319",
      studentName: "Dawit Yohannes",
      studentEmail: "dawit.y@eduhub.edu",
      avatar: "DY",
      submittedAt: "2026-10-18T16:45:00",
      fileName: "schema_design_final.docx",
      fileSize: "840 KB",
      score: 19,
      maxPoints: 20,
      status: "Graded",
      feedback: "Great work on indexing strategies. Keep it up!",
    },
    {
      id: "sub-104",
      studentId: "ETS-0512",
      studentName: "Kidus Girma",
      studentEmail: "kidus.g@eduhub.edu",
      avatar: "KG",
      submittedAt: "2026-10-22T08:10:00",
      fileName: "er_model_and_sql.txt",
      fileSize: "120 KB",
      maxPoints: 20,
      status: "Late",
      notes: "Late submission due to local power outage.",
    },
  ],
  "assign-2": [
    {
      id: "sub-201",
      studentId: "ETS-0142",
      studentName: "Abebe Bikila",
      studentEmail: "abebe.b@eduhub.edu",
      avatar: "AB",
      submittedAt: "2026-10-20T17:00:00",
      fileName: "bank_system_code.zip",
      fileSize: "4.2 MB",
      score: 29,
      maxPoints: 30,
      status: "Graded",
      feedback: "Solid design patterns, clean OOP encapsulation and modular test suite.",
    },
    {
      id: "sub-202",
      studentId: "ETS-0319",
      studentName: "Dawit Yohannes",
      studentEmail: "dawit.y@eduhub.edu",
      avatar: "DY",
      submittedAt: "2026-10-21T14:10:00",
      fileName: "oop_project_src.zip",
      fileSize: "3.7 MB",
      maxPoints: 30,
      status: "Pending",
    },
  ],
  "assign-3": [
    {
      id: "sub-301",
      studentId: "ETS-0284",
      studentName: "Sara Tadesse",
      studentEmail: "sara.t@eduhub.edu",
      avatar: "ST",
      submittedAt: "2026-10-17T11:00:00",
      fileName: "big_o_proofs.pdf",
      fileSize: "920 KB",
      score: 15,
      maxPoints: 15,
      status: "Graded",
      feedback: "Flawless recurrence tree and master theorem proofs.",
    },
    {
      id: "sub-302",
      studentId: "ETS-0401",
      studentName: "Meron Alemu",
      studentEmail: "meron.a@eduhub.edu",
      avatar: "MA",
      submittedAt: "2026-10-18T10:30:00",
      fileName: "algorithm_analysis.pdf",
      fileSize: "1.1 MB",
      score: 13,
      maxPoints: 15,
      status: "Graded",
      feedback: "Very good breakdown; review logarithmic space complexity.",
    },
  ],
};

const FEEDBACK_PRESETS = [
  "Excellent submission! Demonstrates thorough understanding and clean execution.",
  "Well structured and organized. Minor deductions for edge case considerations.",
  "Good effort. Please review the instructions on formatting and documentation.",
  "Incomplete solution. Please see the grading rubric and request clarification during office hours.",
];

// Grade calculation helper: Determines Letter Grade and GPA points
function calculateLetterGrade(totalPercentage: number) {
  if (totalPercentage >= 90) return { letter: "A+", points: 4.0, color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  if (totalPercentage >= 85) return { letter: "A", points: 4.0, color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  if (totalPercentage >= 80) return { letter: "A-", points: 3.75, color: "bg-teal-100 text-teal-800 border-teal-300" };
  if (totalPercentage >= 75) return { letter: "B+", points: 3.5, color: "bg-blue-100 text-blue-800 border-blue-300" };
  if (totalPercentage >= 70) return { letter: "B", points: 3.0, color: "bg-blue-100 text-blue-800 border-blue-300" };
  if (totalPercentage >= 65) return { letter: "B-", points: 2.75, color: "bg-sky-100 text-sky-800 border-sky-300" };
  if (totalPercentage >= 60) return { letter: "C+", points: 2.5, color: "bg-amber-100 text-amber-800 border-amber-300" };
  if (totalPercentage >= 50) return { letter: "C", points: 2.0, color: "bg-amber-100 text-amber-800 border-amber-300" };
  if (totalPercentage >= 40) return { letter: "D", points: 1.0, color: "bg-orange-100 text-orange-800 border-orange-300" };
  return { letter: "F", points: 0.0, color: "bg-red-100 text-red-800 border-red-300" };
}

export default function InstructorGradingPage() {
  // Navigation View: "sheet" (የ Grade መሙያ) vs "submissions" (የተማሪዎች ስራ ማረሚያ)
  const [activeTab, setActiveTab] = useState<"sheet" | "submissions">("sheet");

  // Common State
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, StudentSubmission[]>>({});
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // GRADE SHEET (የ Grade መሙያ) STATE
  const [sheetCourseCode, setSheetCourseCode] = useState<string>("CS101");
  const [gradeSheetRecords, setGradeSheetRecords] = useState<StudentGradeRecord[]>([]);
  const [isSheetLocked, setIsSheetLocked] = useState<boolean>(false);
  const [sheetSearch, setSheetSearch] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // SUBMISSIONS REVIEW STATE
  const [selectedCourse, setSelectedCourse] = useState<string>("All Courses");
  const [selectedTypeKind, setSelectedTypeKind] = useState<"ALL" | "Assignment" | "Quiz/Exam">("ALL");
  const [selectedItemId, setSelectedItemId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "Pending" | "Graded" | "Late">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "scoreDesc" | "scoreAsc">("date");
  const [activeModalRow, setActiveModalRow] = useState<GradebookRow | null>(null);
  const [scoreInput, setScoreInput] = useState<string>("");
  const [feedbackInput, setFeedbackInput] = useState<string>("");
  const [savingGrade, setSavingGrade] = useState<boolean>(false);

  function notify(text: string, type: "success" | "error" = "success") {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Current columns for the active course in Grade Sheet
  const currentColumns: GradeColumn[] = useMemo(() => {
    return GRADE_COLUMNS_CONFIG[sheetCourseCode] || GRADE_COLUMNS_CONFIG["CS101"];
  }, [sheetCourseCode]);

  // Load Grade Sheet records for selected course
  useEffect(() => {
    try {
      const storageKey = `eduhub_gradesheet_${sheetCourseCode}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGradeSheetRecords(parsed);
          setHasUnsavedChanges(false);
          return;
        }
      }

      // Initial Seed scores for demo if not in storage
      const initial: StudentGradeRecord[] = SEED_STUDENT_ROSTER.map((student, idx) => {
        const scores: Record<string, number | ""> = {};
        const cols = GRADE_COLUMNS_CONFIG[sheetCourseCode] || GRADE_COLUMNS_CONFIG["CS101"];

        cols.forEach((col, cIdx) => {
          // generate realistic demo scores
          if (idx === 0) scores[col.id] = Math.round(col.maxScore * 0.95);
          else if (idx === 1) scores[col.id] = Math.round(col.maxScore * 0.88);
          else if (idx === 2) scores[col.id] = Math.round(col.maxScore * 0.78);
          else if (idx === 3) scores[col.id] = Math.round(col.maxScore * 0.92);
          else if (idx === 4) scores[col.id] = Math.round(col.maxScore * 0.65);
          else if (idx === 5) scores[col.id] = Math.round(col.maxScore * 0.84);
          else if (idx === 6) scores[col.id] = cIdx < cols.length - 1 ? Math.round(col.maxScore * 0.72) : "";
          else scores[col.id] = "";
        });

        return {
          ...student,
          scores,
        };
      });

      setGradeSheetRecords(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
      setHasUnsavedChanges(false);
    } catch {
      // fallback
    }
  }, [sheetCourseCode]);

  // Load Submissions Data (for Tab 2)
  useEffect(() => {
    try {
      const mergedItems: EvaluationItem[] = [];
      const mergedSubmissionsMap: Record<string, StudentSubmission[]> = {};

      const storedQuizzes = localStorage.getItem("eduhub_instructor_quizzes");
      if (storedQuizzes) {
        try {
          const parsed = JSON.parse(storedQuizzes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const q of parsed) {
              mergedItems.push({
                id: q.id,
                title: q.title,
                courseCode: q.courseCode,
                courseName: q.courseName,
                category: q.type || "Quiz",
                kind: "Quiz/Exam",
                description: q.instructions || "",
                dueDate: q.dueDate || "",
                maxPoints: q.totalPoints || 100,
              });

              if (Array.isArray(q.submissions)) {
                mergedSubmissionsMap[q.id] = q.submissions.map((sub: any) => ({
                  id: sub.id,
                  studentId: sub.studentId,
                  studentName: sub.studentName,
                  studentEmail: sub.studentEmail,
                  avatar: sub.avatar || sub.studentName?.slice(0, 2).toUpperCase() || "ST",
                  submittedAt: sub.submittedAt,
                  score: sub.score,
                  maxPoints: sub.totalPoints || q.totalPoints || 100,
                  status: sub.status === "Needs Review" ? "Pending" : sub.status || "Graded",
                  timeSpentMinutes: sub.timeSpentMinutes,
                  feedback: sub.feedback,
                }));
              }
            }
          }
        } catch {
          // ignore
        }
      }

      const storedAssignments = localStorage.getItem("eduhub_assignments");
      if (storedAssignments) {
        try {
          const parsed = JSON.parse(storedAssignments);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const a of parsed) {
              mergedItems.push({
                id: a.id,
                title: a.title,
                courseCode: a.courseCode,
                courseName: a.courseName,
                category: "Assignment",
                kind: "Assignment",
                description: a.description || "",
                dueDate: a.dueDate || "",
                maxPoints: a.points || 10,
                fileName: a.fileName,
              });

              const subKey = `eduhub_submissions_${a.id}`;
              const storedSubs = localStorage.getItem(subKey);
              if (storedSubs) {
                try {
                  const p = JSON.parse(storedSubs);
                  if (Array.isArray(p)) {
                    mergedSubmissionsMap[a.id] = p.map((sub: any) => ({
                      id: sub.id,
                      studentId: sub.studentId,
                      studentName: sub.studentName,
                      studentEmail: sub.studentEmail,
                      avatar: sub.avatar || sub.studentName?.slice(0, 2).toUpperCase() || "ST",
                      submittedAt: sub.submittedAt,
                      fileName: sub.fileName,
                      fileSize: sub.fileSize,
                      score: sub.grade,
                      maxPoints: sub.maxPoints || a.points || 10,
                      status: sub.status || "Pending",
                      feedback: sub.feedback,
                      notes: sub.notes,
                    }));
                  }
                } catch {
                  // ignore
                }
              }
            }
          }
        } catch {
          // ignore
        }
      }

      if (mergedItems.length === 0) {
        setItems(SEED_EVALUATION_ITEMS);
        setSubmissionsMap(SEED_SUBMISSIONS_BY_ITEM);
      } else {
        for (const seedItem of SEED_EVALUATION_ITEMS) {
          if (!mergedItems.some((i) => i.id === seedItem.id)) {
            mergedItems.push(seedItem);
            mergedSubmissionsMap[seedItem.id] = SEED_SUBMISSIONS_BY_ITEM[seedItem.id] || [];
          }
        }
        setItems(mergedItems);
        setSubmissionsMap(mergedSubmissionsMap);
      }
    } catch {
      setItems(SEED_EVALUATION_ITEMS);
      setSubmissionsMap(SEED_SUBMISSIONS_BY_ITEM);
    }
  }, []);

  // Update cell score in Grade Sheet
  function handleCellScoreChange(studentId: string, colId: string, val: string, maxScore: number) {
    if (isSheetLocked) {
      notify("Grade Sheet is currently locked. Unlock to make edits.", "error");
      return;
    }

    let parsedVal: number | "" = "";
    if (val !== "") {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        return;
      }
      if (num > maxScore) {
        notify(`Score cannot exceed maximum of ${maxScore} for this assessment!`, "error");
        return;
      }
      parsedVal = num;
    }

    setGradeSheetRecords((prev) =>
      prev.map((rec) => {
        if (rec.studentId === studentId) {
          return {
            ...rec,
            scores: {
              ...rec.scores,
              [colId]: parsedVal,
            },
          };
        }
        return rec;
      })
    );
    setHasUnsavedChanges(true);
  }

  // Save Grade Sheet to localStorage
  function handleSaveGradeSheet() {
    try {
      const storageKey = `eduhub_gradesheet_${sheetCourseCode}`;
      localStorage.setItem(storageKey, JSON.stringify(gradeSheetRecords));
      setHasUnsavedChanges(false);
      notify("የተሞሉት ውጤቶች በሙሉ ተቀምጠዋል! (Grade Sheet Saved Successfully)");
    } catch {
      notify("Failed to save grade sheet. Try again.", "error");
    }
  }

  // Finalize & Submit to Registrar
  function handleSubmitToRegistrar() {
    const incompleteCount = gradeSheetRecords.filter((rec) => {
      return currentColumns.some((col) => rec.scores[col.id] === "" || rec.scores[col.id] === undefined);
    }).length;

    if (incompleteCount > 0) {
      const confirmed = window.confirm(
        `ማስጠንቀቂያ፡ ${incompleteCount} ተማሪዎች ሙሉ ውጤት አልሞላላቸውም። ቢሆንም ማጽደቅ ይፈልጋሉ?`
      );
      if (!confirmed) return;
    }

    handleSaveGradeSheet();
    setIsSheetLocked(true);
    notify(`ውጤቶቹ ጸድቀዋል! ወደ ሬጅስትራር በተሳካ ሁኔታ ተልከዋል (Officially Submitted to Registrar)`, "success");
  }

  // Export Grade Sheet to CSV
  function handleExportGradeSheetCSV() {
    const headers = [
      "Student ID",
      "Student Name",
      "Student Email",
      ...currentColumns.map((col) => `${col.label} (Max: ${col.maxScore})`),
      "Total Score (%)",
      "Letter Grade",
      "Grade Points (GPA)",
      "Status",
    ];

    const csvLines = [headers.join(",")];

    gradeSheetRecords.forEach((rec) => {
      let earned = 0;
      let totalMax = 0;
      let allFilled = true;

      currentColumns.forEach((col) => {
        const val = rec.scores[col.id];
        totalMax += col.maxScore;
        if (typeof val === "number") {
          earned += val;
        } else {
          allFilled = false;
        }
      });

      const totalPct = totalMax > 0 ? Math.round((earned / totalMax) * 100) : 0;
      const grade = calculateLetterGrade(totalPct);

      const rowValues = [
        `"${rec.studentId}"`,
        `"${rec.studentName}"`,
        `"${rec.studentEmail}"`,
        ...currentColumns.map((col) => (rec.scores[col.id] !== "" && rec.scores[col.id] !== undefined ? rec.scores[col.id] : '""')),
        `"${totalPct}%"`,
        `"${grade.letter}"`,
        `"${grade.points}"`,
        `"${allFilled ? "Complete" : "Incomplete"}"`,
      ];

      csvLines.push(rowValues.join(","));
    });

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GradeSheet_${sheetCourseCode}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("የውጤት ሰንጠረዥ (Grade Sheet CSV) በተሳካ ሁኔታ ወርዷል!");
  }

  // Filtered Grade Sheet Records by Search
  const filteredSheetRecords = useMemo(() => {
    const q = sheetSearch.trim().toLowerCase();
    if (!q) return gradeSheetRecords;
    return gradeSheetRecords.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        r.studentEmail.toLowerCase().includes(q)
    );
  }, [gradeSheetRecords, sheetSearch]);

  // Grade Sheet Statistics
  const sheetStats = useMemo(() => {
    let totalScoreSum = 0;
    let studentsWithScores = 0;
    let passCount = 0;
    let high = 0;
    let low = 100;

    let gradeDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    gradeSheetRecords.forEach((rec) => {
      let earned = 0;
      let totalMax = 0;
      let hasAny = false;

      currentColumns.forEach((col) => {
        const val = rec.scores[col.id];
        totalMax += col.maxScore;
        if (typeof val === "number") {
          earned += val;
          hasAny = true;
        }
      });

      if (hasAny && totalMax > 0) {
        const pct = Math.round((earned / totalMax) * 100);
        totalScoreSum += pct;
        studentsWithScores++;
        if (pct > high) high = pct;
        if (pct < low) low = pct;

        const grade = calculateLetterGrade(pct);
        if (grade.letter.startsWith("A")) gradeDist["A"]++;
        else if (grade.letter.startsWith("B")) gradeDist["B"]++;
        else if (grade.letter.startsWith("C")) {
          gradeDist["C"]++;
          passCount++;
        } else if (grade.letter === "D") gradeDist["D"]++;
        else gradeDist["F"]++;

        if (pct >= 50) passCount++;
      }
    });

    const avg = studentsWithScores > 0 ? Math.round(totalScoreSum / studentsWithScores) : 0;
    const passRate = studentsWithScores > 0 ? Math.round((passCount / studentsWithScores) * 100) : 0;

    return {
      avg,
      high: studentsWithScores > 0 ? high : 0,
      low: studentsWithScores > 0 ? low : 0,
      passRate,
      gradeDist,
      totalStudents: gradeSheetRecords.length,
    };
  }, [gradeSheetRecords, currentColumns]);

  // Submissions review helpers
  const allRows: GradebookRow[] = useMemo(() => {
    const rows: GradebookRow[] = [];
    for (const item of items) {
      const subs = submissionsMap[item.id] || [];
      for (const sub of subs) {
        rows.push({ item, submission: sub });
      }
    }
    return rows;
  }, [items, submissionsMap]);

  const filteredSubmissionsRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allRows
      .filter((row) => {
        if (selectedCourse !== "All Courses" && row.item.courseCode !== selectedCourse) return false;
        if (selectedTypeKind !== "ALL" && row.item.kind !== selectedTypeKind) return false;
        if (selectedItemId !== "ALL" && row.item.id !== selectedItemId) return false;
        if (selectedStatus !== "ALL") {
          if (selectedStatus === "Pending") {
            if (row.submission.status !== "Pending" && row.submission.status !== "Needs Review") return false;
          } else if (row.submission.status !== selectedStatus) {
            return false;
          }
        }
        if (query) {
          const matchStudent =
            row.submission.studentName.toLowerCase().includes(query) ||
            row.submission.studentId.toLowerCase().includes(query);
          const matchItem =
            row.item.title.toLowerCase().includes(query) ||
            row.item.courseCode.toLowerCase().includes(query);
          if (!matchStudent && !matchItem) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.submission.studentName.localeCompare(b.submission.studentName);
        return new Date(b.submission.submittedAt).getTime() - new Date(a.submission.submittedAt).getTime();
      });
  }, [allRows, selectedCourse, selectedTypeKind, selectedItemId, selectedStatus, searchQuery, sortBy]);

  function handleSaveIndividualGrade(e: React.FormEvent) {
    e.preventDefault();
    if (!activeModalRow) return;
    const num = parseFloat(scoreInput);
    const max = activeModalRow.submission.maxPoints || activeModalRow.item.maxPoints;
    if (isNaN(num) || num < 0 || num > max) {
      notify(`Invalid score. Enter 0 - ${max}`, "error");
      return;
    }

    setSavingGrade(true);
    const itemId = activeModalRow.item.id;
    const subId = activeModalRow.submission.id;
    const currentList = submissionsMap[itemId] || [];

    const updated = currentList.map((s) => {
      if (s.id === subId) {
        return {
          ...s,
          score: num,
          status: "Graded" as const,
          feedback: feedbackInput.trim() || undefined,
        };
      }
      return s;
    });

    setSubmissionsMap((prev) => ({ ...prev, [itemId]: updated }));
    notify(`Grade saved for ${activeModalRow.submission.studentName}!`);
    setActiveModalRow(null);
    setSavingGrade(false);
  }

  function getCategoryBadge(category: AssessmentCategory) {
    switch (category) {
      case "Midterm Exam":
      case "Final Exam":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200">
            <Award size={11} />
            {category}
          </span>
        );
      case "Quiz":
      case "Practice Test":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
            <HelpCircle size={11} />
            {category}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
            <ClipboardList size={11} />
            Assignment
          </span>
        );
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-4 text-slate-800 sm:p-6 lg:p-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-2xl transition-all ${
            toastMessage.type === "success"
              ? "bg-[#0E2A47] text-white border border-[#D5AE48]/40"
              : "bg-red-600 text-white"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 size={20} className="text-[#D5AE48]" />
          ) : (
            <AlertCircle size={20} className="text-white" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Top Breadcrumb & Switcher */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/instructor/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-[#0E2A47] shadow-sm ring-1 border border-slate-200 transition hover:bg-slate-50 hover:text-[#D5AE48]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/instructor/quizzes"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 transition hover:bg-slate-50 hover:text-[#0E2A47]"
            >
              <HelpCircle size={15} className="text-blue-600" />
              Quizzes & Exams
            </Link>
            <Link
              href="/instructor/assignments"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 transition hover:bg-slate-50 hover:text-[#0E2A47]"
            >
              <ClipboardList size={15} className="text-amber-600" />
              Assignments
            </Link>
            <button
              onClick={handleExportGradeSheetCSV}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#153e66]"
            >
              <Download size={15} className="text-[#D5AE48]" />
              Export Grade Sheet (CSV)
            </button>
          </div>
        </div>

        {/* Hero Header Banner */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#07192B] via-[#0E2A47] to-[#163B63] p-6 text-white shadow-xl lg:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D5AE48]">
                <FileSpreadsheet size={16} />
                <span>EduHub Academic Evaluation & Gradebook</span>
              </div>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl">
                የ Grade መሙያ እና ማረሚያ ማዕከል
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#B8C7D8] sm:text-base leading-relaxed">
                የተማሪዎችን የፈተና፣ የኩዊዝ እና የአሳይንመንት ውጤት በቀጥታ በሰንጠረዥ (Excel-like Sheet) ይሙሉ፣ አጠቃላይ ውጤት (Letter Grade) ያስሉ፣ ወይም የተላኩ ፋይሎችን አንድ በአንድ ገምግመው ያርሙ።
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D5AE48] text-[#07192B]">
                <BarChart3 size={26} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{sheetStats.avg}%</div>
                <div className="text-xs font-medium text-[#B8C7D8]">Class Average ({sheetCourseCode})</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Grade Sheet vs Submissions Review */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            <button
              onClick={() => setActiveTab("sheet")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition shadow-sm ${
                activeTab === "sheet"
                  ? "bg-[#D5AE48] text-[#07192B]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <FileSpreadsheet size={18} />
              የ Grade መሙያ ሰንጠረዥ (Grade Sheet Grid)
            </button>

            <button
              onClick={() => setActiveTab("submissions")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition shadow-sm ${
                activeTab === "submissions"
                  ? "bg-[#D5AE48] text-[#07192B]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <ClipboardList size={18} />
              የተማሪዎች ስራ ማረሚያ (Submissions Review)
            </button>
          </div>
        </div>

        {/* VIEW 1: የ GRADE መሙያ ሰንጠረዥ (GRADE ENTRY SHEET) */}
        {activeTab === "sheet" && (
          <div className="space-y-6">
            {/* Course Selector & Sheet Controls Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Course Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    ኮርስ ይምረጡ (Select Course):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_COURSES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          if (hasUnsavedChanges) {
                            if (!window.confirm("ያልተቀመጡ ለውጦች አሉ። ኮርስ መቀየር ይፈልጋሉ?")) return;
                          }
                          setSheetCourseCode(c.code);
                        }}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                          sheetCourseCode === c.code
                            ? "bg-[#0E2A47] text-white shadow-md ring-2 ring-[#D5AE48]"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {c.code} · {c.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lock Status & Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setIsSheetLocked(!isSheetLocked)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      isSheetLocked
                        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isSheetLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    {isSheetLocked ? "Locked (የተቆለፈ)" : "Editing Allowed"}
                  </button>

                  <button
                    onClick={handleSaveGradeSheet}
                    disabled={isSheetLocked}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-300 px-4 py-2 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Save size={15} className="text-[#D5AE48]" />
                    {hasUnsavedChanges ? "Save Changes*" : "Save Draft"}
                  </button>

                  <button
                    onClick={handleSubmitToRegistrar}
                    disabled={isSheetLocked}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#153e66] disabled:opacity-50"
                  >
                    <FileCheck size={15} className="text-[#D5AE48]" />
                    Submit to Registrar (አጽድቅ)
                  </button>
                </div>
              </div>

              {/* Course Info & Assessment Weights Breakdown */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Active Course:</span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-700 border border-blue-200">
                    {sheetCourseCode} - {DEFAULT_COURSES.find((c) => c.code === sheetCourseCode)?.name}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span>{sheetStats.totalStudents} ተማሪዎች ተመዝግበዋል</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-500">የውጤት ክፍፍል (Weights):</span>
                  {currentColumns.map((col) => (
                    <span
                      key={col.id}
                      className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700"
                    >
                      {col.shortLabel}: <strong className="text-slate-900">{col.maxScore} pts</strong>
                    </span>
                  ))}
                  <span className="font-bold text-[#0E2A47]">= 100% Total</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards for Selected Course */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Class Average</div>
                <div className="mt-1 text-2xl font-black text-slate-900">{sheetStats.avg}%</div>
                <div className="mt-1 text-xs text-slate-400">Based on entered scores</div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
                <div className="text-xs font-semibold text-emerald-800">Pass Rate (&ge; 50%)</div>
                <div className="mt-1 text-2xl font-black text-emerald-700">{sheetStats.passRate}%</div>
                <div className="mt-1 text-xs text-emerald-600">Passing grade count</div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-sm">
                <div className="text-xs font-semibold text-blue-800">Highest Score</div>
                <div className="mt-1 text-2xl font-black text-blue-700">{sheetStats.high}%</div>
                <div className="mt-1 text-xs text-blue-600">Top student score</div>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 shadow-sm">
                <div className="text-xs font-semibold text-purple-800">Grade Distribution</div>
                <div className="mt-1 text-xs font-bold text-purple-900 flex items-center gap-1.5 flex-wrap">
                  <span>A: {sheetStats.gradeDist["A"]}</span>
                  <span>·</span>
                  <span>B: {sheetStats.gradeDist["B"]}</span>
                  <span>·</span>
                  <span>C: {sheetStats.gradeDist["C"]}</span>
                  <span>·</span>
                  <span>D/F: {sheetStats.gradeDist["D"] + sheetStats.gradeDist["F"]}</span>
                </div>
                <div className="mt-1 text-xs text-purple-600">Total letter grades</div>
              </div>
            </div>

            {/* SPREADSHEET TABLE: የ GRADE መሙያ ሴሎች */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-4 bg-slate-50/60">
                <div className="relative flex-1 max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ተማሪ በስም ወይም በ ID ይፈልጉ..."
                    value={sheetSearch}
                    onChange={(e) => setSheetSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 outline-none focus:border-[#D5AE48] focus:ring-1 focus:ring-[#D5AE48]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> A/B (Distinction)
                  </span>
                  <span className="flex items-center gap-1 ml-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" /> C (Satisfactory)
                  </span>
                  <span className="flex items-center gap-1 ml-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" /> F (Fail)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                  <thead className="border-b border-slate-200 bg-slate-100/80 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <tr>
                      <th scope="col" className="p-4 border-r border-slate-200 sticky left-0 bg-slate-100 z-10 min-w-[220px]">
                        ተማሪ (Student)
                      </th>
                      {currentColumns.map((col) => (
                        <th
                          key={col.id}
                          scope="col"
                          className="p-3 text-center border-r border-slate-200 min-w-[110px]"
                        >
                          <div>{col.shortLabel}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            Max: {col.maxScore} pts
                          </div>
                        </th>
                      ))}
                      <th scope="col" className="p-3 text-center border-r border-slate-200 min-w-[100px] bg-amber-50/50">
                        ድምር (Total)
                        <div className="text-[10px] text-amber-700 font-normal">100%</div>
                      </th>
                      <th scope="col" className="p-3 text-center border-r border-slate-200 min-w-[90px] bg-slate-50">
                        Grade
                        <div className="text-[10px] text-slate-400 font-normal">Letter / GPA</div>
                      </th>
                      <th scope="col" className="p-3 text-center min-w-[100px]">
                        ሁኔታ (Status)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredSheetRecords.map((rec, rIdx) => {
                      let earned = 0;
                      let totalMax = 0;
                      let allFilled = true;

                      currentColumns.forEach((col) => {
                        const val = rec.scores[col.id];
                        totalMax += col.maxScore;
                        if (typeof val === "number") {
                          earned += val;
                        } else {
                          allFilled = false;
                        }
                      });

                      const totalPct = totalMax > 0 ? Math.round((earned / totalMax) * 100) : 0;
                      const grade = calculateLetterGrade(totalPct);

                      return (
                        <tr
                          key={rec.studentId}
                          className={`transition ${rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-amber-50/30`}
                        >
                          {/* Student Info (Sticky left) */}
                          <td className="p-3 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-sm">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0E2A47] text-white text-xs font-bold">
                                {rec.avatar}
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-900 text-xs truncate max-w-[160px]">
                                  {rec.studentName}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {rec.studentId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Dynamic Assessment Score Inputs (Editable Cells) */}
                          {currentColumns.map((col) => {
                            const currentVal = rec.scores[col.id];
                            const isFilled = currentVal !== "" && currentVal !== undefined;

                            return (
                              <td
                                key={col.id}
                                className="p-2 text-center border-r border-slate-200 bg-white"
                              >
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max={col.maxScore}
                                  disabled={isSheetLocked}
                                  value={currentVal}
                                  onChange={(e) =>
                                    handleCellScoreChange(rec.studentId, col.id, e.target.value, col.maxScore)
                                  }
                                  placeholder="-"
                                  className={`w-16 rounded-lg border py-1.5 text-center text-xs font-bold outline-none transition ${
                                    isFilled
                                      ? "border-slate-300 bg-slate-50 text-slate-900 focus:border-[#D5AE48] focus:bg-white focus:ring-1 focus:ring-[#D5AE48]"
                                      : "border-dashed border-slate-300 bg-amber-50/40 text-slate-400 placeholder:text-slate-300 focus:border-[#D5AE48] focus:bg-white"
                                  } ${isSheetLocked ? "opacity-75 cursor-not-allowed bg-slate-100" : ""}`}
                                />
                              </td>
                            );
                          })}

                          {/* Calculated Total (100%) */}
                          <td className="p-3 text-center border-r border-slate-200 bg-amber-50/30">
                            <span className="font-extrabold text-sm text-[#0E2A47]">
                              {totalPct}%
                            </span>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {earned} / {totalMax}
                            </div>
                          </td>

                          {/* Letter Grade & GPA */}
                          <td className="p-3 text-center border-r border-slate-200">
                            <span
                              className={`inline-block rounded-md px-2 py-0.5 text-xs font-black border ${grade.color}`}
                            >
                              {grade.letter}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {grade.points.toFixed(2)} pts
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3 text-center whitespace-nowrap text-xs">
                            {allFilled ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                                <CheckCircle2 size={12} />
                                ተሟልቷል
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[11px] border border-amber-200">
                                <Clock3 size={12} />
                                ያልተሟላ
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Sheet Bottom Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500 font-medium">
                  ጠቃሚ ምክር: ውጤቱን በየሴሉ ውስጥ ከሞሉ በኋላ <strong className="text-slate-700">"Save Draft"</strong> ወይም <strong className="text-slate-700">"Submit to Registrar"</strong> የሚለውን ይጫኑ።
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveGradeSheet}
                    disabled={isSheetLocked}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Save size={14} className="text-[#D5AE48]" />
                    ውጤቶችን መዝግብ (Save)
                  </button>

                  <button
                    onClick={handleSubmitToRegistrar}
                    disabled={isSheetLocked}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#153e66] disabled:opacity-50"
                  >
                    <FileCheck size={15} className="text-[#D5AE48]" />
                    ለሬጅስትራር አጽድቀህ ላክ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: የተማሪዎች ስራ ማረሚያ (SUBMISSIONS REVIEW) */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            {/* Filter Controls Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ተማሪ በስም፣ በ ID ወይም በፈተና ርዕስ ይፈልጉ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#D5AE48] focus:bg-white focus:ring-2 focus:ring-[#D5AE48]/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" />
                    <select
                      value={selectedCourse}
                      onChange={(e) => {
                        setSelectedCourse(e.target.value);
                        setSelectedItemId("ALL");
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#D5AE48] focus:bg-white"
                    >
                      <option value="All Courses">All Courses</option>
                      {DEFAULT_COURSES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <select
                      value={selectedTypeKind}
                      onChange={(e) => {
                        setSelectedTypeKind(e.target.value as any);
                        setSelectedItemId("ALL");
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#D5AE48] focus:bg-white"
                    >
                      <option value="ALL">All Types</option>
                      <option value="Quiz/Exam">Quizzes & Exams Only</option>
                      <option value="Assignment">Assignments Only</option>
                    </select>
                  </div>

                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#D5AE48] focus:bg-white max-w-[200px] truncate"
                  >
                    <option value="ALL">All Assessments</option>
                    {items
                      .filter((it) => selectedCourse === "All Courses" || it.courseCode === selectedCourse)
                      .filter((it) => selectedTypeKind === "ALL" || it.kind === selectedTypeKind)
                      .map((it) => (
                        <option key={it.id} value={it.id}>
                          [{it.category}] {it.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
                  Status:
                </span>
                <button
                  onClick={() => setSelectedStatus("ALL")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedStatus === "ALL"
                      ? "bg-[#0E2A47] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({allRows.length})
                </button>
                <button
                  onClick={() => setSelectedStatus("Pending")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedStatus === "Pending"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  Needs Grading
                </button>
                <button
                  onClick={() => setSelectedStatus("Graded")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedStatus === "Graded"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  Graded
                </button>
                <button
                  onClick={() => setSelectedStatus("Late")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedStatus === "Late"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  Late
                </button>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">Student</th>
                      <th scope="col" className="px-6 py-4">Course & Assessment</th>
                      <th scope="col" className="px-6 py-4">Submission Detail</th>
                      <th scope="col" className="px-6 py-4">Submitted At</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4">Score</th>
                      <th scope="col" className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissionsRows.map((row) => {
                      const sub = row.submission;
                      const item = row.item;
                      const max = sub.maxPoints || item.maxPoints;
                      const pct = typeof sub.score === "number" ? Math.round((sub.score / max) * 100) : null;

                      return (
                        <tr key={`${item.id}-${sub.id}`} className="transition hover:bg-slate-50/80">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E2A47] to-[#1c4b78] font-bold text-white text-xs shadow-sm">
                                {sub.avatar}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{sub.studentName}</div>
                                <div className="text-xs text-slate-400">{sub.studentId} · {sub.studentEmail}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="inline-block rounded-md bg-[#0E2A47]/10 px-2 py-0.5 text-xs font-semibold text-[#0E2A47]">
                                {item.courseCode}
                              </span>
                              {getCategoryBadge(item.category)}
                            </div>
                            <div className="font-medium text-slate-800 line-clamp-1 max-w-xs mt-1">
                              {item.title}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {sub.fileName ? (
                              <div className="flex items-center gap-2 text-slate-700">
                                <FileText size={16} className="text-slate-400 shrink-0" />
                                <span className="text-xs font-medium truncate max-w-[130px] block">{sub.fileName}</span>
                              </div>
                            ) : sub.timeSpentMinutes ? (
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Clock3 size={14} className="text-blue-500 shrink-0" />
                                <span>Online Quiz ({sub.timeSpentMinutes} mins)</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Online Response</span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                            {sub.submittedAt}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {sub.status === "Graded" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={13} className="text-emerald-600" /> Graded
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                                <Clock3 size={13} className="text-amber-500" /> Needs Review
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {typeof sub.score === "number" ? (
                              <span className="font-bold text-slate-900 text-sm">
                                {sub.score} <span className="text-xs text-slate-400 font-normal">/ {max}</span>
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-slate-400 italic">Ungraded</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setActiveModalRow(row);
                                setScoreInput(sub.score !== undefined ? String(sub.score) : "");
                                setFeedbackInput(sub.feedback || "");
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#153e66]"
                            >
                              <Award size={14} className="text-[#D5AE48]" />
                              {sub.status === "Graded" ? "Edit Grade" : "Grade Now"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Submissions Review & Grading */}
            {activeModalRow && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-[#07192B] px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <Award size={20} className="text-[#D5AE48]" />
                      <div>
                        <h3 className="font-bold text-base">Grade Student Work</h3>
                        <p className="text-xs text-[#B8C7D8]">
                          {activeModalRow.item.courseCode} · {activeModalRow.item.title}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setActiveModalRow(null)} className="text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveIndividualGrade} className="p-6 space-y-5">
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{activeModalRow.submission.studentName}</div>
                        <div className="text-xs text-slate-500">{activeModalRow.submission.studentId}</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        Submitted: {activeModalRow.submission.submittedAt}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                        Awarded Score (Max: {activeModalRow.submission.maxPoints || activeModalRow.item.maxPoints})
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={activeModalRow.submission.maxPoints || activeModalRow.item.maxPoints}
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3 text-lg font-bold text-slate-900 outline-none focus:border-[#D5AE48]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                        Feedback / አስተያየት
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        placeholder="Constructive feedback for student..."
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 outline-none focus:border-[#D5AE48]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveModalRow(null)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingGrade}
                        className="rounded-xl bg-[#0E2A47] px-5 py-2 text-sm font-bold text-white shadow hover:bg-[#153e66]"
                      >
                        {savingGrade ? "Saving..." : "Save Grade"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
