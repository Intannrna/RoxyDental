"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardList, Hash, Boxes, Wallet, Percent, X } from "lucide-react";

interface ProcedureData {
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  modalPrice: number;
  avgComm: string; // tetap string (sesuai kebutuhan kamu)
}

interface Props {
  onClose: () => void;
  handleSave: (data: ProcedureData) => void;
}

// UI state khusus input agar enak (boleh kosong)
type ProcedureFormUI = {
  name: string;
  code: string;
  quantity: string;
  salePrice: string;
  modalPrice: string;
  avgComm: string; // string %
};

const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");
const toNum = (v: string) => (onlyDigits(v) === "" ? 0 : Number(onlyDigits(v)));

function Field({
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
          className={icon ? "pl-10 border-pink-200 focus-visible:ring-pink-300 bg-white" : "border-pink-200 focus-visible:ring-pink-300 bg-white"}
        />
      </div>
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

function NumberInput({
  label,
  value,
  onChange,
  icon,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  hint?: string;
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
          inputMode="numeric"
          value={value}
          placeholder="0"
          onChange={(e) => onChange(onlyDigits(e.target.value))}
          className={icon ? "pl-10 border-pink-200 focus-visible:ring-pink-300 bg-white" : "border-pink-200 focus-visible:ring-pink-300 bg-white"}
        />
      </div>
      {hint ? <p className="mt-1 text-[11px] text-gray-500">{hint}</p> : null}
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
  // clamp 0-100 optional (kalau mau bebas, hapus clamp)
  const handle = (raw: string) => {
    const digits = onlyDigits(raw);
    if (digits === "") return onChange("");
    const n = Math.min(100, Math.max(0, Number(digits)));
    onChange(String(n));
  };

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
          onChange={(e) => handle(e.target.value)}
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

export default function AddProcedure({ onClose, handleSave }: Props) {
  const [form, setForm] = useState<ProcedureFormUI>({
    name: "",
    code: "",
    quantity: "",
    salePrice: "",
    modalPrice: "",
    avgComm: "0",
  });

  const update = (k: keyof ProcedureFormUI, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const qty = useMemo(() => toNum(form.quantity), [form.quantity]);
  const sale = useMemo(() => toNum(form.salePrice), [form.salePrice]);
  const modal = useMemo(() => toNum(form.modalPrice), [form.modalPrice]);
  const commPct = useMemo(() => toNum(form.avgComm), [form.avgComm]);

  const totalPenjualan = qty * sale;
  const totalModal = qty * modal;
  const totalKomisi = Math.round((totalPenjualan * commPct) / 100);
  const totalBayar = totalPenjualan - totalKomisi;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const name = form.name.trim();
    const code = form.code.trim();

    if (!name) return;

    const payload: ProcedureData = {
      name,
      code,
      quantity: qty,
      salePrice: sale,
      modalPrice: modal,
      avgComm: form.avgComm === "" ? "0" : form.avgComm, // tetap string
    };

    handleSave(payload);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-[#FFF5F7]"
    >
      {/* HEADER */}

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-white/20"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 text-white" />
        </button>

      {/* BODY */}
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
        <section className="bg-white rounded-xl border border-pink-100 p-4">
        <div className="mb-3">
            <span className="text-xs font-semibold text-pink-900">
              Tipe Data Keuangan
            </span>
            <div className="mt-1 px-3 py-2 rounded-lg bg-pink-50 border border-pink-100 text-pink-800 text-sm font-semibold">
              Komisi Prosedure
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Nama Prosedur *"
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="Contoh: Rontgen Cephalometric - Solo"
              icon={<ClipboardList className="w-4 h-4" />}
            />
            <Field
              label="Kode *"
              value={form.code}
              onChange={(v) => update("code", v)}
              placeholder="Contoh: AE001"
              icon={<Hash className="w-4 h-4" />}
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-pink-100 p-4">
          <h3 className="text-sm font-bold text-pink-900 mb-3">Input Kuantitas & Harga</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Kuantitas"
              value={form.quantity}
              onChange={(v) => update("quantity", v)}
              icon={<Boxes className="w-4 h-4" />}
              hint="Kosong = 0"
            />

            <MoneyInput
              label="Harga Jual (AVG)"
              value={form.salePrice}
              onChange={(v) => update("salePrice", v)}
            />

            <MoneyInput
              label="Harga Modal (AVG)"
              value={form.modalPrice}
              onChange={(v) => update("modalPrice", v)}
            />

            <PercentInput
              label="Komisi (AVG) %"
              value={form.avgComm}
              onChange={(v) => update("avgComm", v)}
            />
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg text-sm">
            <p className="font-semibold text-pink-900 mb-2">Preview Perhitungan</p>
            <div className="space-y-1 text-pink-700">
              <p>
                Total Penjualan: <b>Rp {totalPenjualan.toLocaleString("id-ID")}</b>
              </p>
              <p>
                Total Modal: <b>Rp {totalModal.toLocaleString("id-ID")}</b>
              </p>
              <p>
                Total Komisi: <b>Rp {totalKomisi.toLocaleString("id-ID")}</b>
              </p>
              <p>
                Total Bayar: <b>Rp {totalBayar.toLocaleString("id-ID")}</b>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 bg-white border-t border-pink-100 px-6 py-4 flex justify-end gap-3">
        <Button type="button" variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50" onClick={onClose}>
          Batal
        </Button>

        <Button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white"
          disabled={!form.name.trim()}
          title={!form.name.trim() ? "Nama prosedur wajib diisi" : ""}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}
