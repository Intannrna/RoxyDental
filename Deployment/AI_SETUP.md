# Panduan Setup AI Chatbot (Gemini)

Fitur chatbot di RoxyDental menggunakan **Google Gemini API** (`gemini-2.5-flash`). Anda memerlukan API Key agar fitur ini berjalan.

## 1. Dapatkan API Key

1.  Buka [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Login dengan akun Google Anda.
3.  Klik tombol **"Create API Key"**.
4.  Pilih project Google Cloud (atau buat baru).
5.  Copy key yang muncul (diawali dengan `AIza...`).

> **Info**: Tier "Free" sudah cukup untuk penggunaan standar (Rate limit: 15 Request/menit).

## 2. Pasang di VPS

Di dalam file `.env.prod` yang Anda buat di VPS nanti, pastikan variabel ini terisi:

```env
GEMINI_API_KEY="AIzaSyA....(paste key Anda disini)"
```

Tanpa key ini, service AI (`roxy-ai`) akan error saat dijalankan atau tidak mau menjawab chat.

## 3. Testing Chatbot

Setelah dideploy, Anda bisa mengetes apakah AI berjalan normal.

### A. Cek Logs (Di VPS)
```bash
docker compose logs -f ai
```
*   Pastikan tidak ada error "ValueError: GEMINI_API_KEY tidak ditemukan".
*   Harus muncul: `Uvicorn running on http://0.0.0.0:8000`.

### B. Test Direct API
Anda bisa menggunakan Postman atau Curl ke domain Anda:

**Endpoint**: `POST https://polabdc.my.id/ai/chat` (atau sesuaikan dengan path di Nginx jika ada rewrite, default: `/ai/chat`)

**Body (JSON)**:
```json
{
  "message": "Halo, bagaimana pendapatan klinik minggu ini?",
  "user_name": "Dr. Budi"
}
```

**Respon Sukses**:
```json
{
  "status": "success",
  "reply": "Halo Dr. Budi, berdasarkan data minggu ini..."
}
```

## 4. Troubleshooting

*   **Error 503 / 429**: Berarti server Google sedang sibuk atau limit quota Anda habis. Kode AI sudah memiliki fitur *auto-retry* 3x, jadi biasanya akan aman.
*   **Database Error**: Chatbot juga membaca data transaksi minggu ini. Pastikan `DATABASE_URL` di service AI benar agar dia bisa memberikan konteks revenue/pasien.
