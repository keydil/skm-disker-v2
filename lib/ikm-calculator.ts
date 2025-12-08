// ============================================
// IKM CALCULATOR - Logic perhitungan IKM
// ============================================

import { IKM_CONFIG, PERTANYAAN_SKM, type Survey, type IKMResult } from "./types"

function getKategori(nilai: number) {
  for (const kat of IKM_CONFIG.KATEGORI) {
    if (nilai >= kat.min && nilai <= kat.max) {
      return { mutu: kat.mutu, kinerja: kat.kinerja, color: kat.color }
    }
  }
  return { mutu: "D", kinerja: "Tidak Baik", color: "#ef4444" }
}

export function calculateIKM(surveys: Survey[]): IKMResult {
  const totalResponden = surveys.length

  // Return default jika tidak ada data
  if (totalResponden === 0) {
    return {
      totalResponden: 0,
      nilaiIKM: 0,
      mutuPelayanan: "-",
      kinerjaPelayanan: "-",
      categoryColor: "#6b7280",
      nilaiPerUnsur: PERTANYAAN_SKM.map((p) => ({
        unsur: p.key.toUpperCase(),
        label: p.label,
        nilai: 0,
        kategori: "-",
        color: "#6b7280",
      })),
    }
  }

  // Hitung nilai per unsur
  const nilaiPerUnsur = PERTANYAAN_SKM.map((pertanyaan) => {
    const key = pertanyaan.key as keyof Survey
    const total = surveys.reduce((sum, s) => sum + (Number(s[key]) || 0), 0)
    const rataRata = total / totalResponden
    const nilaiKonversi = rataRata * IKM_CONFIG.KONVERSI
    const kategori = getKategori(nilaiKonversi)

    return {
      unsur: pertanyaan.key.toUpperCase(),
      label: pertanyaan.label,
      nilai: Number(nilaiKonversi.toFixed(2)),
      kategori: kategori.mutu,
      color: kategori.color,
    }
  })

  // Hitung IKM total
  const totalNilaiTertimbang = nilaiPerUnsur.reduce((sum, u) => sum + u.nilai * IKM_CONFIG.BOBOT_PER_UNSUR, 0)
  const nilaiIKM = Number(totalNilaiTertimbang.toFixed(2))
  const kategoriTotal = getKategori(nilaiIKM)

  return {
    totalResponden,
    nilaiIKM,
    mutuPelayanan: kategoriTotal.mutu,
    kinerjaPelayanan: kategoriTotal.kinerja,
    categoryColor: kategoriTotal.color,
    nilaiPerUnsur,
  }
}

export function calculateKegiatanDistribution(surveys: Survey[]) {
  const distribution: Record<string, number> = {}

  surveys.forEach((s) => {
    const key =
      s.jenis_kegiatan === "lainnya" && s.jenis_kegiatan_lainnya
        ? `Lainnya: ${s.jenis_kegiatan_lainnya}`
        : s.jenis_kegiatan
    distribution[key] = (distribution[key] || 0) + 1
  })

  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }))
}
