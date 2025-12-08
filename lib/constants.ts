// Semua konstanta di satu tempat - gampang diubah tanpa edit banyak file

export const JENIS_KEGIATAN = [
  { value: "pelatihan_wirausaha", label: "Pelatihan Berbasis Wirausaha Baru (PENTA)" },
  { value: "pelatihan_kompetensi", label: "Pelatihan Berbasis Kompetensi (BLK)" },
  { value: "mediasi", label: "Mediasi (HI-SK)" },
  { value: "konsultasi", label: "Konsultasi Ketenagakerjaan (HI-SK)" },
  { value: "pengajuan_jkp", label: "Pengajuan JKP - Surat Keterangan Jaminan Pekerjaan (JASTEK)" },
  { value: "informasi_pasar_kerja", label: "Informasi Pasar Kerja" },
  { value: "lainnya", label: "Lainnya" },
] as const

export const JENIS_KELAMIN = [
  { value: "laki-laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
] as const

export const PENDIDIKAN = [
  { value: "sd", label: "SD/Sederajat" },
  { value: "smp", label: "SMP/Sederajat" },
  { value: "sma", label: "SMA/SMK/Sederajat" },
  { value: "d1", label: "D1" },
  { value: "d2", label: "D2" },
  { value: "d3", label: "D3" },
  { value: "d4", label: "D4" },
  { value: "s1", label: "S1" },
  { value: "s2", label: "S2" },
  { value: "s3", label: "S3" },
] as const

export const PEKERJAAN = [
  { value: "pelajar_mahasiswa", label: "Pelajar/Mahasiswa" },
  { value: "pns", label: "PNS/ASN" },
  { value: "tni_polri", label: "TNI/Polri" },
  { value: "karyawan_swasta", label: "Karyawan Swasta" },
  { value: "karyawan_bumn", label: "Karyawan BUMN/BUMD" },
  { value: "wiraswasta", label: "Wiraswasta/Pengusaha" },
  { value: "petani", label: "Petani" },
  { value: "nelayan", label: "Nelayan" },
  { value: "buruh", label: "Buruh" },
  { value: "freelancer", label: "Freelancer/Pekerja Lepas" },
  { value: "ibu_rumah_tangga", label: "Ibu Rumah Tangga" },
  { value: "pensiunan", label: "Pensiunan" },
  { value: "tidak_bekerja", label: "Tidak Bekerja/Mencari Kerja" },
  { value: "lainnya", label: "Lainnya" },
] as const

export const PERTANYAAN_SKM = [
  { id: "u1", text: "Bagaimana pendapat Saudara tentang kesesuaian Persyaratan pelayanan?" },
  { id: "u2", text: "Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini?" },
  { id: "u3", text: "Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan?" },
  { id: "u4", text: "Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan?" },
  {
    id: "u5",
    text: "Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?",
  },
  { id: "u6", text: "Bagaimana pendapat Saudara tentang kompetensi/kemampuan petugas dalam pelayanan?" },
  {
    id: "u7",
    text: "Bagaimana pendapat Saudara tentang perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?",
  },
  { id: "u8", text: "Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana?" },
  { id: "u9", text: "Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan?" },
] as const

export const JAWABAN_SKM = [
  { value: 1, label: "Tidak Baik" },
  { value: 2, label: "Kurang Baik" },
  { value: 3, label: "Baik" },
  { value: 4, label: "Sangat Baik" },
] as const

// Konstanta untuk perhitungan IKM sesuai PermenPAN-RB No. 14 Tahun 2017
export const IKM_CONFIG = {
  BOBOT_PER_UNSUR: 1 / 9, // 0.111
  KONVERSI: 25,
  KATEGORI: [
    { min: 88.31, max: 100, mutu: "A", kinerja: "Sangat Baik", color: "#22c55e" },
    { min: 76.61, max: 88.3, mutu: "B", kinerja: "Baik", color: "#3b82f6" },
    { min: 65.01, max: 76.6, mutu: "C", kinerja: "Kurang Baik", color: "#f59e0b" },
    { min: 0, max: 65, mutu: "D", kinerja: "Tidak Baik", color: "#ef4444" },
  ],
} as const
