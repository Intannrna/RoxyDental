"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Percent,
  TestTube2,
  Package,
  Pill,
  Scissors,
} from "lucide-react";

/* =======================
   TYPES
======================= */
interface FinanceData {
  tipe: string;
  nama: string;
  prosedur: string;
  potongan: number;
  bhpHarga: number;
  bhpKomisi: number;
  farmasiHarga: number;
  farmasiKomisi: number;
  paketHarga: number;
  paketKomisi: number;
  labHarga: number;
  labKomisi: number;
}

interface Props {
  onClose: () => void;
  handleSave: (data: FinanceData) => void;
}

/* =======================
   FORM UI (STRING)
======================= */
type FinanceFormUI = {
  tipe: string;
  nama: string;
  prosedur: string;
  potongan: string;
  bhpHarga: string;
  bhpKomisi: string;
  farmasiHarga: string;
  farmasiKomisi: string;
  paketHarga: string;
  paketKomisi: string;
  labHarga: string;
  labKomisi: string;
};

const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");
const toNum = (v: string) => (onlyDigits(v) === "" ? 0 : Number(onlyDigits(v)));

/* =======================
   INPUT COMPONENTS
======================= */
function MoneyInput({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-pink-900">{label}</span>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600">
          {icon ?? <Wallet className="w-4 h-4" />}
        </span>
        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-pink-700">
          Rp
        </span>
        <Input
          inputMode="numeric"
          value={value}
          placeholder="0"
          onChange={(e) => onChange(onlyDigits(e.target.value))}
          className="pl-16 border-pink-200 focus-visible:ring-pink-300 bg-white"
        />
      </div>
      <p className="mt-1 text-[11px] text-gray-500">Isi angka saja (tanpa titik/koma).</p>
    </label>
  );
}

function PercentInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-pink-900">{label}</span>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600">
          <Percent className="w-4 h-4" />
        </span>
        <Input
          inputMode="numeric"
          value={value}
          placeholder="0"
          onChange={(e) => onChange(onlyDigits(e.target.value))}
          className="pl-10 pr-10 border-pink-200 focus-visible:ring-pink-300 bg-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-pink-700">
          %
        </span>
      </div>
      <p className="mt-1 text-[11px] text-gray-500">0–100 (disarankan).</p>
    </label>
  );
}

/* =======================
   MAIN
======================= */
export default function AddFinanceData({ onClose, handleSave }: Props) {
  const [form, setForm] = useState<FinanceFormUI>({
    tipe: "Komisi Tenaga Medis",
    nama: "",
    prosedur: "",
    potongan: "",
    bhpHarga: "",
    bhpKomisi: "",
    farmasiHarga: "",
    farmasiKomisi: "",
    paketHarga: "",
    paketKomisi: "",
    labHarga: "",
    labKomisi: "",
  });

  const update = (k: keyof FinanceFormUI, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const previewTotal = useMemo(() => {
    return (
      toNum(form.potongan) +
      toNum(form.bhpHarga) +
      toNum(form.farmasiHarga) +
      toNum(form.paketHarga) +
      toNum(form.labHarga)
    );
  }, [form]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const nama = form.nama.trim();
    if (!nama) return;

    const payload: FinanceData = {
      tipe: form.tipe,
      nama,
      prosedur: form.prosedur.trim(),
      potongan: toNum(form.potongan),
      bhpHarga: toNum(form.bhpHarga),
      bhpKomisi: toNum(form.bhpKomisi),
      farmasiHarga: toNum(form.farmasiHarga),
      farmasiKomisi: toNum(form.farmasiKomisi),
      paketHarga: toNum(form.paketHarga),
      paketKomisi: toNum(form.paketKomisi),
      labHarga: toNum(form.labHarga),
      labKomisi: toNum(form.labKomisi),
    };

    handleSave(payload);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-white"
    >
      {/* ================= HEADER (FIX BIAR ATAS TIDAK KOSONG) ================= */}
      <div className="sticky top-0 z-20 bg-white border-b border-pink-100 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Tambah Data Keuangan</h2>
            <p className="text-sm text-gray-600">
              Tambahkan data keuangan baru ke dalam sistem
            </p>
          </div>
        </div>

        <div className="mt-3 text-xs">
          <span className="text-gray-500">Tipe Data Keuangan:</span>{" "}
          <span className="font-semibold text-pink-700">{form.tipe}</span>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4 bg-[#FFF5F7]">
        {/* IDENTITAS */}
        <Card className="rounded-xl border border-pink-100 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-pink-900">
                Nama Tenaga Medis 
              </span>
              <Input
                value={form.nama}
                onChange={(e) => update("nama", e.target.value)}
                placeholder="Contoh: drg. Azril"
                className="mt-1 border-pink-200 focus-visible:ring-pink-300 bg-white"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-pink-900">Prosedur</span>
              <Input
                value={form.prosedur}
                onChange={(e) => update("prosedur", e.target.value)}
                placeholder="Contoh: Scaling Gigi"
                className="mt-1 border-pink-200 focus-visible:ring-pink-300 bg-white"
              />
            </label>
          </CardContent>
        </Card>

        {/* BIAYA & KOMISI */}
        <Card className="rounded-xl border border-pink-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3 mt-5">
              <h3 className="text-sm font-bold text-pink-900">Komponen Biaya & Komisi</h3>
              <span className="text-xs text-gray-600">
                Total:{" "}
                <span className="font-bold text-pink-700">
                  Rp {previewTotal.toLocaleString("id-ID")}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MoneyInput
                label="Potongan Awal"
                value={form.potongan}
                onChange={(v) => update("potongan", v)}
                icon={<Scissors className="w-4 h-4" />}
              />

              <MoneyInput
                label="Harga Modal (BHP)"
                value={form.bhpHarga}
                onChange={(v) => update("bhpHarga", v)}
              />

              <PercentInput
                label="Komisi (BHP)"
                value={form.bhpKomisi}
                onChange={(v) => update("bhpKomisi", v)}
              />

              <MoneyInput
                label="Harga Modal (Farmasi)"
                value={form.farmasiHarga}
                onChange={(v) => update("farmasiHarga", v)}
                icon={<Pill className="w-4 h-4" />}
              />

              <PercentInput
                label="Komisi (Farmasi)"
                value={form.farmasiKomisi}
                onChange={(v) => update("farmasiKomisi", v)}
              />

              <MoneyInput
                label="Paket"
                value={form.paketHarga}
                onChange={(v) => update("paketHarga", v)}
                icon={<Package className="w-4 h-4" />}
              />

              <PercentInput
                label="Komisi (Paket)"
                value={form.paketKomisi}
                onChange={(v) => update("paketKomisi", v)}
              />

              <MoneyInput
                label="LAB"
                value={form.labHarga}
                onChange={(v) => update("labHarga", v)}
                icon={<TestTube2 className="w-4 h-4" />}
              />

              <PercentInput
                label="Komisi (LAB)"
                value={form.labKomisi}
                onChange={(v) => update("labKomisi", v)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="sticky bottom-0 bg-white border-t border-pink-100 px-6 py-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-pink-200 text-pink-700 hover:bg-pink-50"
          onClick={onClose}
        >
          Batal
        </Button>

        <Button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white"
          disabled={!form.nama.trim()}
          title={!form.nama.trim() ? "Nama tenaga medis wajib diisi" : ""}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}
