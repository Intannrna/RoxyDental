// Hapus import yang error ini:
// import { User } from "@shared/schema";

// GANTI DENGAN INI (Definisi Manual):
export interface User {
  id: number;
  username: string;
  nama: string;
  role: "dokter" | "perawat" | "admin"; // Kita definisikan role disini
  [key: string]: any; // Membolehkan field tambahan lain agar tidak error
}

const AUTH_KEY = "poladc_user";

// Cek apakah sedang di browser
function isClient() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export const auth = {
  getUser(): User | null {
    if (!isClient()) return null; // <-- cegah error SSR

    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setUser(user: User) {
    if (!isClient()) return; // <-- cegah error SSR

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  clearUser() {
    if (!isClient()) return; // <-- cegah error SSR

    localStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated(): boolean {
    if (!isClient()) return false;
    return !!this.getUser();
  },

  getRole(): "dokter" | "perawat" | null {
    if (!isClient()) return null;

    const user = this.getUser();
    // Casting tipe role agar sesuai return type function
    return (user?.role as "dokter" | "perawat") ?? null;
  }
};
