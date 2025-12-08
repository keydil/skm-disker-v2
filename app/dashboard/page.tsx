import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardContent } from "@/components/dashboard-content";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            {/* --- Bagian Logo Diupdate --- */}
            <Image
              src="/disnaker-logo.svg"
              alt="Logo SKM Disnaker"
              width={40}
              height={40}
              className="h-11 w-11 object-contain"
            />
            {/* ---------------------------- */}

            <span className="font-semibold text-foreground">SKM Disnaker Kota Bandung</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
