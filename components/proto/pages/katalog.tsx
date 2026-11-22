"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ALAT, KATEGORI_ALAT, type Alat, type Kondisi } from "@/lib/proto/data"
import { cn } from "@/lib/utils"
import { PageHeader, Placeholder } from "../bits"
import { useStore } from "../store"

const KONDISI_STYLE: Record<Kondisi, string> = {
  Baik: "border-neutral-500 bg-white text-neutral-800",
  "Perlu Servis": "border-2 border-dashed border-neutral-800 bg-neutral-100 text-neutral-900",
  Rusak: "border-neutral-900 bg-neutral-900 text-white",
}

function KondisiBadge({ kondisi }: { kondisi: Kondisi }) {
  return (
    <Badge variant="outline" className={cn("rounded-sm", KONDISI_STYLE[kondisi])}>
      {kondisi}
    </Badge>
  )
}

export function Katalog() {
  const { role } = useStore()
  const [q, setQ] = useState("")
  const [kat, setKat] = useState<(typeof KATEGORI_ALAT)[number]>("Semua")
  const [pilih, setPilih] = useState<Alat | null>(null)

  const hasil = useMemo(
    () =>
      ALAT.filter(
        (a) =>
          (kat === "Semua" || a.kategori === kat) &&
          a.nama.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [q, kat],
  )

  return (
    <>
      <PageHeader
        tag={role === "mekanik" ? "Mekanik • Panduan alat" : "Publik • Katalog"}
        title="Katalog Alat Bengkel"
        desc={
          role === "mekanik"
            ? "Panduan singkat pemakaian alat untuk mekanik baru. Klik kartu untuk melihat langkah penggunaan."
            : "Peralatan yang kami gunakan untuk menjaga kualitas pengerjaan kendaraan Anda."
        }
      />

      <div className="mb-4 flex flex-col gap-3 rounded-md border border-neutral-300 bg-neutral-50 p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-700" aria-hidden />
          <Input
            aria-label="Cari alat"
            placeholder="Cari nama alat…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter kategori">
          {KATEGORI_ALAT.map((k) => (
            <Button
              key={k}
              size="sm"
              variant={kat === k ? "default" : "outline"}
              aria-pressed={kat === k}
              onClick={() => setKat(k)}
            >
              {k}
            </Button>
          ))}
        </div>
      </div>

      {hasil.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-400 p-10 text-center text-sm text-neutral-700">
          Tidak ada alat yang cocok dengan pencarian.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hasil.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setPilih(a)}
              className="group flex flex-col gap-3 rounded-md border border-neutral-400 bg-white p-3 text-left transition-colors hover:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <Placeholder className="h-28" label="Foto alat" />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-neutral-900">{a.nama}</h3>
                <p className="text-xs text-neutral-700">{a.kategori}</p>
              </div>
              <div className="flex items-center justify-between">
                <KondisiBadge kondisi={a.kondisi} />
                <span className="text-xs text-neutral-700 group-hover:text-neutral-900">Detail →</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!pilih} onOpenChange={(o) => !o && setPilih(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          {pilih && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{pilih.nama}</DialogTitle>
                <DialogDescription>
                  {pilih.kategori} • Lokasi: {pilih.lokasi} • Jumlah: {pilih.jumlah}
                </DialogDescription>
              </DialogHeader>
              <Placeholder className="h-32" label="Foto alat" />
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-neutral-700">Kondisi</dt>
                <dd>
                  <KondisiBadge kondisi={pilih.kondisi} />
                </dd>
                <dt className="text-neutral-700">Fungsi</dt>
                <dd className="text-neutral-800">{pilih.fungsi}</dd>
              </dl>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Cara Penggunaan (Mekanik Baru)</h4>
                <ol className="space-y-1.5 text-sm text-neutral-700">
                  {pilih.langkah.map((l, i) => (
                    <li key={l} className="flex gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-neutral-500 text-[11px] font-medium">
                        {i + 1}
                      </span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <Button variant="outline" onClick={() => setPilih(null)}>
                Tutup
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
