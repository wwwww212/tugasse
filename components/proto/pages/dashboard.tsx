"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LAPORAN_PENDAPATAN,
  LAPORAN_SERVIS,
  PENDAPATAN_BULANAN,
  rupiah,
} from "@/lib/proto/data"
import { PageHeader, Panel, ScrollTable, Stat, StatusBadge, WarnBadge } from "../bits"
import { useStore } from "../store"

export function Dashboard() {
  const { antrean, spareparts } = useStore()
  const aktif = antrean.filter((a) => a.status !== "Diambil").length
  const menipis = spareparts.filter((s) => s.stok <= s.min)
  const maks = Math.max(...PENDAPATAN_BULANAN.map((b) => b.nilai))
  const totalPendapatan = LAPORAN_PENDAPATAN.reduce((s, r) => s + r.jasa + r.sparepart, 0)

  return (
    <>
      <PageHeader
        tag="Pemilik • Dashboard"
        title="Dashboard Pemilik"
        desc="Ringkasan performa bengkel. Data dan grafik masih berupa contoh."
        actions={
          <Button variant="outline">
            <Download data-icon="inline-start" /> Ekspor Laporan
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pendapatan (Nov)" value="Rp 56,0 jt" note="+10,7% dari Okt" />
        <Stat label="Total Servis" value="126" note="Bulan ini" />
        <Stat label="Antrean Aktif" value={String(aktif)} note="Belum diambil" />
        <Stat label="Stok Menipis" value={String(menipis.length)} note="Item perlu restok" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel title="Grafik Pendapatan 6 Bulan (jt Rp)" className="lg:col-span-2">
          <div
            role="img"
            aria-label="Placeholder grafik pendapatan enam bulan terakhir"
            className="flex h-56 items-end gap-2 rounded-md border border-dashed border-neutral-400 bg-neutral-50 px-3 pb-3 pt-6 sm:gap-4"
          >
            {PENDAPATAN_BULANAN.map((b) => (
              <div key={b.bulan} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11px] tabular-nums text-neutral-600">{b.nilai}</span>
                <div
                  className="w-full rounded-t-sm border border-neutral-500 bg-neutral-300"
                  style={{ height: `${(b.nilai / maks) * 100}%` }}
                />
                <span className="text-[11px] text-neutral-700">{b.bulan}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Grafik Jumlah Servis">
          <div
            role="img"
            aria-label="Placeholder grafik jumlah servis"
            className="relative flex h-56 items-center justify-center rounded-md border border-dashed border-neutral-400 bg-neutral-50"
          >
            <svg viewBox="0 0 200 100" className="absolute inset-0 size-full p-4" preserveAspectRatio="none" aria-hidden>
              <polyline
                points="0,80 35,60 70,70 105,40 140,45 175,20 200,25"
                fill="none"
                stroke="#737373"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="relative rounded border border-neutral-300 bg-white px-2 py-0.5 font-mono text-xs text-neutral-700">
              Placeholder grafik
            </span>
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Tabs defaultValue="servis">
          <TabsList className="h-auto w-full flex-wrap justify-start sm:w-fit">
            <TabsTrigger value="servis">Laporan Servis</TabsTrigger>
            <TabsTrigger value="stok">Laporan Stok</TabsTrigger>
            <TabsTrigger value="pendapatan">Laporan Pendapatan</TabsTrigger>
          </TabsList>

          <TabsContent value="servis" className="mt-3">
            <Panel bodyClassName="p-0">
              <ScrollTable>
                <Table>
                  <TableHeader className="bg-neutral-100">
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>No. WO</TableHead>
                      <TableHead>Nopol</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Mekanik</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LAPORAN_SERVIS.map((r) => (
                      <TableRow key={r.wo}>
                        <TableCell>{r.tgl}</TableCell>
                        <TableCell className="font-mono text-xs">{r.wo}</TableCell>
                        <TableCell className="font-medium">{r.nopol}</TableCell>
                        <TableCell>{r.jenis}</TableCell>
                        <TableCell>{r.mekanik}</TableCell>
                        <TableCell>
                          <StatusBadge status={r.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollTable>
            </Panel>
          </TabsContent>

          <TabsContent value="stok" className="mt-3">
            <Panel bodyClassName="p-0">
              <ScrollTable>
                <Table>
                  <TableHeader className="bg-neutral-100">
                    <TableRow>
                      <TableHead>Sparepart</TableHead>
                      <TableHead className="text-right">Stok</TableHead>
                      <TableHead className="text-right">Batas Min.</TableHead>
                      <TableHead className="text-right">Nilai Stok</TableHead>
                      <TableHead>Peringatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spareparts.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.nama}</TableCell>
                        <TableCell className="text-right tabular-nums">{s.stok}</TableCell>
                        <TableCell className="text-right tabular-nums">{s.min}</TableCell>
                        <TableCell className="text-right tabular-nums">{rupiah(s.stok * s.harga)}</TableCell>
                        <TableCell>{s.stok <= s.min && <WarnBadge>Stok Menipis</WarnBadge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollTable>
            </Panel>
          </TabsContent>

          <TabsContent value="pendapatan" className="mt-3">
            <Panel bodyClassName="p-0">
              <ScrollTable>
                <Table>
                  <TableHeader className="bg-neutral-100">
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Jasa</TableHead>
                      <TableHead className="text-right">Sparepart</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Metode Dominan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LAPORAN_PENDAPATAN.map((r) => (
                      <TableRow key={r.tgl}>
                        <TableCell>{r.tgl}</TableCell>
                        <TableCell className="text-right tabular-nums">{rupiah(r.jasa)}</TableCell>
                        <TableCell className="text-right tabular-nums">{rupiah(r.sparepart)}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{rupiah(r.jasa + r.sparepart)}</TableCell>
                        <TableCell>{r.metode}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-neutral-50 font-semibold">
                      <TableCell colSpan={3}>Total 5 hari terakhir</TableCell>
                      <TableCell className="text-right tabular-nums">{rupiah(totalPendapatan)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollTable>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
