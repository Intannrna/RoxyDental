"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Hash, Boxes, Wallet, Percent } from "lucide-react";

interface PacketData {
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  avgComm: string; // tetap string (decimal)
}

interface Props {
  onClose: () => void;
  handleSave: (data: PacketData) => void;
}

// UI state supaya input enak (boleh kosong)
type PacketFormUI = {
  name: string;
  sku: string;
  quantity: string;
  salePrice: string;
  avgComm: string; // decimal string
};

const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");
const onlyDecimal = (v: string) => {
  // izinkan angka + satu titik desimal
  const cleaned = v.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
};

const toInt = (v: string) => (onlyDigits(v) === "" ? 0 : Number(onlyDigits(v)));
const toMoney = (v: string) => (onlyDigits(v) === "" ? 0 : Number(onlyDigits(v)));
const toPercent = (v: string) => {
  const s = onlyDecimal(v);
  if (s === "" || s === ".") return 0;
  const n = Number(s);
  if (Number.isNaN(n)) return 0;
  // clamp 0..100
  return Math.min(100, Math.max(0, n));
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-pink-900">{label}</span>
      <div className="relative mt-1">
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600">
            {icon}
          </span>
        ) : null}
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={
            icon
              ? "pl-10 border-pink-200 focus-visible:ring-pink-300 bg-white"
              : "border-pink-200 focus-visible:ring-pink-300 bg-white"
          }
        />
      </div>
    </label>
  );
}

function QtyInput({
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
          <Boxes className="w-4 h-4" />
        </span>
        <Input
          inputMode="numeric"
          value={value}
          placeholder="1"
          onChange={(e) => onChange(onlyDigits(e.target.value))}
          className="pl-10 border-pink-200 focus-visible:ring-pink-300 bg-white"
        />
      </div>
      <p className="mt-1 text-[11px] text-gray-500">Kosong = 0</p>
    </label>
  );
}

function MoneyInput({
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
          <Wallet className="w-4 h-4" />
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
  const handle = (raw: string) => {
    const cleaned = onlyDecimal(raw);
    // biarkan user ngetik "" atau "." dulu
    if (cleaned === "" || cleaned === ".") return onChange(cleaned);
    const n = Number(cleaned);
    if (Number.isNaN(n)) return;
    const clamped = Math.min(100, Math.max(0, n));
    onChange(clamped.toString());
  };

  return (
    <label className="block">
      <span className="text-xs font-semibold text-pink-900">{label}</span>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600">
          <Percent className="w-4 h-4" />
        </span>
        <Input
          inputMode="decimal"
          value={value}
          placeholder="0.00"
          onChange={(e) => handle(e.target.value)}
          className="pl-10 pr-10 border-pink-200 focus-visible:ring-pink-300 bg-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-pink-700">
          %
        </span>
      </div>
      <p className="mt-1 text-[11px] text-gray-500">0–100 (boleh desimal).</p>
    </label>
  );
}

export default function AddPacket({ onClose, handleSave }: Props) {
  const [form, setForm] = useState<PacketFormUI>({
    name: "",
    sku: "",
    quantity: "1",
    salePrice: "",
    avgComm: "0.00",
  });

  const update = (k: keyof PacketFormUI, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const qty = useMemo(() => toInt(form.quantity), [form.quantity]);
  const sale = useMemo(() => toMoney(form.salePrice), [form.salePrice]);
  const commPct = useMemo(() => toPercent(form.avgComm), [form.avgComm]);

  const totalPenjualan = qty * sale;
  const totalKomisi = Math.round((totalPenjualan * commPct) / 100);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    const payload: PacketData = {
      name,
      sku: form.sku.trim(),
      quantity: qty,
      salePrice: sale,
      avgComm: form.avgComm === "" || form.avgComm === "." ? "0.00" : form.avgComm,
    };

    handleSave(payload);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-white"
    >
      {/* ✅ HEADER (FIX BIAR ATAS TIDAK KOSONG) */}
      <div className="sticky top-0 z-20 bg-white border-b border-pink-100 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Tambah Paket</h2>
            <p className="text-sm text-gray-600">
              Input paket, kuantitas, harga jual, dan komisi rata-rata.
            </p>
          </div>
        </div>

        <div className="mt-3 text-xs">
          <span className="text-gray-500">Tipe Data Keuangan:</span>{" "}
          <span className="font-semibold text-pink-700">Komisi Paket</span>
        </div>
      </div>

      {/* BODY */}
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4 bg-[#FFF5F7]">
        <section className="bg-white rounded-xl border border-pink-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Nama Paket *"
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="Contoh: Paket Basic Dental Care"
              icon={<Package className="w-4 h-4" />}
            />

            <TextField
              label="SKU *"
              value={form.sku}
              onChange={(v) => update("sku", v)}
              placeholder="Contoh: PKT001"
              icon={<Hash className="w-4 h-4" />}
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-pink-100 p-4">
          <h3 className="text-sm font-bold text-pink-900 mb-3">Kuantitas, Harga & Komisi</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QtyInput
              label="Kuantitas"
              value={form.quantity}
              onChange={(v) => update("quantity", v)}
            />

            <MoneyInput
              label="Harga Jual (AVG)"
              value={form.salePrice}
              onChange={(v) => update("salePrice", v)}
            />

            <div className="md:col-span-2">
              <PercentInput
                label="Komisi (AVG) %"
                value={form.avgComm}
                onChange={(v) => update("avgComm", v)}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
            <p className="font-semibold text-green-900 mb-2">Preview Perhitungan</p>
            <p className="text-green-700">
              Total Penjualan: <b>Rp {totalPenjualan.toLocaleString("id-ID")}</b>
            </p>
            <p className="text-green-700">
              Total Komisi: <b>Rp {totalKomisi.toLocaleString("id-ID")}</b>
            </p>
          </div>
        </section>
      </div>

      {/* FOOTER */}
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
          disabled={!form.name.trim()}
          title={!form.name.trim() ? "Nama paket wajib diisi" : ""}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}
