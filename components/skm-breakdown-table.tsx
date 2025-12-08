"use client"

import { type Survey, PERTANYAAN_SKM, JENIS_PELAYANAN, IKM_CONFIG } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface SKMBreakdownTableProps {
  surveys: Survey[]
}

function getKategori(nilai: number) {
  for (const kat of IKM_CONFIG.KATEGORI) {
    if (nilai >= kat.min && nilai <= kat.max) {
      return { mutu: kat.mutu, kinerja: kat.kinerja, color: kat.color }
    }
  }
  return { mutu: "D", kinerja: "Tidak Baik", color: "#ef4444" }
}

function getPelayananLabel(value: string) {
  const found = JENIS_PELAYANAN.find((p) => p.value === value)
  return found ? found.label : value
}

export function SKMBreakdownTable({ surveys }: SKMBreakdownTableProps) {
  // Group surveys by jenis_pelayanan
  const surveysByPelayanan: Record<string, Survey[]> = {}

  surveys.forEach((survey) => {
    const key = survey.jenis_kegiatan
    if (!surveysByPelayanan[key]) {
      surveysByPelayanan[key] = []
    }
    surveysByPelayanan[key].push(survey)
  })

  const pelayananKeys = Object.keys(surveysByPelayanan)

  if (pelayananKeys.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Belum ada data survey</div>
  }

  // Calculate stats per pelayanan per unsur
  const calculateUnsurStats = (surveysData: Survey[], unsurKey: string) => {
    const key = unsurKey as keyof Survey
    const total = surveysData.reduce((sum, s) => sum + (Number(s[key]) || 0), 0)
    const jumlahResponden = surveysData.length
    const nilaiIndex = jumlahResponden > 0 ? total / jumlahResponden : 0
    const nilaiIKM = nilaiIndex * IKM_CONFIG.KONVERSI
    const kategori = getKategori(nilaiIKM)

    return {
      jumlahResponden,
      nilaiIndex: nilaiIndex.toFixed(2),
      nilaiIKM: nilaiIKM.toFixed(2),
      kinerja: kategori.kinerja,
      mutu: kategori.mutu,
      color: kategori.color,
    }
  }

  // Calculate total IKM per pelayanan
  const calculateTotalIKM = (surveysData: Survey[]) => {
    if (surveysData.length === 0) return { nilaiIKM: 0, mutu: "-", kinerja: "-", color: "#6b7280" }

    let totalNilaiTertimbang = 0
    PERTANYAAN_SKM.forEach((p) => {
      const stats = calculateUnsurStats(surveysData, p.key)
      totalNilaiTertimbang += Number.parseFloat(stats.nilaiIKM) * IKM_CONFIG.BOBOT_PER_UNSUR
    })

    const kategori = getKategori(totalNilaiTertimbang)
    return {
      nilaiIKM: totalNilaiTertimbang.toFixed(2),
      mutu: kategori.mutu,
      kinerja: kategori.kinerja,
      color: kategori.color,
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-foreground min-w-[200px]">Unsur Pelayanan</TableHead>
            {pelayananKeys.map((key) => (
              <TableHead key={key} className="text-center min-w-[180px]">
                <div className="font-semibold text-foreground text-xs leading-tight">{getPelayananLabel(key)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  ({surveysByPelayanan[key].length} responden)
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERTANYAAN_SKM.map((pertanyaan, idx) => (
            <TableRow key={pertanyaan.key}>
              <TableCell className="font-medium">
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-tight">{pertanyaan.label}</span>
                </div>
              </TableCell>
              {pelayananKeys.map((key) => {
                const stats = calculateUnsurStats(surveysByPelayanan[key], pertanyaan.key)
                return (
                  <TableCell key={key} className="text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        NRR: <span className="font-semibold text-foreground">{stats.nilaiIndex}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        IKM: <span className="font-semibold text-foreground">{stats.nilaiIKM}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                        style={{
                          borderColor: stats.color,
                          color: stats.color,
                          backgroundColor: `${stats.color}15`,
                        }}
                      >
                        {stats.mutu} - {stats.kinerja}
                      </Badge>
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}

          {/* Total Row */}
          <TableRow className="bg-muted/30 font-semibold border-t-2">
            <TableCell className="font-bold text-foreground">TOTAL IKM</TableCell>
            {pelayananKeys.map((key) => {
              const total = calculateTotalIKM(surveysByPelayanan[key])
              return (
                <TableCell key={key} className="text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold" style={{ color: total.color }}>
                      {total.nilaiIKM}
                    </div>
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: total.color,
                        color: "white",
                      }}
                    >
                      {total.mutu} - {total.kinerja}
                    </Badge>
                  </div>
                </TableCell>
              )
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
