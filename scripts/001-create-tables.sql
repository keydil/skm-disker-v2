-- Create surveys table for storing SKM responses
CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Jenis Kegiatan
  jenis_kegiatan VARCHAR(100) NOT NULL,
  jenis_kegiatan_lainnya VARCHAR(255),
  
  -- Identitas Responden
  nama VARCHAR(255) NOT NULL,
  no_ktp VARCHAR(20) NOT NULL,
  umur INTEGER NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL,
  pendidikan VARCHAR(50) NOT NULL,
  pekerjaan VARCHAR(100) NOT NULL,
  
  -- 9 Pertanyaan SKM (nilai 1-4)
  u1 INTEGER NOT NULL CHECK (u1 >= 1 AND u1 <= 4), -- Kesesuaian Persyaratan
  u2 INTEGER NOT NULL CHECK (u2 >= 1 AND u2 <= 4), -- Kemudahan Prosedur
  u3 INTEGER NOT NULL CHECK (u3 >= 1 AND u3 <= 4), -- Kecepatan Waktu
  u4 INTEGER NOT NULL CHECK (u4 >= 1 AND u4 <= 4), -- Kewajaran Biaya
  u5 INTEGER NOT NULL CHECK (u5 >= 1 AND u5 <= 4), -- Kesesuaian Produk
  u6 INTEGER NOT NULL CHECK (u6 >= 1 AND u6 <= 4), -- Kompetensi Pelaksana
  u7 INTEGER NOT NULL CHECK (u7 >= 1 AND u7 <= 4), -- Perilaku Pelaksana
  u8 INTEGER NOT NULL CHECK (u8 >= 1 AND u8 <= 4), -- Penanganan Pengaduan
  u9 INTEGER NOT NULL CHECK (u9 >= 1 AND u9 <= 4), -- Kualitas Sarana Prasarana
  
  -- Kritik dan Saran
  kritik_saran TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_jenis_kegiatan ON surveys(jenis_kegiatan);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public survey)
CREATE POLICY "Allow public insert" ON surveys
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all data (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON surveys
  FOR SELECT TO authenticated
  USING (true);
