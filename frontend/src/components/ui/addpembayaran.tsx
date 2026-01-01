"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { visitService, Visit } from "@/services/visit.service";
import { PaymentMethodType } from "@/services/payment.service";

interface PaymentForm {
  visitId: string;
  totalTagihan: number;
  metode: PaymentMethodType;
  jumlahBayar: number;
  nomorReferensi: string;
  catatan: string;
}

interface Props {
  onSave: (data: PaymentForm) => void;
  onClose: () => void;
}

type VisitOption = {
  visitId: string;
  visitNumber: string;
  patientName: string;
  patientNumber: string;
  medicalRecordNumber: string | null | undefined;
  totalTagihan?: number;
  status?: string;
  visitDate?: string;
};

function formatRupiah(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("id-ID");
}

function sanitizeNumericInput(value: string) {
  let raw = value.replace(/\D/g, "");
  raw = raw.replace(/^0+/, "");
  return raw;
}

export default function InputPembayaran({ onSave, onClose }: Props) {
  const [form, setForm] = useState<PaymentForm>({
    visitId: "",
    totalTagihan: 0,
    metode: "CASH",
    jumlahBayar: 0,
    nomorReferensi: "",
    catatan: "",
  });

  const [totalInput, setTotalInput] = useState<string>("");
  const [bayarInput, setBayarInput] = useState<string>("");

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<VisitOption[]>([]);
  const [openList, setOpenList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const boxRef = useRef<HTMLDivElement | null>(null);

  const update = (key: keyof PaymentForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const kembalian = useMemo(() => {
    return Math.max((form.jumlahBayar || 0) - (form.totalTagihan || 0), 0);
  }, [form.jumlahBayar, form.totalTagihan]);

  const sisaBayar = useMemo(() => {
    return Math.max((form.totalTagihan || 0) - (form.jumlahBayar || 0), 0);
  }, [form.jumlahBayar, form.totalTagihan]);

  const statusBayar = useMemo(() => {
    if (!form.totalTagihan) return "Belum diisi";
    if ((form.jumlahBayar || 0) === 0) return "Belum bayar";
    if (form.jumlahBayar >= form.totalTagihan) return "Lunas";
    if (form.jumlahBayar > 0 && form.jumlahBayar < form.totalTagihan) return "DP/Cicilan";
    return "Belum bayar";
  }, [form.jumlahBayar, form.totalTagihan]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpenList(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setOptions([]);
      setOpenList(false);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await visitService.getCompletedVisits(1, 50, q);
        const visits = response.visits || [];

        const mappedOptions: VisitOption[] = visits.map((visit) => ({
          visitId: visit.id,
          visitNumber: visit.visitNumber,
          patientName: visit.patient.fullName,
          patientNumber: visit.patient.patientNumber,
          medicalRecordNumber: visit.patient.medicalRecordNumber,
          totalTagihan: visit.totalCost || 0,
          status: visit.status,
          visitDate: visit.visitDate,
        }));

        setOptions(mappedOptions);
        setOpenList(true);
      } catch (error) {
        console.error("Error fetching visits:", error);
        setOptions([]);
        setOpenList(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  const selectVisit = async (v: VisitOption) => {
    try {
      const visitDetail = await visitService.getVisitById(v.visitId);
      setSelectedVisit(visitDetail);

      update("visitId", v.visitId);

      const totalCost = visitDetail.totalCost || 0;
      update("totalTagihan", totalCost);
      setTotalInput(totalCost.toString());

      const label = `${v.patientName} • ${v.visitNumber}`;
      setSelectedLabel(label);
      setQuery(label);
      setOpenList(false);
    } catch (error) {
      console.error("Error loading visit detail:", error);
    }
  };

  const resetVisit = () => {
    setSelectedLabel("");
    setSelectedVisit(null);
    update("visitId", "");
    update("totalTagihan", 0);
    setTotalInput("");
    setQuery("");
    setOptions([]);
    setOpenList(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.visitId) newErrors.visitId = "Silakan pilih kunjungan pasien dari hasil pencarian";
    if (!form.totalTagihan || form.totalTagihan <= 0) newErrors.totalTagihan = "Total tagihan harus lebih dari 0";
    if (!form.metode) newErrors.metode = "Silakan pilih metode pembayaran";
    if (form.jumlahBayar < 0) newErrors.jumlahBayar = "Jumlah bayar tidak boleh negatif";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const canSave = Boolean(form.visitId && form.metode && form.totalTagihan > 0);

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl border border-pink-100 overflow-hidden bg-white">
      <div className="h-2 w-full bg-linear-to-r from-pink-500 via-pink-600 to-rose-500" />

      <CardContent className="p-0">
        {/* ✅ HEADER STICKY (FIX BIAR ATAS TIDAK KOSONG & RAPI) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-pink-100 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Input Pembayaran</h2>
              <p className="text-sm text-gray-500 mt-1">
                Pilih kunjungan pasien dan lengkapi data pembayaran
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={[
                  "px-3 py-1 rounded-full text-xs font-semibold border shadow-sm whitespace-nowrap",
                  statusBayar === "Lunas"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : statusBayar === "DP/Cicilan"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : statusBayar === "Belum bayar"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-gray-50 text-gray-700 border-gray-200",
                ].join(" ")}
              >
                {statusBayar}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full h-9 w-9"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ BODY SCROLL */}
        <div className="max-h-[78vh] overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* Section: Kunjungan */}
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Kunjungan
            </div>

            <div className="mb-6 text-sm" ref={boxRef}>
              <div className="flex items-center justify-between gap-3">
                <Label className="font-medium text-gray-800">
                  Pilih Kunjungan Pasien <span className="text-red-500">*</span>
                </Label>

                {!!form.visitId && (
                  <button
                    type="button"
                    onClick={resetVisit}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Ganti
                  </button>
                )}
              </div>

              <div className="relative mt-2">
                <input
                  className={`w-full p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${
                    errors.visitId ? "border-red-500 focus:ring-red-200" : "focus:ring-pink-200"
                  }`}
                  placeholder="Ketik minimal 2 huruf: nama pasien / nomor kunjungan..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedLabel("");
                    update("visitId", "");
                  }}
                  onFocus={() => {
                    if (options.length > 0) setOpenList(true);
                  }}
                  disabled={!!form.visitId}
                />
                {errors.visitId && <p className="text-red-500 text-xs mt-1">{errors.visitId}</p>}

                {openList && !form.visitId && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b bg-gray-50 flex items-center justify-between">
                      <span>{loading ? "Mencari..." : options.length ? "Hasil pencarian" : "Tidak ada hasil"}</span>
                    </div>

                    <div className="max-h-64 overflow-auto">
                      {!loading &&
                        options.map((v) => (
                          <button
                            type="button"
                            key={v.visitId}
                            onClick={() => selectVisit(v)}
                            className="w-full text-left px-3 py-2 hover:bg-pink-50 transition"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 truncate">{v.patientName}</div>
                                <div className="text-xs text-gray-500 truncate">
                                  {v.visitNumber} • No. Pasien: {v.patientNumber}
                                  {v.medicalRecordNumber && ` • No. RM: ${v.medicalRecordNumber}`}
                                </div>
                              </div>

                              {typeof v.totalTagihan === "number" && v.totalTagihan > 0 ? (
                                <div className="text-xs font-semibold text-pink-600 whitespace-nowrap">
                                  Rp {formatRupiah(v.totalTagihan)}
                                </div>
                              ) : null}
                            </div>
                          </button>
                        ))}

                      {!loading && options.length === 0 && (
                        <div className="px-3 py-3 text-sm text-gray-600">Tidak ditemukan. Coba keyword lain.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!!form.visitId && !!selectedLabel && (
                <div className="mt-2 text-xs text-gray-600">
                  Dipilih: <span className="font-medium">{selectedLabel}</span>
                </div>
              )}
            </div>

            {/* Info Pasien */}
            {selectedVisit && (
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-6">
                <h3 className="font-semibold text-pink-900 mb-2 text-sm">Informasi Pasien & Kunjungan</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Nama:</span>
                    <p className="font-semibold text-gray-900">{selectedVisit.patient.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Pasien:</span>
                    <p className="font-semibold text-gray-900">{selectedVisit.patient.patientNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. RM:</span>
                    <p className="font-semibold text-gray-900">{selectedVisit.patient.medicalRecordNumber || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Kunjungan:</span>
                    <p className="font-semibold text-gray-900">{selectedVisit.visitNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Tanggal Kunjungan:</span>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedVisit.visitDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section: Tagihan */}
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Tagihan</div>

            <div className="mb-6">
              <div
                className={`relative rounded-2xl border ${
                  errors.totalTagihan ? "border-red-500" : "border-pink-200"
                } bg-linear-to-br from-pink-50 via-white to-white p-4 shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-sm font-bold text-sm">
                    Rp
                  </div>

                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 mb-1">
                      Total Tagihan <span className="text-red-500">*</span>
                    </Label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Masukkan total tagihan"
                      className="w-full bg-transparent text-2xl font-bold text-gray-900 focus:outline-none placeholder:text-gray-400"
                      value={totalInput}
                      onChange={(e) => {
                        const raw = sanitizeNumericInput(e.target.value);
                        setTotalInput(raw);
                        update("totalTagihan", raw ? Number(raw) : 0);
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Ditampilkan: <b>Rp {formatRupiah(form.totalTagihan)}</b>
                    </div>
                  </div>

                  <div className="hidden md:block text-right text-xs">
                    <div className="text-gray-500">Sisa</div>
                    <div className="font-semibold text-gray-800">Rp {formatRupiah(sisaBayar)}</div>
                  </div>
                </div>

                {errors.totalTagihan && <p className="text-red-500 text-xs mt-2">{errors.totalTagihan}</p>}
              </div>
            </div>

            {/* Section: Pembayaran */}
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Pembayaran</div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-800 mb-2">
                Metode Pembayaran <span className="text-red-500">*</span>
              </Label>
              <select
                className={`w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${
                  errors.metode ? "border-red-500 focus:ring-red-200" : "focus:ring-pink-200"
                }`}
                value={form.metode}
                onChange={(e) => update("metode", e.target.value as PaymentMethodType)}
              >
                <option value="">Pilih metode</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Debit/Credit Card</option>
                <option value="QRIS">QRIS</option>
                <option value="TRANSFER">Transfer Bank</option>
              </select>
              {errors.metode && <p className="text-red-500 text-xs mt-1">{errors.metode}</p>}
            </div>

            {form.metode && form.metode !== "CASH" && (
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-800 mb-2">Nomor Referensi / ID Transaksi</Label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Contoh: TRX123456789"
                  value={form.nomorReferensi}
                  onChange={(e) => update("nomorReferensi", e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <Label className="text-sm font-medium text-gray-800">
                  Jumlah Bayar (Rp) <span className="text-red-500">*</span>
                </Label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${
                    errors.jumlahBayar ? "border-red-500 focus:ring-red-200" : "focus:ring-pink-200"
                  }`}
                  value={bayarInput}
                  onChange={(e) => {
                    const raw = sanitizeNumericInput(e.target.value);
                    setBayarInput(raw);
                    update("jumlahBayar", raw ? Number(raw) : 0);
                  }}
                  placeholder="Masukkan jumlah bayar"
                />
                {errors.jumlahBayar ? (
                  <p className="text-red-500 text-xs mt-1">{errors.jumlahBayar}</p>
                ) : (
                  <div className="mt-1 text-[11px] text-gray-500">
                    {form.jumlahBayar > 0 && form.jumlahBayar < form.totalTagihan ? (
                      <>
                        Sisa bayar: <b className="text-amber-600">Rp {formatRupiah(sisaBayar)}</b>
                      </>
                    ) : form.jumlahBayar >= form.totalTagihan ? (
                      <span className="text-green-600 font-semibold">✓ Lunas</span>
                    ) : (
                      <>
                        Sisa bayar: <b>Rp {formatRupiah(sisaBayar)}</b>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-800">Kembalian (Rp)</Label>
                <input
                  className="w-full mt-2 p-3 border rounded-xl bg-green-50 text-green-700 font-semibold border-green-200"
                  value={formatRupiah(kembalian)}
                  disabled
                />
                <div className="mt-1 text-[11px] text-gray-500">Otomatis jika bayar &gt; total tagihan</div>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-800">Catatan (Opsional)</Label>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Contoh: Lunas, DP, Cicilan ke-1, dll"
                value={form.catatan}
                onChange={(e) => update("catatan", e.target.value)}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs flex gap-2">
              <span className="text-blue-600 font-semibold">ℹ️</span>
              <div className="text-blue-800">
                <p className="mb-1">
                  <b>Catatan Pembayaran:</b>
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Total tagihan diambil otomatis dari kunjungan</li>
                  <li>
                    <b>Pembayaran Penuh:</b> Jumlah bayar ≥ total tagihan (Status: LUNAS)
                  </li>
                  <li>
                    <b>Pembayaran Sebagian:</b> Jumlah bayar &lt; total tagihan (Status: DP/CICILAN)
                  </li>
                  <li>Anda dapat mengubah total tagihan secara manual jika diperlukan</li>
                </ul>
              </div>
            </div>

            {/* spacer biar konten tidak ketiban footer sticky */}
            <div className="h-24" />
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-pink-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">Ringkasan:</span> Total{" "}
              <b className="text-pink-600">Rp {formatRupiah(form.totalTagihan)}</b> • Bayar{" "}
              <b className={form.jumlahBayar >= form.totalTagihan ? "text-green-600" : "text-blue-600"}>
                Rp {formatRupiah(form.jumlahBayar)}
              </b>
              {sisaBayar > 0 && form.jumlahBayar > 0 && (
                <span className="text-amber-600">
                  {" "}
                  • Sisa: <b>Rp {formatRupiah(sisaBayar)}</b>
                </span>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </Button>

              <Button
                type="button"
                onClick={(e) => handleSubmit(e as any)}
                className="rounded-xl bg-linear-to-r from-pink-600 to-rose-500 text-white hover:opacity-95 font-semibold shadow-md disabled:opacity-60"
                disabled={!canSave}
              >
                SIMPAN PEMBAYARAN
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
