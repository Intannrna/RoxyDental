# Panduan Setup VPS & Deploy RoxyDental

## 1. Konfigurasi DNS (Domain Name System)

Sebelum masuk ke VPS, setting domain dulu agar mengarah ke IP Server.
Masuk ke panel domain provider Anda (tempat beli `polabdc.my.id`), cari menu **DNS Management**.

Tambahkan **A Record**:
| Host / Name | Type | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| `@` (atau kosong) | **A** | `72.62.125.42` | Auto / 3600 |
| `www` | **CNAME** | `polabdc.my.id` | Auto / 3600 |

> Tunggu beberapa menit hingga jam (propagasi) agar domain bisa diakses.

---

## 2. Persiapan VPS (Pertama Kali)

Buka terminal di laptop Anda, lalu SSH ke VPS:
```bash
ssh root@72.62.125.42
# Masukkan password VPS Anda
```

### Install Docker & Git
Jalankan command berikut di dalam VPS:
```bash
# Update repository
sudo apt update && sudo apt upgrade -y

# Install Docker, Docker Compose, dan Git
sudo apt install -y docker.io docker-compose-v2 git

# Pastikan service Docker jalan
sudo systemctl enable --now docker
```

---

## 3. Clone Repository & Setup Env

```bash
# Clone repo Anda
git clone https://github.com/Intannrna/RoxyDental.git
cd RoxyDental

# Buat file .env production
nano .env.prod
```

**Paste isi .env berikut (Sesuaikan isinya dengan kredensial asli Anda):**
*(Tekan Klik Kanan untuk paste di terminal)*

```env
# --- DATABASE (Supabase) ---
# Mode Transaction (Port 6543)
DATABASE_URL="postgresql://postgres.[you]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Mode Session (Port 5432) - Opsional jika perlu direct connection
DIRECT_URL="postgresql://postgres.[you]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# --- BACKEND ---
PORT=5000
JWT_SECRET="rahasia_negara_api_123"
SUPABASE_URL="https://[project-id].supabase.co"
SUPABASE_KEY="[service-role-key-atau-anon-key]"

# --- FRONTEND (Build Time Args) ---
NEXT_PUBLIC_API_URL="https://polabdc.my.id/api/v1"
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"

# --- AI SERVICE ---
GEMINI_API_KEY="[taruh-api-key-gemini-disini]"
```
*Simpan dengan `Ctrl+X`, lalu `Y`, lalu `Enter`.*

---

## 4. Jalankan Deployment (Otomatis)

Saya sudah buatkan script `deploy.sh`. Anda cukup jalankan:

```bash
# Beri izin eksekusi
chmod +x Deployment/deploy.sh

# Jalanin script deploy
./Deployment/deploy.sh
```

Script ini akan:
1.  Pull update terbaru dari Git.
2.  Build ulang container Docker.
3.  Menyalakan server.

---

## 5. Setup SSL (HTTPS)

Setelah service jalan (cek dengan `docker compose ps`), jalankan Certbot untuk HTTPS:

```bash
# Request sertifikat SSL
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d polabdc.my.id -d www.polabdc.my.id
```

Jika berhasil, edit konfigurasi Nginx untuk mengaktifkan HTTPS (uncomment bagian SSL di `nginx/nginx.conf`), lalu restart Nginx:

```bash
docker compose restart nginx
```

---

## Cheat Sheet Command

*   **Cek status container**: `docker compose ps`
*   **Lihat logs backend**: `docker compose logs -f backend`
*   **Lihat logs ai**: `docker compose logs -f ai`
*   **Restart semua**: `docker compose restart`
*   **Matikan semua**: `docker compose down`
