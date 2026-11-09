
"use client";

import {
  Bell,
  Search,
  User,
} from "lucide-react";

interface TopbarProps {
  title?: string;
  description?: string;
}

export default function Topbar({
  title,
  description,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="min-w-0">
          {title && (
            <h1 className="truncate text-lg font-bold text-[#07192B] sm:text-xl">
              {title}
            </h1>
          )}

          {description && (
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {description}
            </p>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SEARCH */}
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0E2A47] sm:flex"
          >
            <Search size={19} />
          </button>

          {/* NOTIFICATION */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0E2A47]"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D5AE48]" />
          </button>

          {/* PROFILE */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E2A47] text-white">
              <User size={17} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-[#07192B]">
                Academic Director
              </p>

              <p className="text-[11px] text-slate-500">
                EduHub
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
