// ==========================================
// EXCEL EXPORT UTILITY
// ==========================================

import type { Survey } from "@/lib/types"
import { JENIS_PELAYANAN, PENDIDIKAN, PEKERJAAN } from "@/lib/types"
import ExcelJS from "exceljs"

// Helper untuk get label dari value
function getPelayananLabel(value: string) {
  const found = JENIS_PELAYANAN.find((p) => p.value === value)
  return found ? found.label : value
}

function getPendidikanLabel(value: string) {
  const found = PENDIDIKAN.find((p) => p.value === value)
  return found ? found.label : value
}

function getPekerjaanLabel(value: string) {
  const found = PEKERJAAN.find((p) => p.value === value)
  return found ? found.label : value
}

export const exportToExcel = async (surveys: Survey[], jenisPelayanan: string) => {
  if (surveys.length === 0) {
    throw new Error("Tidak ada data untuk di-export")
  }

  // 1. Buat Workbook Baru
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Data Survey")

  // --- DEFINISI WARNA (ARGB Format) ---
  const BG_COLOR_HEX = "FFD9E1F2" // Biru Muda
  const BORDER_COLOR_HEX = "FFD4D4D4" // Abu Gridline

  // 2. Setup Kolom & Lebarnya
  worksheet.columns = [
    { header: "No", key: "no", width: 5 },
    { header: "Nama", key: "nama", width: 30 },
    { header: "NIK", key: "nik", width: 20 },
    { header: "Jenis Kelamin", key: "jenisKelamin", width: 15 },
    { header: "Umur", key: "umur", width: 8 },
    { header: "Pendidikan", key: "pendidikan", width: 15 },
    { header: "Pekerjaan", key: "pekerjaan", width: 25 },
    { header: "Jenis Pelayanan", key: "jenisPelayanan", width: 45 },
    { header: "Kritik dan Saran", key: "kritikSaran", width: 40 },
    { header: "Tanggal", key: "tanggal", width: 20 },
    { header: "Unsur 1", key: "u1", width: 12 },
    { header: "Unsur 2", key: "u2", width: 12 },
    { header: "Unsur 3", key: "u3", width: 12 },
    { header: "Unsur 4", key: "u4", width: 12 },
    { header: "Unsur 5", key: "u5", width: 12 },
    { header: "Unsur 6", key: "u6", width: 12 },
    { header: "Unsur 7", key: "u7", width: 12 },
    { header: "Unsur 8", key: "u8", width: 12 },
    { header: "Unsur 9", key: "u9", width: 12 },
  ]

  // 3. Masukkan Data Rows
  surveys.forEach((survey, index) => {
    const date = new Date(survey.created_at)
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    worksheet.addRow({
      no: index + 1,
      nama: survey.nama,
      nik: survey.no_ktp,
      jenisKelamin: survey.jenis_kelamin === "laki-laki" ? "Laki-laki" : "Perempuan",
      umur: survey.umur,
      pendidikan: getPendidikanLabel(survey.pendidikan),
      pekerjaan: getPekerjaanLabel(survey.pekerjaan),
      jenisPelayanan: getPelayananLabel(survey.jenis_kegiatan),
      kritikSaran: survey.kritik_saran || "-",
      tanggal: formattedDate,
      u1: survey.u1,
      u2: survey.u2,
      u3: survey.u3,
      u4: survey.u4,
      u5: survey.u5,
      u6: survey.u6,
      u7: survey.u7,
      u8: survey.u8,
      u9: survey.u9,
    })
  })

  // 4. Styling Loop
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      // Default Style
      cell.font = { name: "Calibri", size: 11 }
      cell.border = {
        top: { style: "thin", color: { argb: BORDER_COLOR_HEX } },
        left: { style: "thin", color: { argb: BORDER_COLOR_HEX } },
        bottom: { style: "thin", color: { argb: BORDER_COLOR_HEX } },
        right: { style: "thin", color: { argb: BORDER_COLOR_HEX } },
      }
      cell.alignment = { vertical: "middle", wrapText: false }

      // Style Header (Baris 1)
      if (rowNumber === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: BG_COLOR_HEX },
        }
        cell.font = { name: "Calibri", size: 11, bold: true }
        cell.alignment = { horizontal: "center", vertical: "middle" }
      }

      // Style Kolom No (Kiri)
      if (colNumber === 1 && rowNumber > 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: BG_COLOR_HEX },
        }
        cell.font = { name: "Calibri", size: 11, bold: true }
        cell.alignment = { horizontal: "center", vertical: "middle" }
      }

      // Center alignment untuk Umur, Tanggal, dan Unsur 1-9
      if (rowNumber > 1 && (colNumber === 5 || colNumber >= 10)) {
        cell.alignment = { horizontal: "center", vertical: "middle" }
      }

      // NIK Text Format
      if (colNumber === 3) {
        cell.numFmt = "@"
      }
    })
  })

  // 5. Generate & Download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url

  const pelayananLabel = jenisPelayanan === "semua" ? "Semua_Pelayanan" : getPelayananLabel(jenisPelayanan)
  const fileName = `Survey_SKM_${pelayananLabel.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`

  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
