"use client"

import { useState } from "react"
import { ArrowDownUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ALAT, BARANG_HABIS, rupiah, type Sparepart } from "@/lib/proto/data"
import { Field, NativeSelect, PageHeader, Panel, ScrollTable, WarnBadge } from "../bits"
import { useStore } from "../store"

export function Stok() {
  const { spareparts, ubahStok, role } = useStore()
  const [target, setTarget] = useState<Sparepart | null>(null)
  const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk")
  const [jumlah, setJumlah] = useState(1)
  const [filter, setFilter] = useState<"Semua" | "Motor" | "Mobil">("Semua")

  const menipis = spareparts.filter((s) => s.stok <= s.min).length
  const daftar = spareparts.filter((s) => filter === "Semua" || s.kendaraan === filter)

  function simpan() {
    if (!target) return
    ubahStok(target.id, tipe === "masuk" ? jumlah : -jumlah)
    setTarget(null)
    setJumlah(1)
    setTipe("masuk")
  }

  return (
    <>
      <PageHeader
        tag={role === "pemilik" ? "Pemilik • Stok" : "Admin • Stok"}
        title="Stok Sparepart & Peralatan"
        desc={`${menipis} item sparepart berada di bawah atau sama dengan batas minimum.`}
      />

      <Tabs defaultValue="sparepart">
        <TabsList className="h-auto w-full justify-start sm:w-fit">
          <TabsTrigger value="sparepart">Stok Sparepart</TabsTrigger>
          <TabsTrigger value="peralatan">Peralatan Bengkel</TabsTrigger>
        </TabsList>

        <TabsContent value="sparepart" className="mt-3 flex flex-col gap-3">
          <div className="flex gap-1.5" role="group" aria-label="Filter kendaraan">
            {(["Semua", "Motor", "Mobil"] as const).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Button>
            ))}
          </div>
          <Panel bodyClassName="p-0">
            <ScrollTable>
              <Table>
                <TableHeader className="bg-neutral-100">
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Sparepart</TableHead>
                    <TableHead>Untuk</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Batas Min.</TableHead>
                    <TableHead>Peringatan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daftar.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.nama}</TableCell>
                      <TableCell>{s.kendaraan}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {s.stok} {s.satuan}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{s.min}</TableCell>
                      <TableCell>{s.stok <= s.min && <WarnBadge>Stok Menipis</WarnBadge>}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setTarget(s)}>
                          <ArrowDownUp data-icon="inline-start" /> Masuk / Keluar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollTable>
          </Panel>
        </TabsContent>

        <TabsContent value="peralatan" className="mt-3 grid gap-5 xl:grid-cols-2">
          <Panel title="Peralatan Dipakai Ulang" desc="Aset yang dikembalikan setelah dipakai" bodyClassName="p-0">
            <ScrollTable>
              <Table>
                <TableHeader className="bg-neutral-100">
                  <TableRow>
                    <TableHead>Alat</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-right">Jml</TableHead>
                    <TableHead>Kondisi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ALAT.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.nama}</TableCell>
                      <TableCell>{a.lokasi}</TableCell>
                      <TableCell className="text-right tabular-nums">{a.jumlah}</TableCell>
                      <TableCell>{a.kondisi === "Baik" ? a.kondisi : <WarnBadge>{a.kondisi}</WarnBadge>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollTable>
          </Panel>

          <Panel title="Barang Habis Pakai" desc="Dikonsumsi saat pengerjaan" bodyClassName="p-0">
            <ScrollTable>
              <Table>
                <TableHeader className="bg-neutral-100">
                  <TableRow>
                    <TableHead>Barang</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Min.</TableHead>
                    <TableHead>Peringatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BARANG_HABIS.map((b) => (
                    <TableRow key={b.nama}>
                      <TableCell className="font-medium">{b.nama}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {b.stok} {b.satuan}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{b.min}</TableCell>
                      <TableCell>{b.stok <= b.min && <WarnBadge>Stok Menipis</WarnBadge>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollTable>
          </Panel>
        </TabsContent>
      </Tabs>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          {target && (
            <>
              <DialogHeader>
                <DialogTitle>Stok Masuk / Keluar</DialogTitle>
                <DialogDescription>
                  {target.nama} — stok saat ini {target.stok} {target.satuan} ({rupiah(target.harga)})
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Field label="Jenis Transaksi">
                  <NativeSelect value={tipe} onChange={(e) => setTipe(e.target.value as typeof tipe)}>
                    <option value="masuk">Stok Masuk (pembelian)</option>
                    <option value="keluar">Stok Keluar (rusak / koreksi)</option>
                  </NativeSelect>
                </Field>
                <Field label="Jumlah">
                  <Input type="number" inputMode="numeric" min={1} value={jumlah} onChange={(e) => setJumlah(Math.max(1, Number(e.target.value)))} />
                </Field>
                <Field label="Catatan">
                  <Input placeholder="mis. Pembelian dari supplier" />
                </Field>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTarget(null)}>
                  Batal
                </Button>
                <Button onClick={simpan}>Simpan</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
