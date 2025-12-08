import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { type Survey, PERTANYAAN_SKM, JENIS_PELAYANAN } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { IkmChart } from "@/components/ikm-chart"
// import { KegiatanChart } from "@/components/kegiatan-chart"
import { SurveyTable } from "@/components/survey-table"
import { IKMAnalysisDashboard } from "@/components/ikm-analysis-dashboard"

function calculateIKM(surveys: Survey[]) {
  if (surveys.length === 0) return { ikm: 0, kategori: "-", bobot: Array(9).fill(0) }

  const totalPerUnsur = Array(9).fill(0)

  surveys.forEach((survey) => {
    totalPerUnsur[0] += survey.u1
    totalPerUnsur[1] += survey.u2
    totalPerUnsur[2] += survey.u3
    totalPerUnsur[3] += survey.u4
    totalPerUnsur[4] += survey.u5
    totalPerUnsur[5] += survey.u6
    totalPerUnsur[6] += survey.u7
    totalPerUnsur[7] += survey.u8
    totalPerUnsur[8] += survey.u9
  })

  const rataRataPerUnsur = totalPerUnsur.map((total) => total / surveys.length)
  const bobot = 1 / 9
  const nrrTertimbang = rataRataPerUnsur.reduce((acc, rata) => acc + rata * bobot, 0)
  const ikm = nrrTertimbang * 25

  let kategori = "-"
  if (ikm >= 88.31) kategori = "A (Sangat Baik)"
  else if (ikm >= 76.61) kategori = "B (Baik)"
  else if (ikm >= 65.0) kategori = "C (Kurang Baik)"
  else if (ikm > 0) kategori = "D (Tidak Baik)"

  return { ikm, kategori, bobot: rataRataPerUnsur }
}

function getPelayananStats(surveys: Survey[]) {
  const stats: Record<string, number> = {}

  surveys.forEach((survey) => {
    const key = survey.jenis_kegiatan
    const knownPelayanan = JENIS_PELAYANAN.find((p) => p.value === key)

    if (knownPelayanan) {
      stats[key] = (stats[key] || 0) + 1
    } else {
      stats[key] = (stats[key] || 0) + 1
    }
  })

  const result = JENIS_PELAYANAN.filter((p) => p.value !== "lainnya")
    .map((k) => ({
      name: k.label.length > 20 ? k.label.substring(0, 20) + "..." : k.label,
      fullName: k.label,
      value: k.value,
      count: stats[k.value] || 0,
    }))
    .filter((item) => item.count > 0)

  Object.keys(stats).forEach((key) => {
    const isKnown = JENIS_PELAYANAN.some((p) => p.value === key)
    if (!isKnown) {
      result.push({
        name: key.length > 20 ? key.substring(0, 20) + "..." : key,
        fullName: key,
        value: key,
        count: stats[key],
      })
    }
  })

  return result
}

export async function DashboardContent() {
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
  const { bobot } = calculateIKM(surveyData)
  const pelayananStats = getPelayananStats(surveyData)

  const unsurData = PERTANYAAN_SKM.map((p, i) => ({
    unsur: `U${i + 1}`,
    label: p.label,
    nilai: bobot[i] || 0,
  }))

  return (
    <div className="space-y-6">
      <IKMAnalysisDashboard surveys={surveyData} />

      {/* Charts */}
      {/* <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nilai Per Unsur Pelayanan</CardTitle>
            <CardDescription>Rata-rata nilai untuk setiap unsur SKM</CardDescription>
          </CardHeader>
          <CardContent>
            <IkmChart data={unsurData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Jenis Pelayanan</CardTitle>
            <CardDescription>Jumlah responden per jenis pelayanan</CardDescription>
          </CardHeader>
          <CardContent>
            <KegiatanChart data={pelayananStats} />
          </CardContent>
        </Card>
      </div> */}

      {/* Survey Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Survey Terbaru</CardTitle>
          <CardDescription>Daftar responden yang telah mengisi survey</CardDescription>
        </CardHeader>
        <CardContent>
          <SurveyTable surveys={surveyData.slice(0, 10)} />
        </CardContent>
      </Card>
    </div>
  )
}
