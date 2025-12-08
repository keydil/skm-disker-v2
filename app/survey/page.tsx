import { SurveyForm } from "@/components/survey-form";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SurveyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            {/* --- Logo Updated --- */}
            <Image
              src="/disnaker-logo.svg"
              alt="Logo SKM Disnaker"
              width={40}
              height={40}
              className="h-11 w-11 object-contain"
            />
            {/* -------------------- */}

            <span className="font-semibold text-foreground">SKM Disnaker Kota Bandung</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Form Survey Kepuasan Masyarakat
            </h1>
            <p className="mt-2 text-muted-foreground">
              Silakan isi form berikut dengan lengkap dan jujur
            </p>
          </div>

          <SurveyForm />
        </div>
      </main>
    </div>
  );
}
