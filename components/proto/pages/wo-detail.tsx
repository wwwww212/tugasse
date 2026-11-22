"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PAKET, rupiah, type WO } from "@/lib/proto/data"
import { cn } from "@/lib/utils"
import { Field, NativeSelect, Notice, PageHeader, Panel, ScrollTable, StatusBadge, WarnBadge } from "../bits"
import { useStore } from "../store"

export function WoDetail() {
  const { wos, woId, setWoId, go, role } = useStore()
  const wo = wos.find((w) => w.id === woId) ?? wos[0]

  return (
    <>
      <PageHeader
        tag={role === "admin" ? "Admin • Detail WO" : "Mekanik • Diagnosa & Servis"}
        title={`${wo.id} — ${wo.nopol}`}
        desc={`${wo.kendaraan} • Pelanggan: ${wo.pelanggan} • Keluhan: ${wo.keluhan}`}
        actions={
          <Button variant="outline" onClick={() => go("wo")}>
            <ArrowLeft data-icon="inline-start" /> Daftar WO
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 rounded-md border border-neutral-300 bg-neutral-50 p-3 sm:flex-row sm:items-end">
        <Field label="Pilih Work Order" className="sm:w-72">
          <NativeSelect value={wo.id} onChange={(e) => setWoId(e.target.value)}>
            {wos.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} • {w.nopol} • {w.jenis}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className="flex items-center gap-2 pb-1 text-sm">
          <span className="text-neutral-700">Status:</span>
          <StatusBadge status={wo.status} />
          {wo.approval === "menunggu" && <WarnBadge>Menunggu Persetujuan Pelanggan</WarnBadge>}
        </div>
      </div>

      <Tabs defaultValue={wo.jenis === "Servis Rutin" ? "rutin" : "khusus"} key={wo.id}>
        <TabsList className="h-auto w-full flex-wrap justify-start sm:w-fit">
          <TabsTrigger value="rutin">Servis Rutin</TabsTrigger>
          <TabsTrigger value="khusus">Servis Khusus</TabsTrigger>
          <TabsTrigger value="sparepart">Pemakaian Sparepart</TabsTrigger>
        </TabsList>
        <TabsContent value="rutin" className="mt-3">
          <ServisRutin wo={wo} />
        </TabsContent>
        <TabsContent value="khusus" className="mt-3">
          <ServisKhusus wo={wo} />
        </TabsContent>
        <TabsContent value="sparepart" className="mt-3">
          <PemakaianSparepart wo={wo} />
        </TabsContent>
      </Tabs>
    </>
  )
}

/* ---------------- Servis Rutin ---------------- */
function ServisRutin({ wo }: { wo: WO }) {
  const { updateWO } = useStore()
  const defaultJenis = /nmax|vario|beat|honda beat|yamaha/i.test(wo.kendaraan) ? "Motor" : "Mobil"
  const [jenis, setJenis] = useState<"Motor" | "Mobil">(defaultJenis)
  const daftar = PAKET.filter((p) => p.kendaraan === jenis)
  const [paketId, setPaketId] = useState(daftar[0].id)
  const paket = PAKET.find((p) => p.id === paketId) ?? daftar[0]
  const [km, setKm] = useState(jenis === "Motor" ? 12300 : 78450)
  const [centang, setCentang] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  function pilihJenis(j: "Motor" | "Mobil") {
    setJenis(j)
    setPaketId(PAKET.find((p) => p.kendaraan === j)!.id)
    setCentang({})
    setSaved(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel title="Checklist Paket Servis Rutin">
        <div className="mb-4 flex gap-2" role="group" aria-label="Jenis kendaraan">
          {(["Motor", "Mobil"] as const).map((j) => (
            <Button key={j} size="sm" variant={jenis === j ? "default" : "outline"} aria-pressed={jenis === j} onClick={() => pilihJenis(j)}>
              {j}
            </Button>
          ))}
        </div>

        <fieldset className="mb-5 grid gap-2 sm:grid-cols-2">
          <legend className="mb-2 text-xs font-medium text-neutral-700">Pilih Paket</legend>
          {daftar.map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm",
                paketId === p.id ? "border-2 border-neutral-900 bg-neutral-50" : "border-neutral-400",
              )}
            >
              <input
                type="radio"
                name="paket"
                className="mt-1 accent-neutral-900"
                checked={paketId === p.id}
                onChange={() => {
                  setPaketId(p.id)
                  setCentang({})
                }}
              />
              <span>
                <span className="block font-medium">{p.nama}</span>
                <span className="text-xs text-neutral-600">{rupiah(p.harga)}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-medium text-neutral-700">
            Checklist Pengerjaan ({Object.values(centang).filter(Boolean).length}/{paket.checklist.length})
          </legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {paket.checklist.map((c) => (
              <li key={c}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-neutral-900"
                    checked={!!centang[c]}
                    onChange={(e) => setCentang((s) => ({ ...s, [c]: e.target.checked }))}
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Ringkasan Biaya & Jadwal">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-700">Harga standar</dt>
              <dd className="font-semibold tabular-nums">{rupiah(paket.harga)}</dd>
            </div>
            <Field label="Kilometer saat ini">
              <Input type="number" inputMode="numeric" value={km} onChange={(e) => setKm(Number(e.target.value))} />
            </Field>
            <div className="flex justify-between gap-2 border-t border-dashed border-neutral-300 pt-3">
              <dt className="text-neutral-700">Estimasi servis berikutnya</dt>
              <dd className="font-semibold tabular-nums">
                {(km + paket.intervalKm).toLocaleString("id-ID")} km
              </dd>
            </div>
          </dl>
        </Panel>
        {saved && <Notice>Servis rutin disimpan ke {wo.id} (simulasi).</Notice>}
        <Button
          onClick={() => {
            updateWO(wo.id, { jenis: "Servis Rutin", biayaJasa: paket.harga })
            setSaved(true)
          }}
        >
          Simpan Servis Rutin
        </Button>
      </div>
    </div>
  )
}

/* ---------------- Servis Khusus ---------------- */
function ServisKhusus({ wo }: { wo: WO }) {
  const { updateWO, setApproval } = useStore()
  const [komponen, setKomponen] = useState(wo.estimasi[0]?.item ?? "")
  const [diagnosa, setDiagnosa] = useState(wo.temuan.join("\n"))
  const [biaya, setBiaya] = useState(wo.estimasi.reduce((s, e) => s + e.biaya, 0) || 0)
  const [durasi, setDurasi] = useState(wo.durasi)
  const [sent, setSent] = useState(false)

  function kirim() {
    const temuan = diagnosa.split("\n").map((t) => t.trim()).filter(Boolean)
    updateWO(wo.id, {
      jenis: "Servis Khusus",
      temuan,
      durasi,
      estimasi:
        wo.estimasi.length > 0 && biaya === wo.estimasi.reduce((s, e) => s + e.biaya, 0)
          ? wo.estimasi
          : [{ item: komponen || "Perbaikan komponen", biaya }],
    })
    setApproval(wo.id, "menunggu")
    setSent(true)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel title="Hasil Diagnosa Kerusakan">
        <div className="grid gap-4">
          <Field label="Komponen Rusak">
            <NativeSelect value={komponen} onChange={(e) => setKomponen(e.target.value)}>
              <option value="">Pilih komponen…</option>
              <option>Kampas rem depan (set)</option>
              <option>Cakram rem</option>
              <option>Kompresor AC</option>
              <option>Aki</option>
              <option>Shockbreaker</option>
              <option>Lainnya</option>
            </NativeSelect>
          </Field>
          <Field label="Temuan / Hasil Diagnosa" hint="Satu temuan per baris. Akan tampil di portal pelanggan.">
            <Textarea rows={6} value={diagnosa} onChange={(e) => setDiagnosa(e.target.value)} placeholder="mis. Kampas rem depan aus tinggal 1 mm" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estimasi Biaya (Rp)">
              <Input type="number" inputMode="numeric" value={biaya} onChange={(e) => setBiaya(Number(e.target.value))} />
            </Field>
            <Field label="Estimasi Durasi">
              <Input value={durasi} onChange={(e) => setDurasi(e.target.value)} placeholder="mis. 1 hari kerja" />
            </Field>
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Status Persetujuan">
          <div className="flex flex-col gap-3 text-sm">
            <p className="tabular-nums text-xl font-semibold">{rupiah(biaya)}</p>
            <div>
              {wo.approval === "none" && <span className="text-neutral-700">Belum dikirim ke pelanggan</span>}
              {wo.approval === "menunggu" && <WarnBadge>Menunggu Persetujuan Pelanggan</WarnBadge>}
              {wo.approval === "disetujui" && <span className="font-medium">Disetujui pelanggan ✓</span>}
              {wo.approval === "ditolak" && <span className="font-medium">Ditolak pelanggan</span>}
            </div>
          </div>
        </Panel>
        {sent && <Notice>Estimasi terkirim. Buka role Pelanggan untuk menyetujui atau menolak.</Notice>}
        <Button onClick={kirim} disabled={!diagnosa.trim() || biaya <= 0}>
          Kirim Estimasi ke Pelanggan
        </Button>
      </div>
    </div>
  )
}

/* ---------------- Sparepart ---------------- */
function PemakaianSparepart({ wo }: { wo: WO }) {
  const { spareparts, pakaiSparepart } = useStore()
  const [spId, setSpId] = useState(spareparts[0].id)
  const [qty, setQty] = useState(1)
  const sp = spareparts.find((s) => s.id === spId)!
  const total = wo.parts.reduce((s, p) => {
    const x = spareparts.find((i) => i.id === p.sparepartId)
    return s + (x ? x.harga * p.qty : 0)
  }, 0)

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <Panel title="Input Pemakaian Sparepart">
        <div className="flex flex-col gap-4">
          <Field label="Sparepart">
            <NativeSelect value={spId} onChange={(e) => setSpId(e.target.value)}>
              {spareparts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} (stok {s.stok})
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Jumlah dipakai" hint={`Stok tersedia: ${sp.stok} ${sp.satuan} • ${rupiah(sp.harga)} / ${sp.satuan}`}>
            <Input type="number" inputMode="numeric" min={1} max={sp.stok} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
          </Field>
          <Button
            disabled={qty > sp.stok || sp.stok === 0}
            onClick={() => {
              pakaiSparepart(wo.id, spId, qty)
              setQty(1)
            }}
          >
            <Plus data-icon="inline-start" /> Tambah ke WO
          </Button>
          {qty > sp.stok && <p className="text-xs font-medium text-neutral-900">Jumlah melebihi stok tersedia.</p>}
        </div>
      </Panel>

      <Panel title={`Sparepart Terpakai di ${wo.id}`} bodyClassName="p-0">
        <ScrollTable>
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead>Sparepart</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wo.parts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-neutral-700">
                    Belum ada sparepart dipakai.
                  </TableCell>
                </TableRow>
              )}
              {wo.parts.map((p) => {
                const x = spareparts.find((s) => s.id === p.sparepartId)!
                return (
                  <TableRow key={p.sparepartId}>
                    <TableCell>{x.nama}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.qty} {x.satuan}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(x.harga * p.qty)}</TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-neutral-50 font-semibold">
                <TableCell colSpan={2}>Total Sparepart</TableCell>
                <TableCell className="text-right tabular-nums">{rupiah(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollTable>
      </Panel>
    </div>
  )
}
