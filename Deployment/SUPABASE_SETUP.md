# Panduan Setup Supabase (Database)

Karena backend menggunakan **Prisma**, kita tidak perlu buat tabel manual di Supabase. Prisma yang akan membuatkan semua tabel sesuai `schema.prisma`.

## 1. Buat Project Baru
1.  Login ke [Supabase Dashboard](https://supabase.com/dashboard).
2.  Klik **"New Project"**.
3.  Isi:
    *   **Name**: `RoxyDental` (atau bebas)
    *   **Database Password**: **[PENTING]** Buat password yang kuat dan **CATAT/SIMPAN** ini. Jangan sampai lupa!
    *   **Region**: Pilih yang dekat, misal `Singapore` (biar cepat diakses dari Indonesia).
4.  Klik **"Create new project"**.

## 2. Ambil Kredensial (Environment Variables)

Setelah project dibuat, pergi ke menu **Settings** (icon gerigi di bawah) -> **API**.

### A. URL & API Keys
Simpan data ini untuk file `.env` nanti:
*   **Project URL**: Ini adalah `SUPABASE_URL`.
*   **Project API Keys (anon/public)**: Ini adalah `SUPABASE_ANON_KEY` / `SUPABASE_KEY`.
*   **Project API Keys (service_role)**: (Opsional, simpan saja dulu, jangan disebar).

---

## 3. Ambil Connection String Database

Pergi ke menu **Settings** -> **Database**.
Cari bagian **Connection String**.
Pilih tab **URI**.

### A. Transaction Mode (Port 6543)
Copy URL yang muncul. Ini untuk variabel `DATABASE_URL` (penting untuk serverless/deploy).
*   Format: `postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
*   **Ingat**: Ganti `[password]` dengan password database yang Anda buat di Langkah 1.

### B. Session Mode (Port 5432)
Copy URL tapi ganti port jadi `5432` dan buang `?pgbouncer=true`. Ini untuk variabel `DIRECT_URL` (dipakai Prisma saat migrasi).
*   Format: `postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

---

## 4. Eksekusi Migrasi (Membuat Tabel)

Ini langkah penting! Database di Supabase saat ini masih kosong. Kita perlu "mengirim" struktur tabel dari kodingan `schema.prisma` ke Supabase.

Lakukan ini **DARI LAPTOP ANDA** (Local), sebelum deploy ke VPS.

### A. Siapkan .env Lokal
Di folder `backend` di laptop Anda, edit/buat file `.env`:

```env
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"  <-- Paste URL Transaction
DIRECT_URL="postgresql://...:5432/postgres"                  <-- Paste URL Session
```

### B. Jalankan Migrasi Prisma
Buka terminal di folder `backend`:

```bash
# Install dependency dulu jika belum
npm install

# Jalankan perintah migrasi
npx prisma migrate dev --name init_deployment
```

**Apa yang terjadi?**
*   Prisma akan connect ke Supabase.
*   Membuat semua tabel (`User`, `Patient`, `Visit`, dll) secara otomatis.
*   Jika sukses, muncul pesan "Your database is now in sync with your schema."

### C. Seed Data (Optional)
Jika ingin mengisi data awal (admin user, dll) yang ada di `prisma/seed.ts` (jika ada):
```bash
npx prisma db seed
```
Atau manual insert user Dokter/Perawat lewat Supabase Table Editor jika seed error.

---

## 5. Row Level Security (RLS) - Catatan

Karena backend kita menggunakan Prisma yang connect langsung ke DB (bukan via Supabase Client di frontend), **Prisma memiliki akses penuh** (Bypass RLS).
*   Jadi, Anda **TIDAK PERLU** pusing setting Policy RLS di Supabase Dashboard untuk sekarang.
*   Logic keamanan (siapa boleh akses data apa) sudah dihandle di kodingan Backend (Express + Middleware JWT).

**Selesai!** Database Supabase Anda sudah siap digunakan oleh aplikasi di VPS.
