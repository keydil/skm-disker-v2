# SKM Disnaker Kota Bandung

Sistem Survey Kepuasan Masyarakat (SKM) untuk Dinas Tenaga Kerja Kota Bandung. Aplikasi ini dibangun menggunakan Next.js 15, Supabase, dan TypeScript untuk mengukur tingkat kepuasan masyarakat terhadap pelayanan publik sesuai dengan Peraturan Menteri PANRB No. 14 Tahun 2017.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi Supabase](#-konfigurasi-supabase)
- [Environment Variables](#-environment-variables)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Docker Deployment](#-docker-deployment)
- [Struktur Project](#-struktur-project)
- [Dokumentasi API](#-dokumentasi-api)

---

## ✨ Fitur Utama

### 🎯 Untuk Responden
- **Form Survey Interaktif**: Interface modern dengan emoji rating untuk 9 unsur pelayanan
- **Multi-step Form**: Proses pengisian yang terstruktur (Data Diri → Pertanyaan SKM)
- **Validasi Real-time**: Input validation untuk nama (hanya huruf), NIK (16 digit), dan umur
- **Auto-reset**: Form otomatis reset setelah submit berhasil
- **Responsive Design**: Tampilan optimal di desktop, tablet, dan mobile

### 📊 Dashboard Admin
- **Analisis IKM Komprehensif**: 
  - Perhitungan otomatis sesuai PermenPAN-RB No. 14/2017
  - Kategori mutu pelayanan (A/B/C/D)
  - Breakdown per unsur pelayanan
- **Filter by Jenis Pelayanan**: Analisis spesifik per layanan
- **Export to Excel**: Download data lengkap dengan formatting profesional
- **Real-time Statistics**: Total responden, nilai IKM, dan kinerja unit
- **Data Table**: Tabel responsif dengan pagination

### 🔒 Keamanan
- **Protected Admin Routes**: Middleware authentication
- **Role-based Access Control**: Pemisahan akses public dan admin
- **Secure Session Management**: Supabase Auth dengan cookie-based sessions

---

## 🛠 Tech Stack

| Kategori | Technology |
|----------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Data Visualization** | Recharts |
| **Export** | ExcelJS |
| **Deployment** | Docker, Docker Compose |

---

## 📦 Prasyarat

Pastikan sistem Anda sudah memiliki:

- **Node.js** >= 18.x
- **npm** atau **pnpm** atau **yarn**
- **Docker** & **Docker Compose** (untuk deployment)
- **Akun Supabase** (untuk database dan authentication)

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/keydil/skm-disker-v2.git
cd skm-disnaker
```

### 2. Install Dependencies

```bash
npm install
# atau
pnpm install
# atau
yarn install
```

---

## 🗄️ Konfigurasi Supabase

### Setup Database

1. **Buat Project Baru** di [Supabase Dashboard](https://app.supabase.com)

2. **Buat Tabel `surveys`** melalui SQL Editor:

```sql
-- Tabel surveys untuk menyimpan data responden
CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis_kegiatan varchar NOT NULL,
  jenis_kegiatan_lainnya varchar,
  nama varchar NOT NULL,
  no_ktp varchar(16) NOT NULL,
  umur int4 NOT NULL,
  jenis_kelamin varchar NOT NULL,
  pendidikan varchar NOT NULL,
  pekerjaan varchar NOT NULL,
  u1 int4 NOT NULL CHECK (u1 >= 1 AND u1 <= 4),
  u2 int4 NOT NULL CHECK (u2 >= 1 AND u2 <= 4),
  u3 int4 NOT NULL CHECK (u3 >= 1 AND u3 <= 4),
  u4 int4 NOT NULL CHECK (u4 >= 1 AND u4 <= 4),
  u5 int4 NOT NULL CHECK (u5 >= 1 AND u5 <= 4),
  u6 int4 NOT NULL CHECK (u6 >= 1 AND u6 <= 4),
  u7 int4 NOT NULL CHECK (u7 >= 1 AND u7 <= 4),
  u8 int4 NOT NULL CHECK (u8 >= 1 AND u8 <= 4),
  u9 int4 NOT NOT CHECK (u9 >= 1 AND u9 <= 4),
  kritik_saran text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index untuk performa query
CREATE INDEX idx_surveys_created_at ON public.surveys(created_at DESC);
CREATE INDEX idx_surveys_jenis_kegiatan ON public.surveys(jenis_kegiatan);

-- Enable Row Level Security (RLS)
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Public dapat insert data survey
CREATE POLICY "Allow public insert" ON public.surveys
  FOR INSERT TO public
  WITH CHECK (true);

-- Policy: Hanya authenticated user (admin) yang bisa read
CREATE POLICY "Allow authenticated read" ON public.surveys
  FOR SELECT TO authenticated
  USING (true);

-- Policy: Hanya authenticated user (admin) yang bisa delete
CREATE POLICY "Allow authenticated delete" ON public.surveys
  FOR DELETE TO authenticated
  USING (true);
```

### Setup Authentication

1. **Buat Admin User** melalui Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - Click **Add user** → **Create new user**
   - Email: `admin@disnaker.bandung.go.id` (sesuaikan)
   - Password: buat password yang kuat
   - Auto Confirm User: **ON**

2. **Setup Email Provider** (opsional, untuk production):
   - Go to **Authentication** → **Providers** → **Email**
   - Konfigurasi SMTP settings jika diperlukan

### Ambil Credentials

Di Supabase Dashboard:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → untuk `SUPABASE_SERVICE_ROLE_KEY` (⚠️ RAHASIA!)

---

## 🔐 Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration (opsional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **PENTING**: 
- Jangan commit file `.env.local` ke Git
- `SUPABASE_SERVICE_ROLE_KEY` harus dijaga kerahasiaannya
- Untuk production, gunakan secrets management dari platform hosting

---

## 💻 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

---

## 🐳 Docker Deployment

Project ini sudah dilengkapi dengan `Dockerfile` dan `docker-compose.yml`.

### Build & Run dengan Docker Compose

```bash
# Build image
docker-compose build

# Run container
docker-compose up -d

# Cek logs
docker-compose logs -f

# Stop container
docker-compose down
```

### Environment Variables untuk Docker

Buat file `.env` di root project (untuk Docker Compose):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000
```

### Deploy ke Server Production

1. **Copy project ke server**:
```bash
scp -r skm-disnaker user@server:/path/to/deploy
```

2. **SSH ke server dan jalankan**:
```bash
ssh user@server
cd /path/to/deploy/skm-disnaker
docker-compose up -d
```

3. **Setup Reverse Proxy** (Nginx/Caddy):
```nginx
server {
    listen 80;
    server_name skm.disnaker.bandung.go.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📁 Struktur Project

```
skm-disnaker/
├── app/
│   ├── admin/
│   │   └── dashboard/          # Admin dashboard (protected)
│   ├── auth/
│   │   └── login/              # Login page
│   ├── dashboard/              # Public dashboard
│   ├── survey/                 # Survey form page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Homepage
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard-content.tsx   # Admin dashboard component
│   ├── ikm-analysis-dashboard.tsx
│   ├── logout-button.tsx
│   ├── public-dashboard-content.tsx
│   ├── survey-form.tsx
│   └── survey-table.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client & admin client
│   │   └── proxy.ts           # Middleware
│   ├── constants.ts           # Dropdown options
│   ├── export-excel.ts        # Excel export logic
│   ├── ikm-calculator.ts      # IKM calculation
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── scripts/
│   └── 001-create-tables.sql  # Database schema
├── .env.local                 # Environment variables (local)
├── .env                       # Environment variables (docker)
├── Dockerfile
├── docker-compose.yml
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📖 Dokumentasi API

### Public Endpoints

#### `GET /` - Homepage
Landing page dengan akses ke form survey dan dashboard public.

#### `GET /survey` - Form Survey
Halaman formulir survey untuk responden.

#### `GET /dashboard` - Public Dashboard
Dashboard publik menampilkan statistik tanpa detail IKM.

### Protected Endpoints (Admin)

#### `GET /admin/dashboard` - Admin Dashboard
Dashboard lengkap dengan analisis IKM, export Excel, dan filter.

**Auth Required**: Yes (redirect ke `/auth/login` jika tidak login)

#### `GET /auth/login` - Login Page
Halaman login untuk admin.

**Redirect**: Ke `/admin/dashboard` jika sudah login.

### Supabase Integration

**Client-side Operations**:
- Submit survey baru (via `survey-form.tsx`)

**Server-side Operations** (via Server Components):
- Fetch all surveys
- Calculate IKM
- Generate analytics

---

## 🧪 Testing Admin Access

1. Login dengan credentials admin yang sudah dibuat di Supabase
2. Akses `/admin/dashboard`
3. Test fitur:
   - Filter per jenis pelayanan
   - Export to Excel
   - Lihat breakdown IKM per unsur

---

## 🤝 Kontributor

- **Developer**: [Nama Anda]
- **Client**: Dinas Tenaga Kerja Kota Bandung
- **Support**: [Email Support]

---

## 📄 Lisensi

Proprietary - © 2026 Dinas Tenaga Kerja Kota Bandung

---

## 🆘 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solusi**: Pastikan file `.env.local` sudah dibuat dan berisi credentials yang benar.

### Error: "Row Level Security policy violation"
**Solusi**: Pastikan RLS policies sudah diterapkan sesuai SQL di atas.

### Docker container tidak bisa akses Supabase
**Solusi**: Pastikan firewall server mengizinkan koneksi keluar ke `*.supabase.co`.

### Export Excel tidak muncul tombolnya
**Solusi**: Pastikan ada data survey, tombol disabled jika data kosong.

---

## 📞 Support

Jika ada pertanyaan atau issue, hubungi:
- Email: support@disnaker.bandung.go.id
- GitHub Issues: [Link to repo issues]

---

**Built with ❤️ for Dinas Tenaga Kerja Kota Bandung**
