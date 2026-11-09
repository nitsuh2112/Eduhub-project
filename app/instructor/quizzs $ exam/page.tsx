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
  FileText,
  Filter,
  GraduationCap,
  HelpCircle,
  Layers3,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  AlertCircle,
  Check,
  Share2,
  LayoutGrid,
  List,
  Copy,
  Users,
  Award,
  ChevronRight,
  RefreshCw,
  Sliders,
  FileCheck2,
  BarChart2,
  Clock,
  Printer,
  ExternalLink,
} from "lucide-react";

export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export type Question = {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
};

export type StudentSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  score: number;
  totalPoints: number;
  timeSpentMinutes: number;
  status: "Graded" | "Needs Review";
};

export type Assessment = {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  type: "Quiz" | "Midterm Exam" | "Final Exam" | "Practice Test" | "Lab Assessment";
  status: "Published" | "Draft" | "Scheduled" | "Closed";
  durationMinutes: number;
  totalPoints: number;
  passingPercentage: number;
  allowedAttempts: number;
  shuffleQuestions: boolean;
  showImmediateResults: boolean;
  dueDate: string;
  dueTime: string;
  createdAt: string;
  instructions: string;
  questions: Question[];
  submissions: StudentSubmission[];
};

const QUIZZES_STORAGE_KEY = "eduhub_instructor_quizzes";
const COURSES_STORAGE_KEY = "eduhub_instructor_courses";

const DEFAULT_COURSES = [
  { code: "CS101", name: "Introduction to Computer Science" },
  { code: "CS202", name: "Database Management Systems" },
  { code: "CS203", name: "Object-Oriented Programming" },
  { code: "SE301", name: "Software Engineering" },
  { code: "IT201", name: "Computer Networks" },
];

const SEED_ASSESSMENTS: Assessment[] = [
  {
    id: "asm-1",
    title: "Midterm Exam: Relational Databases & SQL Mastery",
    courseCode: "CS202",
    courseName: "Database Management Systems",
    type: "Midterm Exam",
    status: "Published",
    durationMinutes: 75,
    totalPoints: 100,
    passingPercentage: 60,
    allowedAttempts: 1,
    shuffleQuestions: true,
    showImmediateResults: false,
    dueDate: "2026-11-15",
    dueTime: "14:00",
    createdAt: "2026-10-18",
    instructions:
      "Covers relational algebra, ER diagram transformation, SQL SELECT joins, grouping, subqueries, and Boyce-Codd normal form.",
    questions: [
      {
        id: "q-101",
        prompt: "Which normal form removes transitive dependencies of non-prime attributes on candidate keys?",
        type: "multiple_choice",
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)",
        ],
        correctAnswer: "Third Normal Form (3NF)",
        points: 20,
        explanation: "3NF requires the relation to be in 2NF and no non-prime attribute to be transitively dependent on any candidate key.",
      },
      {
        id: "q-102",
        prompt: "In SQL, the HAVING clause is applied before rows are grouped by the GROUP BY clause.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 20,
        explanation: "HAVING filters groups AFTER aggregation, whereas WHERE filters individual rows BEFORE grouping.",
      },
      {
        id: "q-103",
        prompt: "What does the 'I' represent in the ACID properties of database transactions?",
        type: "multiple_choice",
        options: ["Integrity", "Isolation", "Immutability", "Indexing"],
        correctAnswer: "Isolation",
        points: 20,
        explanation: "Isolation ensures that concurrently executed transactions do not interfere with one another.",
      },
      {
        id: "q-104",
        prompt: "Which JOIN returns all rows from the left table and matched rows from the right table?",
        type: "multiple_choice",
        options: ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "CROSS JOIN"],
        correctAnswer: "LEFT OUTER JOIN",
        points: 20,
        explanation: "LEFT OUTER JOIN retains every record of the left table even if no match exists in the right table.",
      },
      {
        id: "q-105",
        prompt: "A Primary Key column in a relational table can contain NULL values under special conditions.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 20,
        explanation: "Entity integrity rule strictly forbids any component of a primary key from having NULL values.",
      },
    ],
    submissions: [
      {
        id: "sub-1",
        studentId: "ETS-0142",
        studentName: "Abebe Bikila",
        studentEmail: "abebe.b@eduhub.edu",
        submittedAt: "2026-10-20 14:48",
        score: 95,
        totalPoints: 100,
        timeSpentMinutes: 52,
        status: "Graded",
      },
      {
        id: "sub-2",
        studentId: "ETS-0284",
        studentName: "Sara Tadesse",
        studentEmail: "sara.t@eduhub.edu",
        submittedAt: "2026-10-20 15:10",
        score: 88,
        totalPoints: 100,
        timeSpentMinutes: 65,
        status: "Graded",
      },
      {
        id: "sub-3",
        studentId: "ETS-0319",
        studentName: "Dawit Yohannes",
        studentEmail: "dawit.y@eduhub.edu",
        submittedAt: "2026-10-21 09:30",
        score: 92,
        totalPoints: 100,
        timeSpentMinutes: 48,
        status: "Graded",
      },
      {
        id: "sub-4",
        studentId: "ETS-0401",
        studentName: "Meron Alemu",
        studentEmail: "meron.a@eduhub.edu",
        submittedAt: "2026-10-21 11:15",
        score: 75,
        totalPoints: 100,
        timeSpentMinutes: 70,
        status: "Graded",
      },
      {
        id: "sub-5",
        studentId: "ETS-0512",
        studentName: "Kidus Girma",
        studentEmail: "kidus.g@eduhub.edu",
        submittedAt: "2026-10-21 16:40",
        score: 68,
        totalPoints: 100,
        timeSpentMinutes: 74,
        status: "Needs Review",
      },
    ],
  },
  {
    id: "asm-2",
    title: "Quiz 1: Computational Thinking & Big-O Complexity",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    type: "Quiz",
    status: "Published",
    durationMinutes: 25,
    totalPoints: 30,
    passingPercentage: 60,
    allowedAttempts: 2,
    shuffleQuestions: true,
    showImmediateResults: true,
    dueDate: "2026-11-05",
    dueTime: "23:59",
    createdAt: "2026-10-15",
    instructions:
      "Assess understanding of algorithm complexity, asymptotic notation, and elementary pseudocode analysis.",
    questions: [
      {
        id: "q-201",
        prompt: "What is the worst-case time complexity of Binary Search on a sorted array of size n?",
        type: "multiple_choice",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(log n)",
        points: 10,
        explanation: "Binary search halves the search space at each iteration, resulting in logarithmic time complexity.",
      },
      {
        id: "q-202",
        prompt: "An algorithm with O(n^2) complexity will always run slower than an O(n) algorithm for all values of n.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 10,
        explanation: "For very small inputs n, constant factors in O(n) might make it slower than O(n^2). Asymptotic notation describes growth as n approaches infinity.",
      },
      {
        id: "q-203",
        prompt: "Which data structure follows the First-In First-Out (FIFO) principle?",
        type: "multiple_choice",
        options: ["Stack", "Queue", "Binary Tree", "Heap"],
        correctAnswer: "Queue",
        points: 10,
        explanation: "Queues process items in the order they were inserted.",
      },
    ],
    submissions: [
      {
        id: "sub-21",
        studentId: "ETS-0142",
        studentName: "Abebe Bikila",
        studentEmail: "abebe.b@eduhub.edu",
        submittedAt: "2026-10-16 10:15",
        score: 30,
        totalPoints: 30,
        timeSpentMinutes: 14,
        status: "Graded",
      },
      {
        id: "sub-22",
        studentId: "ETS-0319",
        studentName: "Dawit Yohannes",
        studentEmail: "dawit.y@eduhub.edu",
        submittedAt: "2026-10-16 11:00",
        score: 30,
        totalPoints: 30,
        timeSpentMinutes: 12,
        status: "Graded",
      },
      {
        id: "sub-23",
        studentId: "ETS-0284",
        studentName: "Sara Tadesse",
        studentEmail: "sara.t@eduhub.edu",
        submittedAt: "2026-10-17 14:22",
        score: 20,
        totalPoints: 30,
        timeSpentMinutes: 19,
        status: "Graded",
      },
    ],
  },
  {
    id: "asm-3",
    title: "Quiz 2: OOP Principles, Inheritance & Polymorphism",
    courseCode: "CS203",
    courseName: "Object-Oriented Programming",
    type: "Quiz",
    status: "Published",
    durationMinutes: 35,
    totalPoints: 40,
    passingPercentage: 65,
    allowedAttempts: 2,
    shuffleQuestions: true,
    showImmediateResults: true,
    dueDate: "2026-11-10",
    dueTime: "23:59",
    createdAt: "2026-10-19",
    instructions:
      "Review method overloading, method overriding, abstract classes, interfaces, and dynamic method dispatch.",
    questions: [
      {
        id: "q-301",
        prompt: "Which OOP concept allows a subclass to provide a specific implementation of a method defined in its superclass?",
        type: "multiple_choice",
        options: ["Encapsulation", "Method Overriding", "Method Overloading", "Data Hiding"],
        correctAnswer: "Method Overriding",
        points: 10,
        explanation: "Method overriding provides a specific implementation of a method that is already provided by one of its super-classes.",
      },
      {
        id: "q-302",
        prompt: "In Java or C#, an abstract class can be instantiated directly using the 'new' keyword.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 10,
        explanation: "Abstract classes cannot be instantiated directly; they must be subclassed.",
      },
      {
        id: "q-303",
        prompt: "Which keyword is used in Java to implement multiple inheritance of type?",
        type: "multiple_choice",
        options: ["extends", "implements", "inherits", "super"],
        correctAnswer: "implements",
        points: 10,
        explanation: "A class can implement multiple interfaces in Java.",
      },
      {
        id: "q-304",
        prompt: "The 'O' in SOLID design principles stands for the Open/Closed Principle.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        points: 10,
        explanation: "Open/Closed Principle: software entities should be open for extension, but closed for modification.",
      },
    ],
    submissions: [
      {
        id: "sub-31",
        studentId: "ETS-0284",
        studentName: "Sara Tadesse",
        studentEmail: "sara.t@eduhub.edu",
        submittedAt: "2026-10-20 16:30",
        score: 40,
        totalPoints: 40,
        timeSpentMinutes: 24,
        status: "Graded",
      },
      {
        id: "sub-32",
        studentId: "ETS-0401",
        studentName: "Meron Alemu",
        studentEmail: "meron.a@eduhub.edu",
        submittedAt: "2026-10-21 14:10",
        score: 30,
        totalPoints: 40,
        timeSpentMinutes: 31,
        status: "Graded",
      },
    ],
  },
  {
    id: "asm-4",
    title: "Final Exam: Software Architecture & Agile Methodologies",
    courseCode: "SE301",
    courseName: "Software Engineering",
    type: "Final Exam",
    status: "Scheduled",
    durationMinutes: 120,
    totalPoints: 100,
    passingPercentage: 50,
    allowedAttempts: 1,
    shuffleQuestions: false,
    showImmediateResults: false,
    dueDate: "2026-12-08",
    dueTime: "10:00",
    createdAt: "2026-10-20",
    instructions:
      "Comprehensive end-of-semester examination testing requirements engineering, sprint planning, CI/CD, and architectural patterns.",
    questions: [
      {
        id: "q-401",
        prompt: "Which architectural pattern separates an application into Presentation, Business Logic, and Data Access layers?",
        type: "multiple_choice",
        options: ["Microkernel", "Layered (N-Tier) Architecture", "Event-Driven Architecture", "Space-Based"],
        correctAnswer: "Layered (N-Tier) Architecture",
        points: 25,
      },
      {
        id: "q-402",
        prompt: "In Scrum, the Product Owner is responsible for facilitating Daily Standup meetings and removing impediments.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 25,
        explanation: "The Scrum Master facilitates standups and removes blockers; the Product Owner manages backlog priorities.",
      },
      {
        id: "q-403",
        prompt: "Which type of software testing verifies that previously developed and tested software still performs correctly after changes?",
        type: "multiple_choice",
        options: ["Unit Testing", "Stress Testing", "Regression Testing", "Smoke Testing"],
        correctAnswer: "Regression Testing",
        points: 25,
      },
      {
        id: "q-404",
        prompt: "Briefly explain the main objective of Continuous Integration (CI) in modern DevOps.",
        type: "short_answer",
        correctAnswer: "Automating the integration and automated testing of code changes from multiple contributors frequently.",
        points: 25,
      },
    ],
    submissions: [],
  },
  {
    id: "asm-5",
    title: "Practice Test: OSI Model & TCP/IP Protocol Suite",
    courseCode: "IT201",
    courseName: "Computer Networks",
    type: "Practice Test",
    status: "Published",
    durationMinutes: 40,
    totalPoints: 50,
    passingPercentage: 50,
    allowedAttempts: 3,
    shuffleQuestions: true,
    showImmediateResults: true,
    dueDate: "2026-11-20",
    dueTime: "23:59",
    createdAt: "2026-10-12",
    instructions:
      "Self-paced practice review for packet routing, subnet masks, DNS resolution, and transport layer handshakes.",
    questions: [
      {
        id: "q-501",
        prompt: "Which layer of the OSI model is responsible for reliable end-to-end data transfer and flow control?",
        type: "multiple_choice",
        options: ["Network Layer", "Transport Layer", "Data Link Layer", "Session Layer"],
        correctAnswer: "Transport Layer",
        points: 25,
      },
      {
        id: "q-502",
        prompt: "UDP provides connection-oriented, guaranteed in-order packet delivery.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 25,
        explanation: "UDP is connectionless and does not guarantee packet arrival or ordering; TCP does.",
      },
    ],
    submissions: [
      {
        id: "sub-51",
        studentId: "ETS-0142",
        studentName: "Abebe Bikila",
        studentEmail: "abebe.b@eduhub.edu",
        submittedAt: "2026-10-14 09:20",
        score: 50,
        totalPoints: 50,
        timeSpentMinutes: 22,
        status: "Graded",
      },
      {
        id: "sub-52",
        studentId: "ETS-0512",
        studentName: "Kidus Girma",
        studentEmail: "kidus.g@eduhub.edu",
        submittedAt: "2026-10-15 17:45",
        score: 50,
        totalPoints: 50,
        timeSpentMinutes: 30,
        status: "Graded",
      },
    ],
  },
];

function getStoredAssessments(): Assessment[] {
  try {
    const raw = localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (!raw) return SEED_ASSESSMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ASSESSMENTS;
  } catch {
    return SEED_ASSESSMENTS;
  }
}

function saveStoredAssessments(items: Assessment[]) {
  try {
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(items));
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

export default function InstructorQuizzesAndExamPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [coursesList, setCoursesList] = useState(DEFAULT_COURSES);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"dueDate" | "points" | "submissions" | "title">("dueDate");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Create / Edit Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<"settings" | "questions">("settings");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formCourseCode, setFormCourseCode] = useState("CS101");
  const [formType, setFormType] = useState<Assessment["type"]>("Quiz");
  const [formStatus, setFormStatus] = useState<Assessment["status"]>("Published");
  const [formDuration, setFormDuration] = useState("30");
  const [formPassing, setFormPassing] = useState("60");
  const [formAttempts, setFormAttempts] = useState("1");
  const [formDueDate, setFormDueDate] = useState("2026-11-20");
  const [formDueTime, setFormDueTime] = useState("23:59");
  const [formInstructions, setFormInstructions] = useState("");
  const [formShuffle, setFormShuffle] = useState(true);
  const [formImmediateResults, setFormImmediateResults] = useState(true);
  const [formQuestions, setFormQuestions] = useState<Question[]>([]);

  // Question draft inside form
  const [newQPrompt, setNewQPrompt] = useState("");
  const [newQType, setNewQType] = useState<QuestionType>("multiple_choice");
  const [newQPoints, setNewQPoints] = useState("10");
  const [newQOptA, setNewQOptA] = useState("");
  const [newQOptB, setNewQOptB] = useState("");
  const [newQOptC, setNewQOptC] = useState("");
  const [newQOptD, setNewQOptD] = useState("");
  const [newQCorrect, setNewQCorrect] = useState("");
  const [newQExplanation, setNewQExplanation] = useState("");

  // Inspect / Preview Questions Modal
  const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null);

  // Submissions & Results Modal
  const [resultsAssessment, setResultsAssessment] = useState<Assessment | null>(null);

  // Delete Confirm Modal
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  function notify(message: string, type: "success" | "error" | "info" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    setAssessments(getStoredAssessments());
    setCoursesList(getStoredCourses());
  }, []);

  function persist(items: Assessment[]) {
    setAssessments(items);
    saveStoredAssessments(items);
  }

  function handleResetSeed() {
    if (window.confirm("Reset all quizzes & examinations to default seed dataset?")) {
      persist(SEED_ASSESSMENTS);
      notify("Quizzes & exams restored to original seed data.");
    }
  }

  // Open Create Modal
  function handleOpenCreate() {
    setEditingAssessmentId(null);
    setFormTab("settings");
    setFormTitle("");
    setFormCourseCode(coursesList[0]?.code || "CS101");
    setFormType("Quiz");
    setFormStatus("Published");
    setFormDuration("30");
    setFormPassing("60");
    setFormAttempts("1");
    setFormDueDate("2026-11-25");
    setFormDueTime("23:59");
    setFormInstructions("Please read all questions carefully before submitting. Ensure a stable internet connection.");
    setFormShuffle(true);
    setFormImmediateResults(true);
    setFormQuestions([
      {
        id: `q-${Date.now()}-1`,
        prompt: "Sample Question: Describe the primary objective of this module.",
        type: "multiple_choice",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        points: 10,
        explanation: "Option A is the correct answer based on lecture readings.",
      },
    ]);
    resetQuestionDraft();
    setShowFormModal(true);
  }

  // Open Edit Modal
  function handleOpenEdit(asm: Assessment) {
    setEditingAssessmentId(asm.id);
    setFormTab("settings");
    setFormTitle(asm.title);
    setFormCourseCode(asm.courseCode);
    setFormType(asm.type);
    setFormStatus(asm.status);
    setFormDuration(String(asm.durationMinutes));
    setFormPassing(String(asm.passingPercentage));
    setFormAttempts(String(asm.allowedAttempts));
    setFormDueDate(asm.dueDate);
    setFormDueTime(asm.dueTime);
    setFormInstructions(asm.instructions);
    setFormShuffle(asm.shuffleQuestions);
    setFormImmediateResults(asm.showImmediateResults);
    setFormQuestions(asm.questions || []);
    resetQuestionDraft();
    setShowFormModal(true);
  }

  function resetQuestionDraft() {
    setNewQPrompt("");
    setNewQType("multiple_choice");
    setNewQPoints("10");
    setNewQOptA("");
    setNewQOptB("");
    setNewQOptC("");
    setNewQOptD("");
    setNewQCorrect("");
    setNewQExplanation("");
  }

  // Add Question to Form
  function handleAddQuestion() {
    if (!newQPrompt.trim()) {
      notify("Please type a question prompt.", "error");
      return;
    }

    let options: string[] | undefined = undefined;
    let correct = newQCorrect.trim();

    if (newQType === "multiple_choice") {
      if (!newQOptA.trim() || !newQOptB.trim()) {
        notify("Multiple choice requires at least Option A and Option B.", "error");
        return;
      }
      options = [newQOptA.trim(), newQOptB.trim()];
      if (newQOptC.trim()) options.push(newQOptC.trim());
      if (newQOptD.trim()) options.push(newQOptD.trim());

      if (!correct) {
        correct = options[0];
      }
    } else if (newQType === "true_false") {
      options = ["True", "False"];
      if (!correct || (correct !== "True" && correct !== "False")) {
        correct = "True";
      }
    } else {
      if (!correct) correct = "Open answer key";
    }

    const question: Question = {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      prompt: newQPrompt.trim(),
      type: newQType,
      options,
      correctAnswer: correct,
      points: Number(newQPoints) || 10,
      explanation: newQExplanation.trim() || undefined,
    };

    setFormQuestions([...formQuestions, question]);
    resetQuestionDraft();
    notify("Question added to assessment!");
  }

  function handleRemoveQuestion(qId: string) {
    setFormQuestions(formQuestions.filter((q) => q.id !== qId));
  }

  // Save Assessment (Create or Update)
  function handleSaveAssessment(e: FormEvent) {
    e.preventDefault();

    if (!formTitle.trim()) {
      notify("Assessment title is required.", "error");
      return;
    }

    if (formQuestions.length === 0) {
      notify("Please add at least 1 question before saving.", "error");
      setFormTab("questions");
      return;
    }

    const courseObj = coursesList.find((c) => c.code === formCourseCode);
    const courseName = courseObj ? courseObj.name : "Course Resource";
    const calculatedTotalPoints = formQuestions.reduce((sum, q) => sum + q.points, 0);

    if (editingAssessmentId) {
      const existing = assessments.find((a) => a.id === editingAssessmentId);
      const updatedAssessment: Assessment = {
        ...existing!,
        title: formTitle.trim(),
        courseCode: formCourseCode,
        courseName,
        type: formType,
        status: formStatus,
        durationMinutes: Number(formDuration) || 30,
        totalPoints: calculatedTotalPoints,
        passingPercentage: Number(formPassing) || 60,
        allowedAttempts: Number(formAttempts) || 1,
        shuffleQuestions: formShuffle,
        showImmediateResults: formImmediateResults,
        dueDate: formDueDate,
        dueTime: formDueTime,
        instructions: formInstructions.trim() || "No instructions provided.",
        questions: formQuestions,
      };

      const updated = assessments.map((a) =>
        a.id === editingAssessmentId ? updatedAssessment : a
      );
      persist(updated);
      notify(`"${updatedAssessment.title}" updated successfully!`);
    } else {
      const newAssessment: Assessment = {
        id: `asm-${Date.now()}`,
        title: formTitle.trim(),
        courseCode: formCourseCode,
        courseName,
        type: formType,
        status: formStatus,
        durationMinutes: Number(formDuration) || 30,
        totalPoints: calculatedTotalPoints,
        passingPercentage: Number(formPassing) || 60,
        allowedAttempts: Number(formAttempts) || 1,
        shuffleQuestions: formShuffle,
        showImmediateResults: formImmediateResults,
        dueDate: formDueDate,
        dueTime: formDueTime,
        createdAt: new Date().toISOString().split("T")[0],
        instructions: formInstructions.trim() || "Complete all questions within the allowed time limit.",
        questions: formQuestions,
        submissions: [],
      };

      const updated = [newAssessment, ...assessments];
      persist(updated);
      notify(`"${newAssessment.title}" created successfully!`);
    }

    setShowFormModal(false);
  }

  // Duplicate assessment
  function handleDuplicate(asm: Assessment) {
    const clone: Assessment = {
      ...asm,
      id: `asm-${Date.now()}`,
      title: `${asm.title} (Copy)`,
      status: "Draft",
      createdAt: new Date().toISOString().split("T")[0],
      submissions: [],
    };
    persist([clone, ...assessments]);
    notify(`Cloned "${asm.title}" as Draft.`);
  }

  // Toggle status
  function toggleStatus(asm: Assessment) {
    const nextStatus = asm.status === "Published" ? "Draft" : "Published";
    const updated = assessments.map((a) =>
      a.id === asm.id ? { ...a, status: nextStatus as Assessment["status"] } : a
    );
    persist(updated);
    notify(`"${asm.title}" is now ${nextStatus}.`);
  }

  // Delete
  function confirmDelete() {
    if (!assessmentToDelete) return;
    const updated = assessments.filter((a) => a.id !== assessmentToDelete.id);
    persist(updated);
    notify(`"${assessmentToDelete.title}" deleted.`);
    setAssessmentToDelete(null);
  }

  // Copy share link
  function handleCopyLink(asm: Assessment) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/student/quizzes`
      );
      notify("Student quiz access link copied to clipboard!");
    } else {
      notify("Link copied: /student/quizzes");
    }
  }

  // Filtered assessments
  const filteredAssessments = useMemo(() => {
    const q = search.trim().toLowerCase();

    return assessments
      .filter((item) => {
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.courseCode.toLowerCase().includes(q) ||
          item.courseName.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q);

        const matchesCourse =
          courseFilter === "All Courses" || item.courseCode === courseFilter;

        const matchesType =
          typeFilter === "All Types" || item.type === typeFilter;

        const matchesStatus =
          statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesCourse && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "points") return b.totalPoints - a.totalPoints;
        if (sortBy === "submissions") return b.submissions.length - a.submissions.length;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [assessments, search, courseFilter, typeFilter, statusFilter, sortBy]);

  // Overall Statistics
  const totalAssessments = assessments.length;
  const publishedAssessments = assessments.filter((a) => a.status === "Published").length;
  const totalSubmissions = assessments.reduce((acc, a) => acc + a.submissions.length, 0);

  const totalScoresSum = assessments.reduce((sum, a) => {
    const subSum = a.submissions.reduce((s, sub) => s + (sub.score / (sub.totalPoints || 100)) * 100, 0);
    return sum + subSum;
  }, 0);
  const averageScorePercentage = totalSubmissions > 0 ? (totalScoresSum / totalSubmissions).toFixed(1) : "0";

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

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/instructor/mycourse" className="hover:text-[#0E2A47] underline underline-offset-4">
              My Courses
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/instructor/materials" className="hover:text-[#0E2A47] underline underline-offset-4">
              Materials
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/instructor/assignments" className="hover:text-[#0E2A47] underline underline-offset-4">
              Assignments
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
                <HelpCircle size={15} />
                EXAMINATION & QUIZZES MANAGEMENT
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Quizzes & Examination Center
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-300">
                Design online quizzes, midterms, and final exams with custom question types, auto-grading, time restrictions, and real-time student submission tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleResetSeed}
                title="Restore default seed quizzes"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <RefreshCw size={14} />
                Reset Data
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-5 py-3 text-sm font-bold text-[#07192B] shadow-lg transition hover:bg-[#E0BE61] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={18} />
                + Create New Assessment
              </button>
            </div>
          </div>
        </header>

        {/* Quick Statistics Bar */}
        <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Assessments"
            value={totalAssessments}
            subtitle="Quizzes, midterms & finals"
            badge="Assessments"
            icon={<HelpCircle size={22} />}
          />
          <StatCard
            title="Published & Live"
            value={publishedAssessments}
            subtitle="Available for students"
            badge="Live"
            icon={<CheckCircle2 size={22} />}
          />
          <StatCard
            title="Submissions Evaluated"
            value={totalSubmissions}
            subtitle="Student attempts graded"
            badge="Graded"
            icon={<FileCheck2 size={22} />}
          />
          <StatCard
            title="Class Avg Score"
            value={`${averageScorePercentage}%`}
            subtitle="Across all evaluations"
            badge="Performance"
            icon={<Award size={22} />}
          />
        </section>

        {/* Quick Type Filter Pills */}
        <div className="mb-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {["All Types", "Quiz", "Midterm Exam", "Final Exam", "Practice Test", "Lab Assessment"].map((type) => {
            const isActive = typeFilter === type;
            const count =
              type === "All Types"
                ? assessments.length
                : assessments.filter((a) => a.type === type).length;

            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0E2A47] text-white shadow-md shadow-[#0E2A47]/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#D5AE48] hover:text-[#0E2A47]"
                }`}
              >
                <span>{type}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isActive ? "bg-[#D5AE48] text-[#07192B]" : "bg-slate-100 text-slate-600"
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
              <h2 className="font-bold text-[#0E2A47]">Assessments Catalog</h2>
              <p className="text-xs text-slate-500">
                Organize, evaluate, preview, or monitor class examination performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Showing {filteredAssessments.length} of {assessments.length} tests
              </span>

              {/* View mode toggle */}
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid Cards"
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
                  title="Table View"
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quiz, course, or topic..."
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Status</option>
              <option value="Published">Published (Live)</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "dueDate" | "points" | "submissions" | "title")}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
            >
              <option value="dueDate">Sort by: Exam / Due Date</option>
              <option value="points">Sort by: Total Points</option>
              <option value="submissions">Sort by: Most Submissions</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>
          </div>
        </section>

        {/* Empty State */}
        {filteredAssessments.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <HelpCircle size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0E2A47]">No quizzes or exams found</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              No assessments matched your query. Try adjusting your filters or create a new test.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearch("");
                  setCourseFilter("All Courses");
                  setTypeFilter("All Types");
                  setStatusFilter("ALL");
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>
              <button
                onClick={handleOpenCreate}
                className="rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#173C5F]"
              >
                + Create Assessment
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssessments.map((item) => {
              const avgScore =
                item.submissions.length > 0
                  ? (
                      item.submissions.reduce((s, sub) => s + sub.score, 0) /
                      item.submissions.length
                    ).toFixed(1)
                  : null;

              return (
                <article
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D5AE48]/70 hover:shadow-lg"
                >
                  <div>
                    {/* Badges & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">
                          {item.courseCode}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {item.type}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleStatus(item)}
                        title="Click to toggle status"
                        className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-bold transition hover:opacity-80 ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "Scheduled"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </button>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setPreviewAssessment(item)}
                      className="mt-3 cursor-pointer text-base font-bold text-[#0E2A47] hover:text-amber-600 line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400 font-medium">
                      {item.courseName}
                    </p>

                    {/* Specs / Metadata Bar */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400">Questions</span>
                        <span className="font-bold text-[#0E2A47]">{item.questions.length} Qs</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Duration</span>
                        <span className="font-bold text-[#0E2A47]">{item.durationMinutes} min</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Points</span>
                        <span className="font-bold text-amber-700">{item.totalPoints} pts</span>
                      </div>
                    </div>

                    {/* Instructions snippet */}
                    <p className="mt-3 text-xs leading-5 text-slate-500 line-clamp-2">
                      {item.instructions}
                    </p>

                    {/* Due Date & Submission Stats */}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>Due {item.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-1 font-semibold text-[#0E2A47]">
                        <Users size={13} className="text-amber-600" />
                        <span>{item.submissions.length} submitted</span>
                        {avgScore && (
                          <span className="text-[11px] text-slate-400 font-normal">
                            (avg: {avgScore} pts)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 flex items-center justify-between gap-1.5 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setResultsAssessment(item)}
                      title="View student submissions"
                      className="inline-flex items-center gap-1 rounded-xl bg-[#0E2A47] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                    >
                      <BarChart2 size={13} />
                      Submissions ({item.submissions.length})
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewAssessment(item)}
                        title="Preview questions"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0E2A47]"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        onClick={() => handleCopyLink(item)}
                        title="Copy student link"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0E2A47]"
                      >
                        <Share2 size={13} />
                      </button>

                      <button
                        onClick={() => handleDuplicate(item)}
                        title="Duplicate test"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0E2A47]"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Edit assessment"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0E2A47]"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        onClick={() => setAssessmentToDelete(item)}
                        title="Delete assessment"
                        className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          /* TABLE VIEW */
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                  <tr>
                    <th className="p-4">Assessment Title</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Questions</th>
                    <th className="p-4">Duration & Points</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Submissions</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/80">
                      <td className="p-4">
                        <p
                          onClick={() => setPreviewAssessment(item)}
                          className="cursor-pointer font-bold text-[#0E2A47] hover:text-amber-600 line-clamp-1"
                        >
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.instructions}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">
                          {item.courseCode}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{item.type}</td>
                      <td className="p-4 font-bold text-slate-700">{item.questions.length} Qs</td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-700">{item.durationMinutes} min</p>
                        <p className="text-[11px] text-amber-700 font-bold">{item.totalPoints} pts</p>
                      </td>
                      <td className="p-4 font-medium text-slate-600">{item.dueDate}</td>
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
                      <td className="p-4 text-center font-bold text-slate-800">
                        {item.submissions.length}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setResultsAssessment(item)}
                            title="View Submissions"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0E2A47]"
                          >
                            <BarChart2 size={14} />
                          </button>
                          <button
                            onClick={() => setPreviewAssessment(item)}
                            title="Preview"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0E2A47]"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0E2A47]"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setAssessmentToDelete(item)}
                            title="Delete"
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* CREATE / EDIT ASSESSMENT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#07192B] to-[#0E2A47] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#D5AE48] p-2 text-[#07192B]">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {editingAssessmentId ? "Edit Assessment" : "Create New Quiz or Exam"}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Configure timing, grading rules, and author customized questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFormTab("settings")}
                className={`py-3 px-4 border-b-2 transition ${
                  formTab === "settings"
                    ? "border-[#0E2A47] text-[#0E2A47]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                1. General Settings & Timing
              </button>
              <button
                type="button"
                onClick={() => setFormTab("questions")}
                className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
                  formTab === "questions"
                    ? "border-[#0E2A47] text-[#0E2A47]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <span>2. Questions Builder</span>
                <span className="rounded-full bg-[#D5AE48] px-2 py-0.5 text-[10px] text-[#07192B]">
                  {formQuestions.length} Qs
                </span>
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="p-6">
              {formTab === "settings" ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Assessment Title *
                    </label>
                    <input
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Midterm 1: Data Structures & Complexity"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Assign to Course *
                      </label>
                      <select
                        value={formCourseCode}
                        onChange={(e) => setFormCourseCode(e.target.value)}
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
                        Assessment Type *
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as Assessment["type"])}
                        className={inputClass}
                      >
                        <option>Quiz</option>
                        <option>Midterm Exam</option>
                        <option>Final Exam</option>
                        <option>Practice Test</option>
                        <option>Lab Assessment</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Publication Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as Assessment["status"])}
                        className={inputClass}
                      >
                        <option value="Published">Published (Live for students)</option>
                        <option value="Draft">Draft (Hidden)</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Allowed Attempts
                      </label>
                      <select
                        value={formAttempts}
                        onChange={(e) => setFormAttempts(e.target.value)}
                        className={inputClass}
                      >
                        <option value="1">1 Attempt only</option>
                        <option value="2">2 Attempts</option>
                        <option value="3">3 Attempts</option>
                        <option value="5">Unlimited / Practice</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formPassing}
                        onChange={(e) => setFormPassing(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formDueDate}
                        onChange={(e) => setFormDueDate(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Due Time
                      </label>
                      <input
                        type="time"
                        value={formDueTime}
                        onChange={(e) => setFormDueTime(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Instructions & Student Guidelines
                    </label>
                    <textarea
                      rows={3}
                      value={formInstructions}
                      onChange={(e) => setFormInstructions(e.target.value)}
                      placeholder="Specify test guidelines, topics included, calculator policies..."
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formShuffle}
                        onChange={(e) => setFormShuffle(e.target.checked)}
                        className="h-4 w-4 rounded text-[#0E2A47]"
                      />
                      <span>Shuffle questions for each student</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formImmediateResults}
                        onChange={(e) => setFormImmediateResults(e.target.checked)}
                        className="h-4 w-4 rounded text-[#0E2A47]"
                      />
                      <span>Show score immediately upon submission</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Configured Questions ({formQuestions.length}) · Total:{" "}
                        <span className="text-[#0E2A47] font-black">
                          {formQuestions.reduce((s, q) => s + q.points, 0)} Points
                        </span>
                      </h4>
                    </div>

                    {formQuestions.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
                        No questions added yet. Use the question builder below to add questions.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {formQuestions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-[#0E2A47] mr-1.5">
                                Q{idx + 1}. ({q.points} pts)
                              </span>
                              <span className="text-slate-700 font-medium">{q.prompt}</span>
                              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="uppercase font-semibold">{q.type.replace("_", " ")}</span>
                                <span>·</span>
                                <span className="text-emerald-700 font-bold">Ans: {q.correctAnswer}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(q.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete question"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-[#0E2A47] flex items-center gap-1.5">
                        <Plus size={15} /> Add New Question
                      </h5>
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-600">
                        Question Prompt *
                      </label>
                      <input
                        value={newQPrompt}
                        onChange={(e) => setNewQPrompt(e.target.value)}
                        placeholder="e.g. What is the difference between an abstract class and an interface?"
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-slate-600">
                          Question Type
                        </label>
                        <select
                          value={newQType}
                          onChange={(e) => setNewQType(e.target.value as QuestionType)}
                          className={inputClass}
                        >
                          <option value="multiple_choice">Multiple Choice (4 Options)</option>
                          <option value="true_false">True / False</option>
                          <option value="short_answer">Short Answer</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-slate-600">
                          Point Allocation
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={newQPoints}
                          onChange={(e) => setNewQPoints(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {newQType === "multiple_choice" && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">Option A</label>
                          <input
                            value={newQOptA}
                            onChange={(e) => setNewQOptA(e.target.value)}
                            placeholder="Option A"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">Option B</label>
                          <input
                            value={newQOptB}
                            onChange={(e) => setNewQOptB(e.target.value)}
                            placeholder="Option B"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">Option C</label>
                          <input
                            value={newQOptC}
                            onChange={(e) => setNewQOptC(e.target.value)}
                            placeholder="Option C"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">Option D</label>
                          <input
                            value={newQOptD}
                            onChange={(e) => setNewQOptD(e.target.value)}
                            placeholder="Option D"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-600">
                        Correct Answer
                      </label>
                      {newQType === "true_false" ? (
                        <select
                          value={newQCorrect}
                          onChange={(e) => setNewQCorrect(e.target.value)}
                          className={inputClass}
                        >
                          <option value="True">True</option>
                          <option value="False">False</option>
                        </select>
                      ) : (
                        <input
                          value={newQCorrect}
                          onChange={(e) => setNewQCorrect(e.target.value)}
                          placeholder="Type exact correct option text"
                          className={inputClass}
                        />
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-600">
                        Explanation (optional, displayed after grading)
                      </label>
                      <input
                        value={newQExplanation}
                        onChange={(e) => setNewQExplanation(e.target.value)}
                        placeholder="Why is this answer correct?"
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-bold text-white hover:bg-[#173C5F]"
                    >
                      <Plus size={14} /> Add this Question
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {formTab === "settings" ? (
                    <button
                      type="button"
                      onClick={() => setFormTab("questions")}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#173C5F]"
                    >
                      Next: Add Questions <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFormTab("settings")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Back to Settings
                    </button>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#D5AE48] px-6 py-2.5 text-xs font-bold text-[#07192B] hover:bg-[#E0BE61] shadow-md"
                  >
                    <Check size={14} />
                    Save Assessment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT / QUESTIONS PREVIEW MODAL */}
      {previewAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#07192B] to-[#0E2A47] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2.5">
                  <FileText size={20} className="text-[#D5AE48]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#E0BE61]">
                    {previewAssessment.courseCode} · {previewAssessment.type}
                  </span>
                  <h3 className="font-bold text-base leading-tight mt-0.5">
                    {previewAssessment.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewAssessment(null)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Time</span>
                  <span className="font-bold text-[#0E2A47]">{previewAssessment.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Points</span>
                  <span className="font-bold text-amber-700">{previewAssessment.totalPoints} Points</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Attempts Allowed</span>
                  <span className="font-bold text-slate-700">{previewAssessment.allowedAttempts}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">Instructions</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {previewAssessment.instructions}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Examination Questions ({previewAssessment.questions.length})
                </h4>

                {previewAssessment.questions.map((q, idx) => (
                  <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#0E2A47] text-sm">
                        Q{idx + 1}. {q.prompt}
                      </span>
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 shrink-0">
                        {q.points} pts
                      </span>
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = opt === q.correctAnswer;
                          return (
                            <div
                              key={oIdx}
                              className={`rounded-xl px-3 py-2 text-xs border font-medium ${
                                isCorrect
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              <span className="mr-2 text-slate-400">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {opt}
                              {isCorrect && (
                                <span className="ml-2 text-[10px] font-bold text-emerald-600">
                                  ✓ (Key)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === "short_answer" && (
                      <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 text-slate-600">
                        <span className="font-bold text-emerald-700">Expected Answer Key: </span>
                        {q.correctAnswer}
                      </div>
                    )}

                    {q.explanation && (
                      <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewAssessment(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(previewAssessment);
                    setPreviewAssessment(null);
                  }}
                  className="rounded-xl bg-[#0E2A47] px-5 py-2 text-xs font-bold text-white hover:bg-[#173C5F]"
                >
                  Edit Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS & RESULTS MODAL */}
      {resultsAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#07192B] to-[#0E2A47] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2.5">
                  <BarChart2 size={20} className="text-[#D5AE48]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#E0BE61]">
                    {resultsAssessment.courseCode} · Submissions & Performance
                  </span>
                  <h3 className="font-bold text-base leading-tight mt-0.5">
                    {resultsAssessment.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setResultsAssessment(null)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-center border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-xs">Total Submissions</span>
                  <span className="text-xl font-black text-[#0E2A47]">
                    {resultsAssessment.submissions.length} Students
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Average Score</span>
                  <span className="text-xl font-black text-amber-700">
                    {resultsAssessment.submissions.length > 0
                      ? (
                          resultsAssessment.submissions.reduce((s, sub) => s + sub.score, 0) /
                          resultsAssessment.submissions.length
                        ).toFixed(1)
                      : "0"}{" "}
                    / {resultsAssessment.totalPoints}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Passing Rate</span>
                  <span className="text-xl font-black text-emerald-700">
                    {resultsAssessment.submissions.length > 0
                      ? `${(
                          (resultsAssessment.submissions.filter(
                            (s) =>
                              (s.score / s.totalPoints) * 100 >=
                              resultsAssessment.passingPercentage
                          ).length /
                            resultsAssessment.submissions.length) *
                          100
                        ).toFixed(0)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Student Results
                </h4>

                {resultsAssessment.submissions.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-400">
                    No student submissions have been recorded for this assessment yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                        <tr>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">ID</th>
                          <th className="p-3">Submitted At</th>
                          <th className="p-3">Time Taken</th>
                          <th className="p-3 text-center">Score</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {resultsAssessment.submissions.map((sub) => {
                          const percentage = Math.round((sub.score / sub.totalPoints) * 100);
                          const passed = percentage >= resultsAssessment.passingPercentage;

                          return (
                            <tr key={sub.id} className="hover:bg-slate-50">
                              <td className="p-3">
                                <p className="font-bold text-[#0E2A47]">{sub.studentName}</p>
                                <p className="text-[11px] text-slate-400">{sub.studentEmail}</p>
                              </td>
                              <td className="p-3 font-mono text-slate-600">{sub.studentId}</td>
                              <td className="p-3 text-slate-500">{sub.submittedAt}</td>
                              <td className="p-3 text-slate-500">{sub.timeSpentMinutes} mins</td>
                              <td className="p-3 text-center font-bold">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-xs ${
                                    passed
                                      ? "bg-emerald-50 text-emerald-800 font-extrabold"
                                      : "bg-red-50 text-red-700"
                                  }`}
                                >
                                  {sub.score} / {sub.totalPoints} ({percentage}%)
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                  {sub.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResultsAssessment(null)}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {assessmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
              <Trash2 size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#0E2A47]">Delete Assessment?</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong>&quot;{assessmentToDelete.title}&quot;</strong> ({assessmentToDelete.courseCode})? All associated student submissions and records will be permanently removed.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setAssessmentToDelete(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-md shadow-red-600/20"
              >
                Yes, Delete Assessment
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
  value: string | number;
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
