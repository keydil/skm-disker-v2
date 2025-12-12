// import Link from "next/link";
// import { ClipboardList, BarChart3 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Image from "next/image";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex items-center gap-3">
//             {/* --- Bagian Logo Diubah di Sini --- */}
//             <Image
//               src="/disnaker-logo.svg"
//               alt="Logo SKM Disnaker"
//               width={40}
//               height={40}
//               className="h-10 w-10 object-contain"
//             />
//             {/* ---------------------------------- */}

//             <div>
//               <h1 className="text-xl font-semibold text-foreground">
//                 SKM Disnaker Kota Bandung
//               </h1>
//               {/* <p className="text-sm text-muted-foreground">Survey Kepuasan Masyarakat</p> */}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <main className="container mx-auto px-4 py-16">
//         <div className="mx-auto max-w-3xl text-center">
//           <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
//             Survey Kepuasan Masyarakat
//           </h2>
//           <p className="mt-4 text-pretty text-lg text-muted-foreground">
//             Bantu kami meningkatkan kualitas pelayanan dengan mengisi survey
//             kepuasan masyarakat. Pendapat Anda sangat berharga untuk perbaikan
//             layanan kami.
//           </p>
//         </div>

//         {/* Cards */}
//         <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
//           <Card className="group relative overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-lg">
//             <CardHeader>
//               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
//                 <ClipboardList className="h-6 w-6 text-primary" />
//               </div>
//               <CardTitle className="mt-4 text-xl">Isi Survey</CardTitle>
//               <CardDescription>
//                 Berikan penilaian dan masukan Anda terhadap pelayanan yang telah
//                 diterima
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button asChild className="w-full">
//                 <Link href="/survey">Mulai Survey</Link>
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="group relative overflow-hidden border-border transition-all hover:border-accent/50 hover:shadow-lg">
//             <CardHeader>
//               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
//                 <BarChart3 className="h-6 w-6 text-accent" />
//               </div>
//               <CardTitle className="mt-4 text-xl">Dashboard Admin</CardTitle>
//               <CardDescription>
//                 Lihat hasil survey dan analisis data kepuasan masyarakat
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button
//                 asChild
//                 variant="outline"
//                 className="w-full bg-transparent"
//               >
//                 <Link href="/dashboard">Buka Dashboard</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Info Section */}
//         <div className="mx-auto mt-16 max-w-2xl">
//           <div className="rounded-xl border border-border bg-card p-6">
//             <h3 className="font-semibold text-foreground">Tentang SKM</h3>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Survey Kepuasan Masyarakat (SKM) adalah kegiatan pengukuran secara
//               komprehensif tentang tingkat kepuasan masyarakat terhadap kualitas
//               layanan yang diberikan oleh penyelenggara pelayanan publik. Survey
//               ini mengacu pada Peraturan Menteri PANRB No. 14 Tahun 2017.
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-border bg-card py-6">
//         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
//           Survey Kepuasan Masyarakat - Pelayanan Publik
//         </div>
//       </footer>
//     </div>
//   );
// }

import Link from "next/link";
import { ClipboardList, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* --- Bagian Logo --- */}
              <Image
                src="/disnaker-logo.svg"
                alt="Logo SKM Disnaker"
                width={40}
                height={40}
                className="h-11 w-11 object-contain"
              />
              {/* ------------------- */}

              <div>
                <h1 className="text-xl font-semibold text-foreground">SKM Disnaker Kota bandung</h1>
                <p className="text-sm text-muted-foreground">
                  Survey Kepuasan Masyarakat
                </p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Login Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Survey Kepuasan Masyarakat
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Bantu kami meningkatkan kualitas pelayanan dengan mengisi survey
            kepuasan masyarakat. Pendapat Anda sangat berharga untuk perbaikan
            layanan kami.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          <Card className="group relative overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-lg">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4 text-xl">Isi Survey</CardTitle>
              <CardDescription>
                Berikan penilaian dan masukan Anda terhadap pelayanan yang telah
                diterima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/survey">Mulai Survey</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border transition-all hover:border-accent/50 hover:shadow-lg">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="mt-4 text-xl">Lihat Hasil Survey</CardTitle>
              <CardDescription>
                Lihat data responden dan hasil survey kepuasan masyarakat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/dashboard">Lihat Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Tentang SKM</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Survey Kepuasan Masyarakat (SKM) adalah kegiatan pengukuran secara
              komprehensif tentang tingkat kepuasan masyarakat terhadap kualitas
              layanan yang diberikan oleh penyelenggara pelayanan publik. Survey
              ini mengacu pada Peraturan Menteri PANRB No. 14 Tahun 2017.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Survey Kepuasan Masyarakat - Disnaker KOta Bandung
        </div>
      </footer>
    </div>
  );
}
