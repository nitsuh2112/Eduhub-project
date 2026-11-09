"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  IdCard,
  Search,
  ShieldCheck,
  AlertCircle,
  Building2,
  ChevronDown,
} from "lucide-react";

// ============================================================
// DEPARTMENT TYPE
// ============================================================

type Department = {
  code: string;
  name: string;
};

// ============================================================
// DEPARTMENTS
// ============================================================

const departments: Department[] = [
  {
    code: "SE",
    name: "Software Engineering",
  },
  {
    code: "CS",
    name: "Computer Science",
  },
  {
    code: "IT",
    name: "Information Technology",
  },
  {
    code: "IS",
    name: "Information Systems",
  },
  {
    code: "EE",
    name: "Electrical Engineering",
  },
];

// ============================================================
// PAGE
// ============================================================

export default function ViewGradesPage() {
  const router = useRouter();

  // ============================================================
  // STATE
  // ============================================================

  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // HANDLE DEPARTMENT CHANGE
  // ============================================================

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);

    if (error) {
      setError("");
    }
  };

  // ============================================================
  // HANDLE STUDENT ID CHANGE
  // ============================================================

  const handleStudentIdChange = (value: string) => {
    setStudentId(value);

    if (error) {
      setError("");
    }
  };

  // ============================================================
  // HANDLE VIEW GRADES
  // ============================================================

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedStudentId = studentId.trim().toUpperCase();

    // ==========================================================
    // 1. DEPARTMENT REQUIRED
    // ==========================================================

    if (!department) {
      setError("Please select your department first.");
      return;
    }

    // ==========================================================
    // 2. STUDENT ID REQUIRED
    // ==========================================================

    if (!trimmedStudentId) {
      setError("Please enter your Student ID.");
      return;
    }

    // ==========================================================
    // 3. STUDENT ID FORMAT
    // ==========================================================

    

   
    // ==========================================================
    // 4. GET DEPARTMENT CODE FROM STUDENT ID
    // ==========================================================

    const studentIdParts = trimmedStudentId.split("/");

    const studentDepartmentCode = studentIdParts[1];

    // ==========================================================
    // 5. CHECK DEPARTMENT MATCH
    // ==========================================================

    if (studentDepartmentCode !== department) {
      const selectedDepartment = departments.find(
        (item) => item.code === department
      );

      const studentDepartment = departments.find(
        (item) => item.code === studentDepartmentCode
      );

      setError(
        `The selected department is "${selectedDepartment?.name}", but this Student ID belongs to "${studentDepartment?.name}".`
      );

      return;
    }

    // ==========================================================
    // 6. CLEAR ERROR
    // ==========================================================

    setError("");

    // ==========================================================
    // 7. SEND DEPARTMENT + STUDENT ID TO GRADES PAGE
    // ==========================================================

    router.push(
      `/student/grades?department=${encodeURIComponent(
        department
      )}&studentId=${encodeURIComponent(trimmedStudentId)}`
    );
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-[#07192B] px-5 py-8 text-white sm:px-8">
      {/* ========================================================
          BACKGROUND EFFECTS
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#D5AE48]/10 blur-3xl" />

        <div className="absolute -right-40 top-[30%] h-[500px] w-[500px] rounded-full bg-[#0E2A47] blur-3xl" />

        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-[#D5AE48]/5 blur-3xl" />
      </div>

      {/* ========================================================
          TOP NAVIGATION
      ======================================================== */}

      <div className="relative z-10 mx-auto max-w-5xl">
        <Link
          href="/student/grades"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#B8C7D8] transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={17} />

          Back to My Grades
        </Link>
      </div>

      {/* ========================================================
          CENTER CONTENT
      ======================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center py-10">
        <div className="w-full max-w-md">

          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="mb-8 text-center">

            {/* Logo */}

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5AE48] text-[#07192B] shadow-xl shadow-black/20">
              <GraduationCap size={31} />
            </div>

            {/* Title */}

            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              View My Grades
            </h1>

            {/* Description */}

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#B8C7D8]">
              Select your department and enter your
              Student ID to view your academic grades.
            </p>
          </div>

          {/* ======================================================
              MAIN CARD
          ====================================================== */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

            {/* ==================================================
                CARD HEADER
            ================================================== */}

            <div className="mb-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D5AE48]/10 text-[#D5AE48]">
                <Building2 size={23} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-white">
                Student Verification
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#B8C7D8]">
                First select your department, then enter
                your Student ID.
              </p>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ==================================================
                  DEPARTMENT
              ================================================== */}

              <div>

                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Department
                </label>

                <div className="relative">

                  <Building2
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#B8C7D8]"
                  />

                  <select
                    id="department"
                    name="department"
                    value={department}
                    onChange={(event) =>
                      handleDepartmentChange(
                        event.target.value
                      )
                    }
                    className={`w-full appearance-none rounded-xl border bg-[#0E2A47] py-3.5 pl-11 pr-11 text-sm text-white outline-none transition ${
                      error
                        ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                        : "border-white/10 focus:border-[#D5AE48] focus:ring-2 focus:ring-[#D5AE48]/10"
                    }`}
                  >

                    <option
                      value=""
                      className="bg-[#0E2A47] text-[#B8C7D8]"
                    >
                      Select Department
                    </option>

                    {departments.map((item) => (
                      <option
                        key={item.code}
                        value={item.code}
                        className="bg-[#0E2A47] text-white"
                      >
                        {item.name}
                      </option>
                    ))}

                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#B8C7D8]"
                  />
                </div>

                {/* Department Code */}

                {department && (
                  <p className="mt-2 text-xs text-[#B8C7D8]">
                    Department code:{" "}
                    <span className="font-bold text-[#E0BE61]">
                      {department}
                    </span>
                  </p>
                )}
              </div>

              {/* ==================================================
                  STUDENT ID
              ================================================== */}

              <div>

                <label
                  htmlFor="studentId"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Student ID
                </label>

                <div className="relative">

                  <IdCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8C7D8]"
                  />

                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={studentId}
                    onChange={(event) =>
                      handleStudentIdChange(
                        event.target.value
                      )
                    }
                    
                    autoComplete="off"
                    className={`w-full rounded-xl border bg-[#0E2A47] py-3.5 pl-11 pr-4 text-sm uppercase text-white outline-none transition placeholder:text-[#B8C7D8]/50 ${
                      error
                        ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                        : "border-white/10 focus:border-[#D5AE48] focus:ring-2 focus:ring-[#D5AE48]/10"
                    }`}
                  />
                </div>

                <p className="mt-2 text-xs text-[#B8C7D8]">
                  Example:{" "}
                  
                </p>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-xs font-medium text-red-400">
                    <AlertCircle
                      size={15}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* ==================================================
                  BUTTON
              ================================================== */}

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#D5AE48] px-5 py-3.5 text-sm font-bold text-[#07192B] shadow-lg shadow-[#D5AE48]/10 transition hover:bg-[#E0BE61] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D5AE48] focus:ring-offset-2 focus:ring-offset-[#07192B]"
              >
                <Search size={17} />

                View Grades

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* ==================================================
                INFORMATION BOX
            ================================================== */}

            <div className="mt-7 rounded-2xl border border-[#D5AE48]/10 bg-[#D5AE48]/5 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D5AE48]/10 text-[#D5AE48]">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <p className="text-xs font-bold text-[#E0BE61]">
                    How it works
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#B8C7D8]">
                    Select your department first, then enter
                    the Student ID. The selected department
                    must match the department code in the
                    Student ID.
                  </p>

                </div>

              </div>
            </div>
          </div>

          {/* ======================================================
              DEPARTMENT EXAMPLES
          ====================================================== */}

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="mb-3 text-center text-xs font-semibold text-[#B8C7D8]">
              Student ID Examples
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

              <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
                <p className="text-[10px] text-[#B8C7D8]">
                  Software Engineering
                </p>

                
              </div>

              <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
                <p className="text-[10px] text-[#B8C7D8]">
                  Computer Science
                </p>

                <p className="mt-1 text-xs font-bold text-[#E0BE61]">
                  MAU/CS/0021/17
                </p>
              </div>

              <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
                <p className="text-[10px] text-[#B8C7D8]">
                  Information Technology
                </p>

                <p className="mt-1 text-xs font-bold text-[#E0BE61]">
                  MAU/IT/0030/17
                </p>
              </div>

              <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
                <p className="text-[10px] text-[#B8C7D8]">
                  Information Systems
                </p>

                <p className="mt-1 text-xs font-bold text-[#E0BE61]">
                  MAU/IS/0040/17
                </p>
              </div>

              <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center sm:col-span-2">
                <p className="text-[10px] text-[#B8C7D8]">
                  Electrical Engineering
                </p>

                <p className="mt-1 text-xs font-bold text-[#E0BE61]">
                  MAU/EE/0050/17
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}