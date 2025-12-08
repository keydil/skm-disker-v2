import { getSupabaseAdminClient } from "@/lib/supabase/server"
import type { Survey } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SurveyTable } from "@/components/survey-table"
import { Users, Building2 } from "lucide-react"

function getPelayananStats(surveys: Survey[]) {
  const stats: Record<string, number> = {}

  surveys.forEach((survey) => {
    const key = survey.jenis_kegiatan
    stats[key] = (stats[key] || 0) + 1
  })

  return Object.keys(stats).length
}

export async function PublicDashboardContent() {
  const supabase = await getSupabaseAdminClient()

  const { data: surveys, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Gagal memuat data: {error.message}</p>
      </div>
    )
  }

  const surveyData = (surveys || []) as Survey[]
  const totalPelayanan = getPelayananStats(surveyData)

  return (
    <div className="space-y-6">
      {/* Stats Cards - hanya total responden dan total jenis pelayanan */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responden</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{surveyData.length}</div>
            <p className="text-xs text-muted-foreground">Semua pelayanan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jenis Pelayanan</CardTitle>
            <Building2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPelayanan}</div>
            <p className="text-xs text-muted-foreground">Pelayanan aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Survey Table - tanpa rata-rata */}
      <Card>
        <CardHeader>
          <CardTitle>Data Survey Terbaru</CardTitle>
          <CardDescription>Daftar responden yang telah mengisi survey</CardDescription>
        </CardHeader>
        <CardContent>
          <SurveyTable surveys={surveyData.slice(0, 10)} showAverage={false} />
        </CardContent>
      </Card>
    </div>
  )
}
