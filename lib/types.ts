// ============================================
// TYPES & INTERFACES
// ============================================

export interface Survey {
  id: string
  jenis_kegiatan: string
  nama: string
  no_ktp: string
  umur: number
  jenis_kelamin: string
  pendidikan: string
  pekerjaan: string
  u1: number
  u2: number
  u3: number
  u4: number
  u5: number
  u6: number
  u7: number
  u8: number
  u9: number
  kritik_saran?: string
  created_at: string
}

export type SurveyFormData = Omit<Survey, "id" | "created_at">

export interface IKMResult {
  totalResponden: number
  nilaiIKM: number
  mutuPelayanan: string
  kinerjaPelayanan: string
  categoryColor: string
  nilaiPerUnsur: UnsurResult[]
}

export interface UnsurResult {
  unsur: string
  label: string
  nilai: number
  kategori: string
  color: string
}

// ============================================
// CONSTANTS - Semua opsi dropdown di sini
// ============================================

export const JENIS_PELAYANAN = [
  { value: "ak1", label: "Kartu Kuning (AK1)" },
  { value: "penta", label: "Pelatihan Berbasis Wirausaha Baru (PENTA)" },
  { value: "blk", label: "Pelatihan Berbasis Kompetensi (BLK)" },
  { value: "mediasi", label: "Mediasi (HISK)" },
  { value: "konsultasi", label: "Konsultasi Ketenagakerjaan (HISK)" },
  { value: "jkp", label: "Pengajuan JKP Surat Keterangan Jaminan Pekerjaan (JASTEK)" },
  { value: "lainnya", label: "Lainnya" },
] as const

// Alias untuk backward compatibility
export const JENIS_KEGIATAN = JENIS_PELAYANAN

export const JENIS_KELAMIN = [
  { value: "laki-laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
] as const

export const PENDIDIKAN = [
  { value: "sd", label: "SD" },
  { value: "smp", label: "SMP" },
  { value: "sma", label: "SMA/SMK" },
  { value: "d1-d3", label: "D1-D3" },
  { value: "s1", label: "S1" },
  { value: "s2", label: "S2" },
  { value: "s3", label: "S3" },
] as const

export const PEKERJAAN = [
  { value: "pns", label: "PNS/ASN" },
  { value: "tni_polri", label: "TNI/Polri" },
  { value: "karyawan_swasta", label: "Karyawan Swasta" },
  { value: "wiraswasta", label: "Wiraswasta/Pengusaha" },
  { value: "petani", label: "Petani" },
  { value: "nelayan", label: "Nelayan" },
  { value: "buruh", label: "Buruh" },
  { value: "guru_dosen", label: "Guru/Dosen" },
  { value: "dokter", label: "Dokter/Tenaga Medis" },
  { value: "ibu_rumah_tangga", label: "Ibu Rumah Tangga" },
  { value: "mahasiswa", label: "Mahasiswa/Pelajar" },
  { value: "tidak_bekerja", label: "Tidak Bekerja/Pencari Kerja" },
  { value: "pensiunan", label: "Pensiunan" },
  { value: "lainnya", label: "Lainnya" },
] as const

export const PERTANYAAN_SKM = [
  {
    key: "u1",
    label: "Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?",
    opsi: [
      { value: 1, label: "Tidak sesuai", emoji: "😞" },
      { value: 2, label: "Kurang sesuai", emoji: "😐" },
      { value: 3, label: "Sesuai", emoji: "😊" },
      { value: 4, label: "Sangat sesuai", emoji: "😁" },
    ],
  },
  {
    key: "u2",
    label: "Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini?",
    opsi: [
      { value: 1, label: "Tidak mudah", emoji: "😞" },
      { value: 2, label: "Kurang mudah", emoji: "😐" },
      { value: 3, label: "Mudah", emoji: "😊" },
      { value: 4, label: "Sangat mudah", emoji: "😁" },
    ],
  },
  {
    key: "u3",
    label: "Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan?",
    opsi: [
      { value: 1, label: "Tidak cepat", emoji: "😞" },
      { value: 2, label: "Kurang cepat", emoji: "😐" },
      { value: 3, label: "Cepat", emoji: "😊" },
      { value: 4, label: "Sangat cepat", emoji: "😁" },
    ],
  },
  {
    key: "u4",
    label: "Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan?",
    opsi: [
      { value: 1, label: "Sangat mahal", emoji: "😞" },
      { value: 2, label: "Cukup mahal", emoji: "😐" },
      { value: 3, label: "Murah", emoji: "😊" },
      { value: 4, label: "Gratis", emoji: "😁" },
    ],
  },
  {
    key: "u5",
    label:
      "Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?",
    opsi: [
      { value: 1, label: "Tidak sesuai", emoji: "😞" },
      { value: 2, label: "Kurang sesuai", emoji: "😐" },
      { value: 3, label: "Sesuai", emoji: "😊" },
      { value: 4, label: "Sangat sesuai", emoji: "😁" },
    ],
  },
  {
    key: "u6",
    label: "Bagaimana pendapat Saudara tentang kompetensi/kemampuan petugas dalam pelayanan?",
    opsi: [
      { value: 1, label: "Tidak kompeten", emoji: "😞" },
      { value: 2, label: "Kurang kompeten", emoji: "😐" },
      { value: 3, label: "Kompeten", emoji: "😊" },
      { value: 4, label: "Sangat kompeten", emoji: "😁" },
    ],
  },
  {
    key: "u7",
    label: "Bagaimana pendapat Saudara tentang perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?",
    opsi: [
      { value: 1, label: "Tidak sopan dan ramah", emoji: "😞" },
      { value: 2, label: "Kurang sopan dan ramah", emoji: "😐" },
      { value: 3, label: "Sopan dan ramah", emoji: "😊" },
      { value: 4, label: "Sangat sopan dan ramah", emoji: "😁" },
    ],
  },
  {
    key: "u8",
    label: "Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan?",
    opsi: [
      { value: 1, label: "Tidak ada", emoji: "😞" },
      { value: 2, label: "Ada tetapi tidak berfungsi", emoji: "😐" },
      { value: 3, label: "Berfungsi kurang maksimal", emoji: "😊" },
      { value: 4, label: "Dikelola dengan baik", emoji: "😁" },
    ],
  },
  {
    key: "u9",
    label: "Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana?",
    opsi: [
      { value: 1, label: "Buruk", emoji: "😞" },
      { value: 2, label: "Cukup", emoji: "😐" },
      { value: 3, label: "Baik", emoji: "😊" },
      { value: 4, label: "Sangat baik", emoji: "😁" },
    ],
  },
] as const

// ============================================
// IKM CONFIG - Konfigurasi perhitungan IKM
// ============================================

export const IKM_CONFIG = {
  BOBOT_PER_UNSUR: 1 / 9,
  KONVERSI: 25,
  KATEGORI: [
    { min: 88.31, max: 100, mutu: "A", kinerja: "Sangat Baik", color: "#22c55e" },
    { min: 76.61, max: 88.3, mutu: "B", kinerja: "Baik", color: "#3b82f6" },
    { min: 65.01, max: 76.6, mutu: "C", kinerja: "Kurang Baik", color: "#f59e0b" },
    { min: 0, max: 65, mutu: "D", kinerja: "Tidak Baik", color: "#ef4444" },
  ],
} as const