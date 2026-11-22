"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { STATUS_FLOW } from "@/lib/proto/data"
import { Field, NativeSelect, PageHeader, Panel, ScrollTable, StatusBadge } from "../bits"
import { useStore } from "../store"

export function Antrean() {
  const { antrean, tambahAntrean, majuStatusAntrean, go } = useStore()
  const [open, setOpen] = useState(false)
  const [nopol, setNopol] = useState("")
  const [kendaraan, setKendaraan] = useState("")
  const [keluhan, setKeluhan] = useState("")
  const [jenis, setJenis] = useState<"Servis Rutin" | "Servis Khusus">("Servis Rutin")

  const aktif = antrean.filter((a) => a.status !== "Diambil").length

  function simpan() {
    if (!nopol.trim()) return
    tambahAntrean({
      nopol: nopol.toUpperCase(),
      kendaraan: kendaraan || "Kendaraan baru",
      keluhan: keluhan || "-",
      jenis,
    })
    setNopol("")
    setKendaraan("")
    setKeluhan("")
    setJenis("Servis Rutin")
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        tag="Admin • Kedatangan"
        title="Antrean Kedatangan Hari Ini"
        desc={`${antrean.length} kendaraan tercatat, ${aktif} masih aktif. Klik tombol status untuk memajukan progres.`}
        actions={
          <>
            <Button variant="outline" onClick={() => go("registrasi")}>
              Registrasi Pelanggan Baru
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus data-icon="inline-start" /> Catat Kedatangan
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {STATUS_FLOW.map((s) => (
          <span key={s} className="flex items-center gap-1.5 rounded-sm border border-neutral-300 bg-white px-2 py-1">
            <StatusBadge status={s} />
            <span className="tabular-nums font-medium">
              {antrean.filter((a) => a.status === s).length}
            </span>
          </span>
        ))}
      </div>

      <Panel bodyClassName="p-0">
        <ScrollTable>
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead>No. Antrean</TableHead>
                <TableHead>Nopol</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Jenis Servis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {antrean.map((a) => (
                <TableRow key={a.no}>
                  <TableCell className="font-mono text-xs">{a.no}</TableCell>
                  <TableCell className="font-medium">{a.nopol}</TableCell>
                  <TableCell>{a.kendaraan}</TableCell>
                  <TableCell className="max-w-56 whitespace-normal text-neutral-600">{a.keluhan}</TableCell>
                  <TableCell>{a.jenis}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={a.status === "Diambil"}
                      onClick={() => majuStatusAntrean(a.no)}
                    >
                      {a.status === "Diambil" ? "Selesai" : "Majukan Status"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Kedatangan Kendaraan</DialogTitle>
            <DialogDescription>Nomor antrean dibuat otomatis dengan status Menunggu.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Field label="Nomor Polisi">
              <Input placeholder="mis. B 1234 XYZ" value={nopol} onChange={(e) => setNopol(e.target.value)} />
            </Field>
            <Field label="Kendaraan">
              <Input placeholder="mis. Honda Beat 2019" value={kendaraan} onChange={(e) => setKendaraan(e.target.value)} />
            </Field>
            <Field label="Keluhan">
              <Textarea placeholder="Tuliskan keluhan pelanggan" value={keluhan} onChange={(e) => setKeluhan(e.target.value)} />
            </Field>
            <Field label="Jenis Servis">
              <NativeSelect value={jenis} onChange={(e) => setJenis(e.target.value as typeof jenis)}>
                <option>Servis Rutin</option>
                <option>Servis Khusus</option>
              </NativeSelect>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={simpan} disabled={!nopol.trim()}>
              Simpan Kedatangan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
