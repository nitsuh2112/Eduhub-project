"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Brain,
  Users,
  Settings,
  LogOut,
  X,
  Building2,
} from "lucide-react";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  role?:
    | "student"
    | "instructor"
    | "admin"
    | "academic-director";
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

/* ============================================================
   SIDEBAR
============================================================ */

export default function Sidebar({
  open = false,
  onClose = () => {},
  role = "student",
}: SidebarProps) {
  const pathname = usePathname();

  /* ============================================================
     STUDENT MENU
  ============================================================ */

  const studentMenu: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/student/dashboard",
    },
    {
      label: "My Courses",
      icon: BookOpen,
      href: "/student/courses",
    },
    {
      label: "Browse Courses",
      icon: GraduationCap,
      href: "/student/browse-courses",
    },
    {
      label: "Materials",
      icon: FileText,
      href: "/student/materials",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      href: "/student/assignments",
    },
    {
      label: "Quizzes",
      icon: HelpCircle,
      href: "/student/quizzes",
    },
    {
      label: "Grades",
      icon: BarChart3,
      href: "/student/grades",
    },
    {
      label: "AI Recommendations",
      icon: Brain,
      href: "/student/ai-recommendations",
    },
  ];

  /* ============================================================
     INSTRUCTOR MENU
  ============================================================ */

  const instructorMenu: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/instructor/dashboard",
    },
    {
      label: "My Courses",
      icon: BookOpen,
      href: "/instructor/mycourse",
    },
    {
      label: "Materials",
      icon: FileText,
      href: "/instructor/materials",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      href: "/instructor/assignments",
    },
    {
      label: "Students",
      icon: Users,
      href: "/instructor/students",
    },
    {
      label: "Grades",
      icon: BarChart3,
      href: "/instructor/grades",
    },
    {
      label: "AI Analytics",
      icon: Brain,
      href: "/ai-analytics",
    },
  ];

  /* ============================================================
     ADMIN MENU
  ============================================================ */

  const adminMenu: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      label: "Enrollments",
      icon: GraduationCap,
      href: "/admin/enrollments",
    },
    {
      label: "Academic Records",
      icon: FileText,
      href: "/admin/records",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/admin/reports",
    },
    {
      label: "AI Analytics",
      icon: Brain,
      href: "/ai-analytics",
    },
    {
      label: "System Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  /* ============================================================
     ACADEMIC DIRECTOR MENU
  ============================================================ */

  const academicDirectorMenu: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/academic-director/dashboard",
    },
    {
      label: "Students",
      icon: Users,
      href: "/academic-director/students",
    },
    {
      label: "Departments",
      icon: Building2,
      href: "/academic-director/departments",
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/academic-director/courses",
    },
    {
      label: "Academic Records",
      icon: GraduationCap,
      href: "/academic-director/records",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/academic-director/reports",
    },
    {
      label: "AI Analytics",
      icon: Brain,
      href: "/ai-analytics",
    },
  ];

  /* ============================================================
     SELECT MENU BASED ON ROLE
  ============================================================ */

  const menu =
    role === "academic-director"
      ? academicDirectorMenu
      : role === "instructor"
        ? instructorMenu
        : role === "admin"
          ? adminMenu
          : studentMenu;

  /* ============================================================
     ROLE LABEL
  ============================================================ */

  const roleLabel =
    role === "academic-director"
      ? "Academic Director"
      : role === "instructor"
        ? "Instructor"
        : role === "admin"
          ? "Administrator"
          : "Student";

  /* ============================================================
     RETURN
  ============================================================ */

  return (
    <>
      {/* ========================================================
          MOBILE OVERLAY
      ======================================================== */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          bg-[#0E2A47]
          text-white
          shadow-xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ======================================================
            LOGO
        ====================================================== */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-wide">
              EduHub
            </h1>

            <p className="text-xs text-slate-300">
              Learning Management System
            </p>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* ======================================================
            USER PROFILE
        ====================================================== */}

        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D5AE48] font-bold text-[#0E2A47]">
              NT
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">
                Nitsuh Tigu
              </p>

              <p className="text-xs text-slate-300">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            NAVIGATION
        ====================================================== */}

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href + "/"));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-[#D5AE48] text-[#0E2A47]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon size={19} />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ======================================================
            LOGOUT
        ====================================================== */}

        <div className="border-t border-white/10 p-4">
          <Link
            href="/login"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
