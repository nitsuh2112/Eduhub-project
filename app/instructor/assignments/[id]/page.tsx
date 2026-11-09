"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Search,
  Edit3,
  Trash2,
  Users,
  Award,
  AlertCircle,
  X,
  Save,
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

type StudentSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
  grade?: number;
  maxPoints: number;
  status: "Graded" | "Pending" | "Late";
  feedback?: string;
  notes?: string;
};

const DEFAULT_SUBMISSIONS: Omit<StudentSubmission, "maxPoints">[] = [
  {
    id: "sub-1",
    studentId: "ETS-0142",
    studentName: "Abebe Bikila",
    studentEmail: "abebe.b@eduhub.edu",
    avatar: "AB",
    submittedAt: "2026-10-18T14:30:00",
    fileName: "er_diagram_solution.pdf",
    fileSize: "1.4 MB",
    grade: 18,
    status: "Graded",
    feedback: "Excellent database normalization and clear entity relationships.",
    notes: "Submitted on time. All requirements met.",
  },
  {
    id: "sub-2",
    studentId: "ETS-0284",
    studentName: "Sara Tadesse",
    studentEmail: "sara.t@eduhub.edu",
    avatar: "ST",
    submittedAt: "2026-10-19T09:15:00",
    fileName: "database_design_v2.pdf",
    fileSize: "2.1 MB",
    status: "Pending",
    notes: "Please review section 3 for composite primary key choices.",
  },
  {
    id: "sub-3",
    studentId: "ETS-0319",
    studentName: "Dawit Yohannes",
    studentEmail: "dawit.y@eduhub.edu",
    avatar: "DY",
    submittedAt: "2026-10-18T16:45:00",
    fileName: "schema_design_final.docx",
    fileSize: "840 KB",
    grade: 19,
    status: "Graded",
    feedback: "Great work on indexing strategies. Keep it up!",
  },
  {
    id: "sub-4",
    studentId: "ETS-0401",
    studentName: "Meron Alemu",
    studentEmail: "meron.a@eduhub.edu",
    avatar: "MA",
    submittedAt: "2026-10-19T11:20:00",
    fileName: "db_project_submission.pdf",
    fileSize: "1.8 MB",
    status: "Pending",
  },
  {
    id: "sub-5",
    studentId: "ETS-0512",
    studentName: "Kidus Girma",
    studentEmail: "kidus.g@eduhub.edu",
    avatar: "KG",
    submittedAt: "2026-10-17T18:00:00",
    fileName: "er_model_and_sql.txt",
    fileSize: "120 KB",
    status: "Late",
    notes: "Submitted after initial deadline due to technical network issue.",
  },
];

function formatDate(date: string) {
  if (!date) return "Not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(iso: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AssignmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string | undefined;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "submissions">("overview");

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: 10,
  });

  // Submissions & Grading state
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  // Notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Load assignment and submissions
  useEffect(() => {
    if (!assignmentId) {
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem("eduhub_assignments");
      const list: Assignment[] = stored ? JSON.parse(stored) : [];
      const found = list.find((item) => String(item.id) === String(assignmentId));

      if (found) {
        setAssignment(found);
        setEditForm({
          title: found.title,
          description: found.description,
          dueDate: found.dueDate,
          points: found.points,
        });

        // Load submissions
        const submissionsKey = `eduhub_submissions_${assignmentId}`;
        const storedSubs = localStorage.getItem(submissionsKey);

        if (storedSubs) {
          setSubmissions(JSON.parse(storedSubs));
        } else {
          // Initialize demo submissions for this assignment
          const initialSubs: StudentSubmission[] = DEFAULT_SUBMISSIONS.map((sub) => ({
            ...sub,
            maxPoints: found.points,
            grade: sub.grade ? Math.min(sub.grade, found.points) : undefined,
          }));
          localStorage.setItem(submissionsKey, JSON.stringify(initialSubs));
          setSubmissions(initialSubs);
        }
      } else {
        setAssignment(null);
      }
    } catch {
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  // Handle Edit Save
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!assignment) return;

    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.dueDate) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const updatedAssignment: Assignment = {
      ...assignment,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      dueDate: editForm.dueDate,
      points: Number(editForm.points) || assignment.points,
    };

    try {
      const stored = localStorage.getItem("eduhub_assignments");
      const list: Assignment[] = stored ? JSON.parse(stored) : [];
      const updatedList = list.map((item) =>
        String(item.id) === String(assignment.id) ? updatedAssignment : item
      );

      localStorage.setItem("eduhub_assignments", JSON.stringify(updatedList));
      setAssignment(updatedAssignment);
      setIsEditing(false);
      showToast("Assignment updated successfully!");
    } catch {
      showToast("Failed to update assignment.", "error");
    }
  }

  // Handle Delete
  function handleDeleteAssignment() {
    if (!assignment) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignment.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const stored = localStorage.getItem("eduhub_assignments");
      const list: Assignment[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((item) => String(item.id) !== String(assignment.id));

      localStorage.setItem("eduhub_assignments", JSON.stringify(filtered));
      localStorage.removeItem(`eduhub_submissions_${assignment.id}`);

      showToast("Assignment deleted.");
      setTimeout(() => {
        router.push("/instructor/assignments");
      }, 500);
    } catch {
      showToast("Failed to delete assignment.", "error");
    }
  }

  // Handle Grading
  function openGradingModal(sub: StudentSubmission) {
    setSelectedSubmission(sub);
    setGradeInput(sub.grade !== undefined ? String(sub.grade) : "");
    setFeedbackInput(sub.feedback || "");
  }

  function handleSaveGrade(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubmission || !assignment) return;

    const numericGrade = Number(gradeInput);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > assignment.points) {
      showToast(`Grade must be a number between 0 and ${assignment.points}.`, "error");
      return;
    }

    const updatedSubs = submissions.map((sub) => {
      if (sub.id === selectedSubmission.id) {
        return {
          ...sub,
          grade: numericGrade,
          feedback: feedbackInput.trim(),
          status: "Graded" as const,
        };
      }
      return sub;
    });

    setSubmissions(updatedSubs);
    localStorage.setItem(`eduhub_submissions_${assignment.id}`, JSON.stringify(updatedSubs));
    setSelectedSubmission(null);
    showToast(`Grade saved for ${selectedSubmission.studentName}!`);
  }

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    const q = searchStudent.toLowerCase().trim();
    return submissions.filter((sub) => {
      const matchesSearch =
        !q ||
        sub.studentName.toLowerCase().includes(q) ||
        sub.studentId.toLowerCase().includes(q) ||
        sub.studentEmail.toLowerCase().includes(q);

      const matchesStatus = filterStatus === "ALL" || sub.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchStudent, filterStatus]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <div className="mx-auto max-w-4xl text-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0E2A47] border-t-transparent mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Loading assignment details...</p>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200 mt-12">
          <FileText size={44} className="mx-auto text-amber-600" />
          <h1 className="mt-4 text-2xl font-bold text-[#0E2A47]">
            Assignment Not Found
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            This assignment may have been deleted or is not saved in this browser storage.
          </p>
          <Link
            href="/instructor/assignments"
            className="mt-6 inline-flex rounded-xl bg-[#0E2A47] px-6 py-3 font-semibold text-white transition hover:bg-[#173C5F]"
          >
            Back to Assignments
          </Link>
        </div>
      </main>
    );
  }

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const isPastDue = assignment.dueDate < todayString;

  const totalSubmitted = submissions.length;
  const totalGraded = submissions.filter((s) => s.status === "Graded").length;
  const totalPending = submissions.filter((s) => s.status === "Pending" || s.status === "Late").length;
  const avgGrade =
    totalGraded > 0
      ? Math.round(
          submissions
            .filter((s) => s.grade !== undefined)
            .reduce((acc, curr) => acc + (curr.grade || 0), 0) / totalGraded
        )
      : null;

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-4 text-slate-800 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl transition-all ${
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

      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/instructor/assignments"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E2A47] transition hover:text-amber-600"
          >
            <ArrowLeft size={18} />
            Back to Assignments
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Edit3 size={15} />
              Edit Assignment
            </button>
            <button
              type="button"
              onClick={handleDeleteAssignment}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100/70"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07192B] via-[#0E2A47] to-[#204B70] p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[#E0BE61]">
                <ClipboardList size={14} />
                {assignment.courseCode}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isPastDue
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {isPastDue ? "Past Due" : "Active / Published"}
              </span>
            </div>

            <h1 className="mt-4 break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
              {assignment.title}
            </h1>

            <p className="mt-2 text-sm text-slate-300">{assignment.courseName}</p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Due Date</p>
              <p className="mt-1 text-sm font-bold text-white sm:text-base">
                {formatDate(assignment.dueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Max Points</p>
              <p className="mt-1 text-sm font-bold text-[#E0BE61] sm:text-base">
                {assignment.points} pts
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Submissions</p>
              <p className="mt-1 text-sm font-bold text-white sm:text-base">
                {totalSubmitted} submitted
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Graded</p>
              <p className="mt-1 text-sm font-bold text-emerald-400 sm:text-base">
                {totalGraded} of {totalSubmitted}
                {avgGrade !== null && ` (Avg: ${avgGrade})`}
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition ${
              activeTab === "overview"
                ? "border-[#0E2A47] text-[#0E2A47]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText size={17} />
            Instructions & Material
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition ${
              activeTab === "submissions"
                ? "border-[#0E2A47] text-[#0E2A47]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users size={17} />
            Student Submissions ({totalSubmitted})
            {totalPending > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                {totalPending} pending
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW & INSTRUCTIONS */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-[#0E2A47] sm:text-xl">
                Assignment Instructions
              </h2>

              <div className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                {assignment.description}
              </div>

              {/* Attached file download */}
              {assignment.fileName && assignment.fileData && (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0E2A47]">
                          {assignment.fileName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Assignment resource attached by instructor
                        </p>
                      </div>
                    </div>

                    <a
                      href={assignment.fileData}
                      download={assignment.fileName}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0E2A47] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                    >
                      <Download size={15} />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Course metadata card */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <CalendarDays className="mb-2 text-amber-600" size={22} />
                <p className="text-xs text-slate-500">Submission Deadline</p>
                <p className="mt-1 font-bold text-[#0E2A47]">
                  {formatDate(assignment.dueDate)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isPastDue ? "Deadline has passed" : "Accepting submissions"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Award className="mb-2 text-amber-600" size={22} />
                <p className="text-xs text-slate-500">Total Points Possible</p>
                <p className="mt-1 font-bold text-[#0E2A47]">
                  {assignment.points} Points
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Graded on 100% scale
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <BookOpen className="mb-2 text-amber-600" size={22} />
                <p className="text-xs text-slate-500">Course Code</p>
                <p className="mt-1 font-bold text-[#0E2A47]">
                  {assignment.courseCode}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {assignment.courseName}
                </p>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS & GRADING */}
        {activeTab === "submissions" && (
          <div className="mt-6 space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search student by name or ID..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Status ({submissions.length})</option>
                  <option value="Graded">Graded ({totalGraded})</option>
                  <option value="Pending">Pending Review ({totalPending})</option>
                  <option value="Late">Late Submissions</option>
                </select>
              </div>
            </div>

            {/* Submissions List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="hidden grid-cols-12 border-b border-slate-100 bg-slate-50 px-6 py-3.5 text-xs font-bold text-slate-500 sm:grid">
                <span className="col-span-4">Student</span>
                <span className="col-span-3">Submitted File</span>
                <span className="col-span-2">Date</span>
                <span className="col-span-1">Status</span>
                <span className="col-span-2 text-right">Grade / Action</span>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center">
                  <Users size={32} className="mx-auto text-slate-300" />
                  <p className="mt-3 font-bold text-[#0E2A47]">No submissions found</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try another search term or reset filters.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="grid grid-cols-1 items-center gap-3 p-4 transition hover:bg-slate-50/70 sm:grid-cols-12 sm:px-6 sm:py-4"
                    >
                      {/* Student info */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E2A47] text-xs font-bold text-[#D5AE48]">
                          {sub.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#0E2A47]">
                            {sub.studentName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {sub.studentId} · {sub.studentEmail}
                          </p>
                        </div>
                      </div>

                      {/* File */}
                      <div className="col-span-3 flex items-center gap-2 text-xs text-slate-600">
                        {sub.fileName ? (
                          <span className="inline-flex items-center gap-1.5 truncate rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                            <FileText size={13} className="shrink-0 text-amber-600" />
                            <span className="truncate">{sub.fileName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No file</span>
                        )}
                      </div>

                      {/* Submitted At */}
                      <div className="col-span-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock3 size={13} className="text-slate-400" />
                          <span>{formatDateTime(sub.submittedAt)}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${
                            sub.status === "Graded"
                              ? "bg-emerald-50 text-emerald-700"
                              : sub.status === "Late"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {/* Score & Action */}
                      <div className="col-span-2 flex items-center justify-end gap-3">
                        {sub.grade !== undefined ? (
                          <span className="text-sm font-bold text-[#0E2A47]">
                            {sub.grade}
                            <span className="text-xs text-slate-400">
                              /{sub.maxPoints}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Ungraded</span>
                        )}

                        <button
                          type="button"
                          onClick={() => openGradingModal(sub)}
                          className="rounded-xl bg-[#0E2A47] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#173C5F]"
                        >
                          {sub.grade !== undefined ? "Edit" : "Grade"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: GRADING / SUBMISSION REVIEW */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#07192B] to-[#0E2A47] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#0E2A47]">
                  {selectedSubmission.avatar}
                </div>
                <div>
                  <h3 className="font-bold">{selectedSubmission.studentName}</h3>
                  <p className="text-xs text-slate-300">
                    {selectedSubmission.studentId} · {selectedSubmission.studentEmail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Submitted File:</span>
                  <span className="font-mono text-slate-800">
                    {selectedSubmission.fileName || "None"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-slate-500">
                  <span>Submitted on:</span>
                  <span>{formatDateTime(selectedSubmission.submittedAt)}</span>
                </div>
                {selectedSubmission.notes && (
                  <p className="mt-2 border-t border-slate-200/60 pt-2 italic text-slate-500">
                    &quot;{selectedSubmission.notes}&quot;
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Score (out of {assignment.points}) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={assignment.points}
                    required
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    placeholder={`0 - ${assignment.points}`}
                    className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-[#0E2A47] outline-none focus:border-amber-500 focus:bg-white"
                  />
                  <span className="text-sm font-semibold text-slate-500">
                    / {assignment.points} pts
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Instructor Feedback (optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Provide comments, constructive feedback, or suggestions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                >
                  <Save size={15} />
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ASSIGNMENT */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#0E2A47] p-5 text-white">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-[#D5AE48]" />
                <h3 className="font-bold text-lg">Edit Assignment</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.dueDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dueDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Total Points *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={editForm.points}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        points: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Instructions / Description *
                </label>
                <textarea
                  rows={5}
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E2A47] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#173C5F]"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}