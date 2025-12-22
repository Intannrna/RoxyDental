"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { aiService, PredictionData } from "@/services/ai.service";

interface Props {
  onClose: () => void;
}

export default function PredictionModal({ onClose }: Props) {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    try {
      const response = await aiService.getPrediction();
      if (response.status === "success" || response.status === "warning") {
        setData(response.data);
      } else {
        setError("Gagal memuat prediksi");
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server prediksi");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  /* ===================== LOADING & ERROR ===================== */
  if (loading) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded-lg shadow">
          Memuat prediksi...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded-lg shadow space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded-lg shadow space-y-4">
          <p>Data prediksi belum tersedia</p>
          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>
        </div>
      </div>
    );
  }

  /* ===================== CALCULATION ===================== */
  const totalRevenue = data.reduce((a, c) => a + c.revenue, 0);
  const avgRevenue = totalRevenue / data.length;
  const totalPatients = data.reduce((a, c) => a + c.patients, 0);

  /* ===================== UI ===================== */
  return (
    <div className="fixed inset-0 z-9999 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl relative pointer-events-auto rounded-2xl shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <CardHeader className="bg-linear-to-r from-pink-500 to-rose-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Prediksi Kinerja Klinik
          </CardTitle>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* CHART */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => `Rp ${v / 1_000_000}jt`}
                />
                <YAxis yAxisId="right" orientation="right" />

                <Tooltip
                  formatter={(value, name) => {
                    const safeValue =
                      typeof value === "number" ? value : 0;

                    return [
                      name === "Revenue (Rp)"
                        ? formatCurrency(safeValue)
                        : safeValue,
                      name === "Revenue (Rp)"
                        ? "Pendapatan"
                        : "Pasien",
                    ];
                  }}
                />

                <Legend />

                <Line
                  yAxisId="left"
                  dataKey="revenue"
                  stroke="#E91E63"
                  strokeWidth={3}
                  name="Revenue (Rp)"
                />
                <Line
                  yAxisId="right"
                  dataKey="patients"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Jumlah Pasien"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-700" />
                <p className="font-semibold text-purple-900">
                  Estimasi Pendapatan
                </p>
              </div>
              <p className="text-lg font-bold text-purple-700">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs text-gray-500">
                Rata-rata {formatCurrency(avgRevenue)} / minggu
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-700" />
                <p className="font-semibold text-green-900">
                  Estimasi Pasien
                </p>
              </div>
              <p className="text-lg font-bold text-green-700">
                {Math.round(totalPatients)} orang
              </p>
              <p className="text-xs text-gray-500">
                ~{Math.round(totalPatients / data.length)} pasien / minggu
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <Button
            onClick={onClose}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}