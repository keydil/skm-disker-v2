// ============================================
// VALIDASI - Semua logic validasi di sini
// ============================================

export const VALIDATION_RULES = {
  nama: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Nama hanya boleh huruf dan spasi, minimal 3 karakter",
  },
  ktp: {
    length: 16,
    pattern: /^\d{16}$/,
    message: "No. KTP harus 16 digit angka",
  },
  umur: {
    min: 15,
    max: 100,
    message: "Umur harus antara 15-100 tahun",
  },
} as const

export function validateNama(value: string): { valid: boolean; error?: string } {
  const cleaned = value.replace(/[^a-zA-Z\s]/g, "").trim()
  const hasMinLetters = cleaned.replace(/\s/g, "").length >= 2

  if (cleaned.length < VALIDATION_RULES.nama.minLength || !hasMinLetters) {
    return { valid: false, error: VALIDATION_RULES.nama.message }
  }
  return { valid: true }
}

export function validateKTP(value: string): { valid: boolean; error?: string } {
  if (!VALIDATION_RULES.ktp.pattern.test(value)) {
    return { valid: false, error: VALIDATION_RULES.ktp.message }
  }
  return { valid: true }
}

export function validateUmur(value: number): { valid: boolean; error?: string } {
  if (value < VALIDATION_RULES.umur.min || value > VALIDATION_RULES.umur.max) {
    return { valid: false, error: VALIDATION_RULES.umur.message }
  }
  return { valid: true }
}

// Sanitizers - bersihkan input sebelum disimpan
export function sanitizeNama(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, "")
}

export function sanitizeKTP(value: string): string {
  return value.replace(/\D/g, "").slice(0, 16)
}
