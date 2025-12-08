-- Migration: Remove jenis_kegiatan_lainnya column
-- Semua data sekarang disimpan di jenis_kegiatan saja

-- Rename column jenis_kegiatan to jenis_pelayanan for clarity
ALTER TABLE surveys DROP COLUMN IF EXISTS jenis_kegiatan_lainnya;

-- Optional: Rename column to jenis_pelayanan (uncomment if you want to rename)
-- ALTER TABLE surveys RENAME COLUMN jenis_kegiatan TO jenis_pelayanan;
