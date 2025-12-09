import { Suspense } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { DashboardContent } from "@/components/dashboard-content";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Bagian Logo */}
            <Image
              src="/disnaker-logo.svg"
              alt="Logo SKM Disnaker"
              width={40}
              height={40}
              className="h-11 w-11 object-contain"
            />

            {/* Bagian Teks */}
            <div>
              <span className="font-semibold text-foreground">SKM Admin</span>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Kelola dan analisis data survey kepuasan masyarakat
          </p>
        </div>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
