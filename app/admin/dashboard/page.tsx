import { getSupabaseServerClient } from "@/lib/supabase/server";
import { 
  FileText, 
  Calendar, 
  User, 
  MessageSquare 
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Definisikan tipe data sesuai tabel di database abang
type SurveyData = {
  id: string; // atau number, sesuaikan
  nama: string;
  email: string; // Opsional
  layanan: string; // Misal: Kartu Kuning, HI, dll
  kritik_saran: string; // <--- INI YANG DIMINTA
  created_at: string;
};

export async function DashboardContent() {
  const supabase = await getSupabaseServerClient();

  // 1. Ambil data dari tabel (Ganti 'surveys' dengan nama tabel asli di database abang)
  const { data: surveys, error } = await supabase
    .from("surveys") 
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  // 2. Hitung total data sederhana untuk statistik kecil
  const totalSurvey = surveys?.length || 0;
  const withFeedback = surveys?.filter(s => s.kritik_saran && s.kritik_saran.length > 2).length || 0;

  return (
    <div className="space-y-6">
      {/* --- Bagian Statistik Ringkas --- */}
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

      {/* --- Bagian Tabel Data --- */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Data Masukan Terbaru</h2>
          <p className="text-sm text-muted-foreground">Daftar semua input survey kepuasan masyarakat.</p>
        </div>
        
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tanggal</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nama Responden</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Layanan</th>
                {/* Header Kritik Saran */}
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[40%]">Kritik & Saran</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {surveys && surveys.length > 0 ? (
                surveys.map((item: SurveyData) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    {/* Kolom Tanggal */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {format(new Date(item.created_at), "dd MMM yyyy", { locale: id })}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground pl-5">
                        {format(new Date(item.created_at), "HH:mm", { locale: id })} WIB
                      </span>
                    </td>

                    {/* Kolom Nama */}
                    <td className="p-4 align-middle font-medium">
                      {item.nama}
                    </td>

                    {/* Kolom Layanan */}
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary shadow hover:bg-primary/20">
                        {item.layanan}
                      </span>
                    </td>

                    {/* Kolom Kritik Saran (INI YANG PENTING) */}
                    <td className="p-4 align-middle">
                      {item.kritik_saran ? (
                        <div className="max-w-[400px]">
                          {/* line-clamp-2 bikin text dipotong jadi 2 baris kalau kepanjangan */}
                          <p className="line-clamp-2 text-sm italic text-muted-foreground" title={item.kritik_saran}>
                            "{item.kritik_saran}"
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground h-24">
                    Belum ada data survey yang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}