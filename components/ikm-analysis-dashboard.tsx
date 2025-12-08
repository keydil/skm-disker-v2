"use client"

import { useState, useMemo } from "react"
import { type Survey, JENIS_PELAYANAN, PERTANYAAN_SKM, IKM_CONFIG } from "@/lib/types"
import { exportToExcel } from "@/lib/export-excel"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Award, Search, Download, Loader2 } from "lucide-react"

interface Props {
  surveys: Survey[]
}

function getKategori(nilai: number) {
  for (const kat of IKM_CONFIG.KATEGORI) {
    if (nilai >= kat.min && nilai <= kat.max) {
      return kat
    }
  }
  return IKM_CONFIG.KATEGORI[IKM_CONFIG.KATEGORI.length - 1]
}

function calculateDetailedIKM(surveys: Survey[]) {
  if (surveys.length === 0) {
    return {
      totalResponden: 0,
      nilaiIKM: 0,
      kinerja: "-",
      mutu: "-",
      color: "#6b7280",
      unsurDetails: PERTANYAAN_SKM.map((p, i) => ({
        no: i + 1,
        unsur: p.shortLabel,
        jumlahResponden: 0,
        totalNilai: 0,
        nilaiIndex: 0,
        nilaiIKM: 0,
        kinerja: "-",
        color: "#6b7280",
      })),
    }
  }

  const unsurDetails = PERTANYAAN_SKM.map((p, i) => {
    const key = `u${i + 1}` as keyof Survey
    let totalNilai = 0

    surveys.forEach((s) => {
      totalNilai += Number(s[key]) || 0
    })

    const nilaiIndex = totalNilai / surveys.length
    const nilaiIKM = nilaiIndex * 25
    const kat = getKategori(nilaiIKM)

    return {
      no: i + 1,
      unsur: p.shortLabel,
      jumlahResponden: surveys.length,
      totalNilai,
      nilaiIndex: Number(nilaiIndex.toFixed(2)),
      nilaiIKM: Number(nilaiIKM.toFixed(2)),
      kinerja: kat.kinerja,
      color: kat.color,
    }
  })

  // Calculate overall IKM
  const totalNRR = unsurDetails.reduce((acc, u) => acc + u.nilaiIndex, 0)
  const avgNRR = totalNRR / 9
  const nilaiIKM = avgNRR * 25
  const kat = getKategori(nilaiIKM)

  return {
    totalResponden: surveys.length,
    nilaiIKM: Number(nilaiIKM.toFixed(2)),
    kinerja: kat.kinerja,
    mutu: kat.mutu,
    color: kat.color,
    unsurDetails,
  }
}

export function IKMAnalysisDashboard({ surveys }: Props) {
  const [selectedPelayanan, setSelectedPelayanan] = useState<string>("semua")
  const [isExporting, setIsExporting] = useState(false)

  // Get unique pelayanan from data
  const availablePelayanan = useMemo(() => {
    const unique = new Set<string>()
    surveys.forEach((s) => unique.add(s.jenis_kegiatan))
    return Array.from(unique)
  }, [surveys])

  // Filter surveys based on selection
  const filteredSurveys = useMemo(() => {
    if (selectedPelayanan === "semua") return surveys
    return surveys.filter((s) => s.jenis_kegiatan === selectedPelayanan)
  }, [surveys, selectedPelayanan])

  const analysis = useMemo(() => calculateDetailedIKM(filteredSurveys), [filteredSurveys])

  // Get label for selected pelayanan
  const getLabel = (value: string) => {
    if (value === "semua") return "Semua Pelayanan"
    const found = JENIS_PELAYANAN.find((p) => p.value === value)
    return found ? found.label : value
  }

  const handleExport = async () => {
    if (filteredSurveys.length === 0) {
      alert("Tidak ada data untuk di-export")
      return
    }

    setIsExporting(true)
    try {
      await exportToExcel(filteredSurveys, selectedPelayanan)
    } catch (error) {
      console.error("Export error:", error)
      alert("Gagal mengexport data")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Filter Data</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Pilih jenis pelayanan untuk melihat analisis spesifik</p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Jenis Pelayanan:</span>
              <Select value={selectedPelayanan} onValueChange={setSelectedPelayanan}>
                <SelectTrigger className="w-[350px] bg-background">
                  <SelectValue placeholder="Pilih Jenis Pelayanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  {availablePelayanan.map((value) => {
                    const label = JENIS_PELAYANAN.find((p) => p.value === value)?.label || value
                    return (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting || filteredSurveys.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengexport...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* Total Responden */}
        <Card className="border-0 shadow-md bg-background">
          <CardContent className="p-3 md:pt-6 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div className="order-2 md:order-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Responden</p>
                <p className="text-2xl md:text-4xl font-bold text-foreground mt-1 md:mt-2">{analysis.totalResponden}</p>
                <p className="text-xs md:text-sm text-primary mt-1 md:mt-2 truncate">{getLabel(selectedPelayanan)}</p>
              </div>
              <div className="order-1 md:order-2 h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nilai IKM */}
        <Card className="border-0 shadow-md bg-background">
          <CardContent className="p-3 md:pt-6 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div className="order-2 md:order-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Nilai IKM</p>
                <p className="text-2xl md:text-4xl font-bold text-foreground mt-1 md:mt-2">{analysis.nilaiIKM}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Dari skala 100</p>
              </div>
              <div className="order-1 md:order-2 h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kinerja Unit */}
        <Card className="border-0 shadow-md bg-background">
          <CardContent className="p-3 md:pt-6 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div className="order-2 md:order-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Kinerja Unit</p>
                <p className="text-xl md:text-3xl font-bold mt-1 md:mt-2" style={{ color: analysis.color }}>
                  {analysis.kinerja}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Penilaian keseluruhan</p>
              </div>
              <div className="order-1 md:order-2 h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="h-4 w-4 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Table */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
          <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
            <span className="text-xl">📊</span>
            Hasil Analisis IKM - {getLabel(selectedPelayanan)}
          </h3>
          <p className="text-sm text-primary-foreground/80 mt-1">Indeks Kepuasan Masyarakat per unsur pelayanan</p>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-16 text-center font-semibold">No</TableHead>
                  <TableHead className="min-w-[300px] font-semibold">Unsur Pelayanan</TableHead>
                  <TableHead className="text-center font-semibold">Jumlah Responden</TableHead>
                  <TableHead className="text-center font-semibold">Total Nilai</TableHead>
                  <TableHead className="text-center font-semibold">Nilai Index</TableHead>
                  <TableHead className="text-center font-semibold">Nilai IKM</TableHead>
                  <TableHead className="text-center font-semibold">Kinerja Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.unsurDetails.map((row) => (
                  <TableRow key={row.no} className="hover:bg-muted/30">
                    <TableCell className="text-center font-medium">{row.no}</TableCell>
                    <TableCell className="text-sm">{row.unsur}</TableCell>
                    <TableCell className="text-center">{row.jumlahResponden}</TableCell>
                    <TableCell className="text-center">{row.totalNilai}</TableCell>
                    <TableCell className="text-center font-medium">{row.nilaiIndex}</TableCell>
                    <TableCell className="text-center font-medium">{row.nilaiIKM}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="font-medium"
                        style={{
                          backgroundColor: `${row.color}15`,
                          borderColor: row.color,
                          color: row.color,
                        }}
                      >
                        {row.kinerja}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="bg-muted/70 font-semibold hover:bg-muted/70">
                  <TableCell className="text-center" colSpan={2}>
                    Total / Rata-rata
                  </TableCell>
                  <TableCell className="text-center">{analysis.totalResponden}</TableCell>
                  <TableCell className="text-center">
                    {analysis.unsurDetails.reduce((acc, u) => acc + u.totalNilai, 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {(analysis.unsurDetails.reduce((acc, u) => acc + u.nilaiIndex, 0) / 9).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">{analysis.nilaiIKM}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className="font-semibold"
                      style={{
                        backgroundColor: analysis.color,
                        color: "white",
                      }}
                    >
                      {analysis.kinerja}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
