"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function AnalisisPage() {
  const router = useRouter();

  // Dummy state (bisa kamu ganti dengan API nanti)
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [todayVisits, setTodayVisits] = useState<number>(0);
  const [monthlyVisits, setMonthlyVisits] = useState<number>(0);

  // Example auto fill (hapus nanti kalau sudah ambil API)
  useEffect(() => {
    setTotalVisits(120);
    setTodayVisits(8);
    setMonthlyVisits(45);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6 flex items-center justify-center">
      <Card className="w-full max-w-xl shadow-2xl border-none">
        
        {/* Header seperti modal */}
        <CardHeader className="bg-[#E91E63] text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analisis Data
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 bg-white space-y-6">
          {/* Stats Box - Sama seperti modal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
              <p className="text-sm text-gray-600">Total Kunjungan</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalVisits}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <p className="text-sm text-gray-600">Pasien Baru</p>
              <p className="text-3xl font-bold text-green-600">
                {todayVisits}
              </p>
            </div>
          </div>

          {/* Statistik Bulanan */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-3">
              Statistik Bulan Ini
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Kunjungan bulan ini</span>
                <span className="font-semibold">{monthlyVisits}</span>
              </div>
            </div>
          </div>

          {/* Tombol kembali */}
          <Button
            onClick={() => router.back()}
            className="w-full mt-4 bg-[#E91E63] hover:bg-[#C2185B] text-white"
          >
            Kembali
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
