import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LogoutButton } from "@/components/logout-button"; // Pastikan path ini benar
import { 
  FileText, 
  Calendar, 
  User, 
  MessageSquare 
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Definisikan tipe data
type SurveyData = {
  id: string; 
  nama: string;
  email: string;
  layanan: string;
  kritik_saran: string;
  created_at: string;
};

// 👇 INI PENTING: export default biar gak error build
export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();
  
  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Ambil Data Survey
  const { data: surveys, error } = await supabase
    .from("surveys") // Pastikan nama tabel benar
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching surveys:", error);
  }

  // 3. Hitung Statistik
  const totalSurvey = surveys?.length || 0;
  const withFeedback = surveys?.filter(s => s.kritik_saran && s.kritik_saran.length > 2).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* --- BAGIAN HEADER (Jangan Dihapus) --- */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Image
              src="/disnaker-logo.svg"
              alt="Logo SKM Disnaker"
              width={40}
              height={40}
              className="h-11 w-11 object-contain"
            />
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

      {/* --- BAGIAN MAIN CONTENT --- */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Kelola dan analisis data survey kepuasan masyarakat
          </p>
        </div>

        <div className="space-y-6">
          {/* Kartu Statistik */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Total Responden</h3>
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{totalSurvey}</div>
              <p className="text-xs text-muted-foreground">Orang telah mengisi survei</p>
            </div>
            
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Kritik & Saran Masuk</h3>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{withFeedback}</div>
              <p className="text-xs text-muted-foreground">Responden memberikan masukan</p>
            </div>
          </div>

          {/* Tabel Data */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Data Masukan Terbaru</h2>
              <p className="text-sm text-muted-foreground">Daftar semua input survey kepuasan masyarakat.</p>
            </div>
            
            <div className="relative w-full overflow-auto">
              {error ? (
                <div className="p-4 text-red-500">Gagal memuat data: {error.message}</div>
              ) : (
                <table className="w-full caption-bottom text-sm text-left">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tanggal</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nama</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Layanan</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[40%]">Kritik & Saran</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {surveys && surveys.length > 0 ? (
                      surveys.map((item: SurveyData) => (
                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{format(new Date(item.created_at), "dd MMM yyyy", { locale: id })}</span>
                            </div>
                            <span className="text-xs text-muted-foreground pl-5">
                              {format(new Date(item.created_at), "HH:mm", { locale: id })} WIB
                            </span>
                          </td>
                          <td className="p-4 align-middle font-medium">{item.nama}</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                              {item.layanan}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            {item.kritik_saran ? (
                              <p className="line-clamp-2 text-sm italic text-muted-foreground" title={item.kritik_saran}>
                                "{item.kritik_saran}"
                              </p>
                            ) : (
                              <span className="text-muted-foreground/30">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground h-24">
                          Belum ada data survey.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}