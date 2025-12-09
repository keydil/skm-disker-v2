"use client"

import { type Survey, JENIS_KEGIATAN } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"

interface SurveyTableProps {
  surveys: Survey[]
}

function getKegiatanLabel(value: string) {
  const kegiatan = JENIS_KEGIATAN.find((k) => k.value === value)
  return kegiatan?.label || value
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function calculateAverage(survey: Survey) {
  const total =
    survey.u1 + survey.u2 + survey.u3 + survey.u4 + survey.u5 + survey.u6 + survey.u7 + survey.u8 + survey.u9
  return (total / 9).toFixed(2)
}

export function SurveyTable({ surveys }: SurveyTableProps) {
  if (surveys.length === 0) {
    return <div className="flex h-32 items-center justify-center text-muted-foreground">Belum ada data survey</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jenis Kegiatan</TableHead>
            {/* <TableHead className="text-center">Rata-rata</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey) => {
            const avg = Number.parseFloat(calculateAverage(survey))
            return (
              <TableRow key={survey.id}>
                <TableCell className="text-muted-foreground">{formatDate(survey.created_at)}</TableCell>
                <TableCell className="font-medium">{survey.nama}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {survey.jenis_kegiatan === "lainnya"
                      ? survey.jenis_kegiatan_lainnya
                      : getKegiatanLabel(survey.jenis_kegiatan)}
                  </span>
                </TableCell>
                {/* <TableCell className="text-center">
                  <Badge
                    variant={avg >= 3.5 ? "default" : avg >= 3 ? "secondary" : "destructive"}
                    className={avg >= 3.5 ? "bg-success hover:bg-success/90" : ""}
                  >
                    {avg}
                  </Badge>
                </TableCell> */}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
