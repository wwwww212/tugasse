"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { STATUS_FLOW } from "@/lib/proto/data"
import { PageHeader, Panel, ScrollTable, StatusBadge, WarnBadge } from "../bits"
import { useStore } from "../store"

export function WoList() {
  const { wos, majuStatusWO, go, role } = useStore()

  return (
    <>
      <PageHeader
        tag={role === "admin" ? "Admin • Work Order" : "Mekanik • Work Order"}
        title="Daftar Work Order Aktif"
        desc="Ubah status progres dengan satu klik, atau buka WO untuk mengisi diagnosa dan sparepart."
      />

      <Panel bodyClassName="p-0">
        <ScrollTable>
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead>No. WO</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Mekanik</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wos.map((w) => {
                const idx = STATUS_FLOW.indexOf(w.status)
                const next = STATUS_FLOW[idx + 1]
                return (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-xs">{w.id}</TableCell>
                    <TableCell>
                      <p className="font-medium">{w.nopol}</p>
                      <p className="text-xs text-neutral-700">{w.kendaraan}</p>
                    </TableCell>
                    <TableCell>
                      <p>{w.jenis}</p>
                      {w.approval === "menunggu" && (
                        <WarnBadge>Menunggu Persetujuan</WarnBadge>
                      )}
                      {w.approval === "disetujui" && (
                        <span className="text-xs text-neutral-700">Estimasi disetujui</span>
                      )}
                      {w.approval === "ditolak" && (
                        <span className="text-xs text-neutral-700">Estimasi ditolak</span>
                      )}
                    </TableCell>
                    <TableCell>{w.mekanik}</TableCell>
                    <TableCell>
                      <StatusBadge status={w.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!next}
                          onClick={() => majuStatusWO(w.id)}
                        >
                          {next ? `Ubah → ${next}` : "Selesai"}
                        </Button>
                        <Button size="sm" onClick={() => go("wo-detail", { woId: w.id })}>
                          Buka <ArrowRight data-icon="inline-end" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollTable>
      </Panel>

      {role === "admin" && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => go("pembayaran")}>
            Lanjut ke Pembayaran
          </Button>
        </div>
      )}
    </>
  )
}
