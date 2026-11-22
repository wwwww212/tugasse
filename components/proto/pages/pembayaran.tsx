"use client"

import { useState } from "react"
import { Banknote, CheckCircle2, QrCode, Landmark, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { rupiah } from "@/lib/proto/data"
import { cn } from "@/lib/utils"
import { Field, NativeSelect, Notice, PageHeader, Panel, Placeholder, ScrollTable } from "../bits"
import { useStore } from "../store"

const METODE = [
  { id: "Tunai", icon: Banknote },
  { id: "QRIS", icon: QrCode },
  { id: "Transfer", icon: Landmark },
] as const

export function Pembayaran() {
  const { wos, spareparts, role } = useStore()
  const [woId, setWoId] = useState(wos[0].id)
  const [metode, setMetode] = useState<(typeof METODE)[number]["id"]>("Tunai")
  const [lunas, setLunas] = useState(false)
  const readOnly = role === "pemilik"

  const wo = wos.find((w) => w.id === woId) ?? wos[0]
  const baris = wo.parts.map((p) => {
    const s = spareparts.find((x) => x.id === p.sparepartId)!
    return { nama: s.nama, qty: p.qty, harga: s.harga, sub: s.harga * p.qty }
  })
  const totalPart = baris.reduce((a, b) => a + b.sub, 0)
  const total = wo.biayaJasa + totalPart

  return (
    <>
      <PageHeader
        tag={readOnly ? "Pemilik • Pembayaran (lihat)" : "Admin • Kasir"}
        title="Pembayaran Servis"
        desc="Rincian biaya jasa dan sparepart, pilih metode pembayaran, lalu konfirmasi untuk mencetak struk."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          <Panel title="Pilih Work Order">
            <Field label="Work Order">
              <NativeSelect
                value={woId}
                onChange={(e) => {
                  setWoId(e.target.value)
                  setLunas(false)
                }}
              >
                {wos.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.id} • {w.nopol} • {w.pelanggan}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </Panel>

          <Panel title="Rincian Biaya" bodyClassName="p-0">
            <ScrollTable>
              <Table>
                <TableHeader className="bg-neutral-100">
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Biaya jasa ({wo.jenis})</TableCell>
                    <TableCell className="text-right tabular-nums">1</TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(wo.biayaJasa)}</TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(wo.biayaJasa)}</TableCell>
                  </TableRow>
                  {baris.map((b) => (
                    <TableRow key={b.nama}>
                      <TableCell>{b.nama}</TableCell>
                      <TableCell className="text-right tabular-nums">{b.qty}</TableCell>
                      <TableCell className="text-right tabular-nums">{rupiah(b.harga)}</TableCell>
                      <TableCell className="text-right tabular-nums">{rupiah(b.sub)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-neutral-50 text-base font-semibold">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollTable>
          </Panel>

          <Panel title="Metode Pembayaran">
            <div role="radiogroup" aria-label="Metode pembayaran" className="grid gap-3 sm:grid-cols-3">
              {METODE.map(({ id, icon: Icon }) => (
                <label
                  key={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium",
                    metode === id ? "border-2 border-neutral-900 bg-neutral-50" : "border-neutral-400",
                  )}
                >
                  <input
                    type="radio"
                    name="metode"
                    className="sr-only"
                    checked={metode === id}
                    onChange={() => setMetode(id)}
                  />
                  <Icon className="size-5" aria-hidden />
                  {id}
                </label>
              ))}
            </div>
            {metode === "QRIS" && (
              <div className="mt-4 flex items-center gap-4">
                <Placeholder className="size-28" label="QR" />
                <p className="text-sm text-neutral-600">Pelanggan memindai QRIS lalu admin menekan konfirmasi.</p>
              </div>
            )}
            {metode === "Transfer" && (
              <p className="mt-4 rounded-md border border-dashed border-neutral-400 p-3 text-sm text-neutral-600">
                Bank XYZ • 1234-5678-90 • a.n. Bengkel Maju Jaya
              </p>
            )}
            <div className="mt-5 flex flex-col gap-3">
              {lunas && <Notice>Pembayaran {rupiah(total)} via {metode} terkonfirmasi (simulasi).</Notice>}
              <Button size="lg" disabled={readOnly || lunas || total === 0} onClick={() => setLunas(true)}>
                <CheckCircle2 data-icon="inline-start" /> {lunas ? "Sudah Lunas" : "Konfirmasi Pembayaran"}
              </Button>
              {readOnly && <p className="text-xs text-neutral-700">Role Pemilik hanya dapat melihat. Konfirmasi dilakukan Admin.</p>}
            </div>
          </Panel>
        </div>

        <aside aria-label="Preview struk" className="lg:sticky lg:top-4 lg:self-start">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-700">
            Preview Draft Struk
          </p>
          <div className="relative rounded-md border border-dashed border-neutral-500 bg-white p-4 font-mono text-xs leading-relaxed text-neutral-800">
            <div className="text-center">
              <p className="text-sm font-bold">BENGKEL MAJU JAYA</p>
              <p>Jl. Contoh Raya No. 10</p>
              <p>Telp 0812-0000-0000</p>
            </div>
            <hr className="my-2 border-dashed border-neutral-400" />
            <p>No. WO : {wo.id}</p>
            <p>Nopol  : {wo.nopol}</p>
            <p>Pelanggan: {wo.pelanggan}</p>
            <p>Tanggal: 22/11/2026</p>
            <hr className="my-2 border-dashed border-neutral-400" />
            <div className="flex justify-between gap-2">
              <span>Jasa</span>
              <span>{rupiah(wo.biayaJasa)}</span>
            </div>
            {baris.map((b) => (
              <div key={b.nama} className="flex justify-between gap-2">
                <span className="truncate">
                  {b.qty}x {b.nama}
                </span>
                <span>{rupiah(b.sub)}</span>
              </div>
            ))}
            <hr className="my-2 border-dashed border-neutral-400" />
            <div className="flex justify-between gap-2 text-sm font-bold">
              <span>TOTAL</span>
              <span>{rupiah(total)}</span>
            </div>
            <p className="mt-1">Metode : {metode}</p>
            <p className="font-bold">Status : {lunas ? "LUNAS" : "BELUM DIBAYAR"}</p>
            <hr className="my-2 border-dashed border-neutral-400" />
            <p className="text-center">Terima kasih atas kunjungan Anda</p>
          </div>
          <Button variant="outline" className="mt-3 w-full" disabled={!lunas}>
            <Printer data-icon="inline-start" /> Cetak Struk (draft)
          </Button>
        </aside>
      </div>
    </>
  )
}
