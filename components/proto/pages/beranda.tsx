"use client"

import { Clock, MapPin, Phone, Wrench, Bike, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PAKET, rupiah } from "@/lib/proto/data"
import { Panel, Placeholder } from "../bits"
import { useStore } from "../store"

const JAM = [
  ["Senin – Jumat", "08.00 – 17.00"],
  ["Sabtu", "08.00 – 15.00"],
  ["Minggu & Tanggal Merah", "Tutup"],
]

export function Beranda({ onLogin }: { onLogin: () => void }) {
  const { go } = useStore()

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 rounded-md border border-neutral-400 bg-white p-5 md:grid-cols-2 md:p-8">
        <div className="flex flex-col justify-center gap-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-700">
            [ Hero ]
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-neutral-900 text-balance md:text-4xl">
            Bengkel Motor &amp; Mobil Terpercaya
          </h1>
          <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
            Servis rutin dan perbaikan khusus dengan estimasi biaya transparan. Pantau
            progres kendaraan Anda langsung dari ponsel.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={onLogin}>
              Login / Daftar
            </Button>
            <Button size="lg" variant="outline" onClick={() => go("katalog")}>
              Lihat Katalog Alat
            </Button>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-neutral-700" aria-hidden /> Jl. Contoh Raya No. 10, Kota Anda
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-neutral-700" aria-hidden /> 0812-0000-0000
            </li>
          </ul>
        </div>
        <Placeholder className="min-h-52 md:min-h-72" label="Foto Bengkel" />
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Jam Buka" className="md:col-span-1">
          <ul className="flex flex-col gap-2 text-sm">
            {JAM.map(([hari, jam]) => (
              <li key={hari} className="flex items-center justify-between gap-2 border-b border-dashed border-neutral-300 pb-2 last:border-0 last:pb-0">
                <span className="flex items-center gap-2 text-neutral-700">
                  <Clock className="size-4 text-neutral-700" aria-hidden /> {hari}
                </span>
                <span className="font-medium tabular-nums">{jam}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Layanan Kami" className="md:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Bike, t: "Servis Motor", d: "Matic, bebek, dan sport." },
              { icon: Car, t: "Servis Mobil", d: "Berkala, rem, AC, kelistrikan." },
              { icon: Wrench, t: "Servis Khusus", d: "Diagnosa dengan persetujuan estimasi." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-md border border-neutral-300 p-3">
                <Icon className="mb-2 size-5 text-neutral-700" aria-hidden />
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-xs text-neutral-600">{d}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <section aria-labelledby="paket-title">
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 id="paket-title" className="text-lg font-semibold">
            Paket Servis Rutin
          </h2>
          <span className="font-mono text-[11px] uppercase text-neutral-700">Harga standar</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAKET.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-md border border-neutral-400 bg-white p-4">
              <span className="w-fit rounded-sm border border-neutral-400 px-1.5 py-0.5 font-mono text-[11px] uppercase text-neutral-600">
                {p.kendaraan}
              </span>
              <h3 className="text-sm font-semibold text-neutral-900">{p.nama}</h3>
              <p className="text-xl font-semibold tabular-nums">{rupiah(p.harga)}</p>
              <ul className="flex-1 list-disc space-y-1 pl-4 text-xs text-neutral-600">
                {p.checklist.slice(0, 4).map((c) => (
                  <li key={c}>{c}</li>
                ))}
                <li className="list-none text-neutral-600">+ {p.checklist.length - 4} item lain</li>
              </ul>
              <p className="text-[11px] text-neutral-700">
                Servis berikutnya tiap {p.intervalKm.toLocaleString("id-ID")} km
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
