"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentForm {
  visitId: string;
  totalTagihan: number; // manual
  metode: string;
  jumlahBayar: number;
  catatan: string;
}

interface Props {
  onClose?: () => void;
  onSave: (data: PaymentForm) => void;
}

/** Data hasil search kunjungan/pasien */
type VisitOption = {
  visitId: string;
  visitNumber: string;
  patientName: string;
  totalTagihan?: number; // opsional (estimasi)
  status?: string;
};

function formatRupiah(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("id-ID");
}

/** digit-only + buang leading zero */
function sanitizeNumericInput(value: string) {
  let raw = value.replace(/\D/g, "");
  raw = raw.replace(/^0+/, ""); // remove leading zeros
  return raw;
}

export default function InputPembayaran({ onSave, onClose }: Props) {
  const [form, setForm] = useState<PaymentForm>({
    visitId: "",
    totalTagihan: 0,
    metode: "",
    jumlahBayar: 0,
    catatan: "",
  });

  // ✅ string state untuk mencegah "0100000"
  const [totalInput, setTotalInput] = useState<string>("");
  const [bayarInput, setBayarInput] = useState<string>("");

  // search state
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<VisitOption[]>([]);
  const [openList, setOpenList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  const boxRef = useRef<HTMLDivElement | null>(null);

  const update = (key: keyof PaymentForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    return "Kurang";
  }, [form.jumlahBayar, form.totalTagihan]);

  // click outside -> close dropdown
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpenList(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // debounce search
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
        const data = await fetchVisits(q);
        setOptions(data);
        setOpenList(true);
      } catch (e) {
        console.error(e);
        setOptions([]);
        setOpenList(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  const selectVisit = (v: VisitOption) => {
    update("visitId", v.visitId);

    // ✅ total tagihan manual, jadi TIDAK di-set dari visit
    // update("totalTagihan", v.totalTagihan ?? 0);

    const label = `${v.patientName} • ${v.visitNumber}`;
    setSelectedLabel(label);
    setQuery(label);
    setOpenList(false);
  };

  const resetVisit = () => {
    setSelectedLabel("");
    update("visitId", "");
    setQuery("");
    setOptions([]);
    setOpenList(false);
  };

  const handleSubmit = () => {
    if (!form.visitId) {
      alert("Silakan pilih kunjungan pasien dari hasil pencarian.");
      return;
    }
    if (!Number.isFinite(form.totalTagihan) || form.totalTagihan <= 0) {
      alert("Total tagihan wajib diisi dan harus > 0.");
      return;
    }
    if (!form.metode) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }
    if (!Number.isFinite(form.jumlahBayar) || form.jumlahBayar < 0) {
      alert("Jumlah bayar tidak valid.");
      return;
    }

    onSave(form);
  };

  const canSave = Boolean(form.visitId && form.metode && form.totalTagihan > 0);

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl border border-pink-100 overflow-hidden bg-white">
      {/* Accent */}
      <div className="h-2 w-full bg-linear-to-r from-pink-500 via-pink-600 to-rose-500" />

      <CardContent className="p-0">
        {/* ✅ Scroll area */}
        <div className="max-h-[78vh] overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Input Pembayaran</h2>
              <p className="text-sm text-gray-500 mt-1">
                Pilih kunjungan pasien, isi total tagihan manual, lalu simpan pembayaran.
              </p>
            </div>

            {/* Status */}
            <div
              className={[
                "px-3 py-1 rounded-full text-xs font-semibold border shadow-sm whitespace-nowrap",
                statusBayar === "Lunas"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : statusBayar === "Kurang"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-gray-50 text-gray-700 border-gray-200",
              ].join(" ")}
              title="Status berdasarkan total tagihan & jumlah bayar"
            >
              {statusBayar}
            </div>
          </div>

          {/* Section: Kunjungan */}
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Kunjungan
          </div>

          <div className="mb-6 text-sm" ref={boxRef}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-gray-800">Pilih Kunjungan Pasien</span>

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
                className="w-full p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
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
              />

              {/* Dropdown */}
              {openList && (
                <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b bg-gray-50 flex items-center justify-between">
                    <span>
                      {loading
                        ? "Mencari..."
                        : options.length
                        ? "Hasil pencarian"
                        : "Tidak ada hasil"}
                    </span>
                    <span className="text-[11px]">{query.trim().length < 2 ? "Ketik ≥ 2 huruf" : ""}</span>
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
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {v.patientName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                Kunjungan: {v.visitNumber}
                                {v.status ? ` • ${v.status}` : ""}
                              </div>
                            </div>

                            {typeof v.totalTagihan === "number" ? (
                              <div className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                Estimasi: Rp {formatRupiah(v.totalTagihan)}
                              </div>
                            ) : null}
                          </div>
                        </button>
                      ))}

                    {!loading && options.length === 0 && (
                      <div className="px-3 py-3 text-sm text-gray-600">
                        Tidak ditemukan. Coba keyword lain.
                      </div>
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

          {/* Section: Tagihan */}
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Tagihan
          </div>

          {/* Total Tagihan (Manual) */}
          <div className="mb-6">
            <div className="relative rounded-2xl border border-pink-200 bg-linear-to-br from-pink-50 via-white to-white p-4 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-sm font-bold">
                  Rp
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Masukan total tagihan"
                    className="w-full bg-transparent text-2xl font-bold text-gray-900 focus:outline-none placeholder:text-gray-400"
                    value={totalInput}
                    onChange={(e) => {
                      const raw = sanitizeNumericInput(e.target.value);
                      setTotalInput(raw);
                      update("totalTagihan", raw ? Number(raw) : 0);
                    }}
                  />
                  <div className="text-xs text-gray-500">
                    Ditampilkan: <b>Rp {formatRupiah(form.totalTagihan)}</b>
                  </div>
                </div>

                <div className="hidden md:block text-right text-xs">
                  <div className="text-gray-500">Sisa</div>
                  <div className="font-semibold text-gray-800">
                    Rp {formatRupiah(sisaBayar)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pembayaran */}
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Pembayaran
          </div>

          {/* Metode Pembayaran */}
          <label className="block mb-4 text-sm">
            <span className="font-medium text-gray-800">Metode Pembayaran</span>
            <select
              className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
              value={form.metode}
              onChange={(e) => update("metode", e.target.value)}
            >
              <option value="">Pilih metode</option>
              <option value="cash">Cash</option>
              <option value="debit">Debit</option>
              <option value="qris">QRIS</option>
              <option value="transfer">Transfer</option>
            </select>
          </label>

          {/* Jumlah Bayar & Kembalian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-sm">
            <label>
              <span className="font-medium text-gray-800">Jumlah Bayar (Rp)</span>
              <input
                type="text"
                inputMode="numeric"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={bayarInput}
                onChange={(e) => {
                  const raw = sanitizeNumericInput(e.target.value);
                  setBayarInput(raw);
                  update("jumlahBayar", raw ? Number(raw) : 0);
                }}
                placeholder="Masukkan jumlah bayar"
              />
              <div className="mt-1 text-[11px] text-gray-500">
                Sisa bayar: <b>Rp {formatRupiah(sisaBayar)}</b>
              </div>
            </label>

            <label>
              <span className="font-medium text-gray-800">Kembalian (Rp)</span>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-gray-100 text-gray-700"
                value={formatRupiah(kembalian)}
                disabled
              />
              <div className="mt-1 text-[11px] text-gray-500">
                Jika bayar &gt; total, otomatis jadi kembalian.
              </div>
            </label>
          </div>

          {/* Catatan */}
          <label className="block mb-6 text-sm">
            <span className="font-medium text-gray-800">Catatan (Opsional)</span>
            <input
              className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="Contoh: Lunas, DP, dll"
              value={form.catatan}
              onChange={(e) => update("catatan", e.target.value)}
            />
          </label>

          {/* Info */}
          <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl text-sm flex gap-2">
            <span className="text-pink-600 font-semibold">ℹ️</span>
            <p className="text-pink-800">
              Total tagihan diisi <b>manual</b>. Input angka otomatis dibersihkan agar tidak ada{" "}
              <b>0 di depan</b> (contoh: <b>0100000</b> tidak akan terjadi).
            </p>
          </div>
        </div>

        {/* ✅ Sticky Footer Buttons */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-pink-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">Ringkasan:</span>{" "}
              Total <b>Rp {formatRupiah(form.totalTagihan)}</b> • Bayar{" "}
              <b>Rp {formatRupiah(form.jumlahBayar)}</b>
            </div>

            <div className="flex justify-end gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Batal
                </button>
              )}

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-linear-to-r from-pink-600 to-rose-500 text-white hover:opacity-95 text-sm font-semibold shadow-md disabled:opacity-60"
                disabled={!canSave}
              >
                SIMPAN PEMBAYARAN
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * TODO: ganti ini sesuai API kamu.
 * Contoh endpoint: GET /api/visits/search?q=...
 * Response yang diharapkan:
 * [{ visitId, visitNumber, patientName, totalTagihan?, status? }]
 */
async function fetchVisits(q: string): Promise<VisitOption[]> {
  const res = await fetch(`/api/visits/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch visits");
  const data = (await res.json()) as VisitOption[];
  return data;
}
