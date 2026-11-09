
"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type DashboardRole =
  | "student"
  | "instructor"
  | "admin"
  | "academic-director";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  role?: DashboardRole;
}

export default function DashboardLayout({
  children,
  title,
  description,
  role = "student",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Sidebar role={role} />

      <div className="min-h-screen lg:ml-72">
        <Topbar
          title={title}
          description={description}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
