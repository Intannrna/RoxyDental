"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp } from "lucide-react";

export default function PrediksiPage() {
  const [showPredictionModal, setShowPredictionModal] = useState(true);

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6">
      {showPredictionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-none flex flex-col">
            <CardHeader className="bg-[#E91E63] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Prediksi AI
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 bg-white flex-1 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4 mt-4">

                {/* --- Prediksi Kunjungan Pasien --- */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      Prediksi Kunjungan Pasien
                    </span>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-sm text-gray-700 mb-2">Minggu Depan</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-green-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-green-700">
                        +6 pasien
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- Indikasi Dominan --- */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Indikasi yang Paling Dominan
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Scaling</span>
                      <span className="font-semibold text-pink-600">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tambal Gigi</span>
                      <span className="font-semibold text-pink-600">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cabut Gigi</span>
                      <span className="font-semibold text-pink-600">18%</span>
                    </div>
                  </div>
                </div>

                {/* --- Rekomendasi --- */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Rekomendasi AI
                  </h4>

                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Pertimbangkan untuk menambah slot lebih minggu depan</li>
                    <li>Siapkan alat scaling perlu ditambah minggu depan</li>
                    <li>Promosi perawatan ortodonti bisa meningkatkan jumlah kunjungan</li>
                  </ul>
                </div>
              </div>

              {/* --- Button Tutup --- */}
              <Button
                onClick={() => setShowPredictionModal(false)}
                className="w-full mt-4 bg-[#E91E63] hover:bg-[#C2185B] text-white"
              >
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
