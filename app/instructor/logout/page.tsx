
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("eduhub_token");
    localStorage.removeItem("eduhub_user");

    router.replace("/login");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D5AE48] border-t-transparent" />
        <h1 className="text-xl font-semibold text-[#07192B]">
          Logging out...
        </h1>
        <p className="mt-2 text-gray-500">
          Please wait.
        </p>
      </div>
    </main>
  );
}
