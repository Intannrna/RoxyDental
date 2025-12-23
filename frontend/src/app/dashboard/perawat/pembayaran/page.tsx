"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ReceiptText, CreditCard, Wallet, ArrowLeft, ArrowRight } from "lucide-react";
import InputPembayaran from "@/components/ui/addpembayaran";
import DoctorNavbar from "@/components/ui/navbarpr";

/* =======================
   TYPE DATA
======================= */
interface Payment {
  id: string;
  patientName: string;
  visitNumber: string;
  totalBill: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  note?: string;
  createdAt: string;
}

interface PaymentForm {
  visitId: string;
  totalTagihan: number;
  metode: string;
  jumlahBayar: number;
  catatan: string;
}

/* =======================
   CONSTANT
======================= */
const PAGE_SIZE = 10;

const formatCurrency = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

function methodLabel(m: string) {
  const x = (m || "").toLowerCase();
  if (x === "cash") return "Cash";
  if (x === "debit") return "Debit";
  if (x === "qris") return "QRIS";
  if (x === "transfer") return "Transfer";
  return m || "-";
}

function MethodBadge({ method }: { method: string }) {
  const m = (method || "").toLowerCase();
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold";

  if (m === "cash") return <span className={`${base} bg-pink-50 text-pink-700 border-pink-200`}><Wallet className="w-3 h-3" />Cash</span>;
  if (m === "debit") return <span className={`${base} bg-purple-50 text-purple-700 border-purple-200`}><CreditCard className="w-3 h-3" />Debit</span>;
  if (m === "qris") return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}><ReceiptText className="w-3 h-3" />QRIS</span>;
  if (m === "transfer") return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}><CreditCard className="w-3 h-3" />Transfer</span>;

  return <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>{methodLabel(method)}</span>;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      patientName: "Intan Nuraeini",
      visitNumber: "KJ-2025-001",
      totalBill: 250000,
      paymentMethod: "cash",
      amountPaid: 300000,
      change: 50000,
      note: "Lunas",
      createdAt: "2025-12-01T10:20:00",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  /* =======================
     FILTER
  ======================= */
  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.patientName.toLowerCase().includes(q) ||
        p.visitNumber.toLowerCase().includes(q)
    );
  }, [search, payments]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));

  const displayedPayments = filteredPayments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =======================
     TOTAL
  ======================= */
  const total = useMemo(() => {
    return filteredPayments.reduce(
      (acc, p) => {
        acc.totalBill += p.totalBill;
        acc.amountPaid += p.amountPaid;
        acc.change += p.change;
        return acc;
      },
      { totalBill: 0, amountPaid: 0, change: 0 }
    );
  }, [filteredPayments]);

  /* =======================
     SAVE PEMBAYARAN
  ======================= */
  const handleSavePayment = (data: PaymentForm) => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      patientName: data.visitId, // sementara dari input (nanti mapping dari visit)
      visitNumber: data.visitId,
      totalBill: data.totalTagihan,
      paymentMethod: data.metode,
      amountPaid: data.jumlahBayar,
      change: Math.max(data.jumlahBayar - data.totalTagihan, 0),
      note: data.catatan,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setShowModal(false);
    setPage(1);
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFF5F7] via-white to-white">
      <DoctorNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-10 pt-6">
        {/* HERO HEADER */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              Pembayaran Klinik
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
              Data Pembayaran
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Kelola transaksi pembayaran pasien dengan ringkas dan rapi.
            </p>
          </div>

          <Button
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold shadow-md rounded-xl"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pembayaran
          </Button>
        </div>

        {/* TOOLBAR */}
        <Card className="rounded-2xl border-pink-100 shadow-sm mb-5">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* SEARCH */}
            <div className="relative w-full md:max-w-md mt-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <Input
                placeholder="Cari nama pasien / nomor kunjungan"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 border-pink-200 focus-visible:ring-pink-200 rounded-xl bg-white"
              />
            </div>

            {/* INFO */}
            <div className="text-xs text-gray-500">
              Menampilkan <b className="text-gray-700">{filteredPayments.length}</b> transaksi
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="rounded-2xl border-pink-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-linear-to-r from-pink-100 to-rose-50">
                <tr>
                  {[
                    "TANGGAL",
                    "PASIEN",
                    "NO KUNJUNGAN",
                    "TOTAL TAGIHAN",
                    "METODE",
                    "JUMLAH BAYAR",
                    "KEMBALIAN",
                    "CATATAN",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-pink-100">
                {displayedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                      Tidak ada data pembayaran untuk filter saat ini.
                    </td>
                  </tr>
                ) : (
                  displayedPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-pink-50/60 transition">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {p.patientName}
                      </td>

                      <td className="px-4 py-3 text-gray-700">{p.visitNumber}</td>

                      <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.totalBill)}
                      </td>

                      <td className="px-4 py-3">
                        <MethodBadge method={p.paymentMethod} />
                      </td>

                      <td className="px-4 py-3 text-right text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.amountPaid)}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.change)}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {p.note || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-gray-800">
                    TOTAL
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(total.totalBill)}
                  </td>
                  <td />
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(total.amountPaid)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(total.change)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-white">
            <div className="text-xs text-gray-500">
              Page <b className="text-gray-700">{page}</b> of{" "}
              <b className="text-gray-700">{totalPages}</b>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* MODAL INPUT PEMBAYARAN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-full max-w-3xl">
            <InputPembayaran
              onSave={handleSavePayment}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
