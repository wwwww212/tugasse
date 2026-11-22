"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KENDARAAN_SAYA, STATUS_FLOW, rupiah } from "@/lib/proto/data"
import { cn } from "@/lib/utils"
import { NativeSelect, Notice, PageHeader, Panel, StatusBadge, WarnBadge } from "../bits"
import { useStore } from "../store"

export function KendaraanSaya() {
  const { go, wos } = useStore()

  return (
    <>
      <PageHeader
        tag="Pelanggan • Kendaraan"
        title="Kendaraan Saya"
        desc="Halo, Budi Santoso. Berikut kendaraan yang terdaftar atas akun Anda."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {KENDARAAN_SAYA.map((k) => {
          const wo = wos.find((w) => w.id === k.woId)
          return (
            <Panel key={k.id} title={k.nopol} desc={k.nama} actions={wo && <StatusBadge status={wo.status} />}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-neutral-700">Jenis</dt>
                <dd>{k.jenis}</dd>
                <dt className="text-neutral-700">Kilometer</dt>
                <dd className="tabular-nums">{k.km.toLocaleString("id-ID")} km</dd>
                <dt className="text-neutral-700">Pemilik BPKB</dt>
                <dd className="font-medium">{k.bpkbNama}</dd>
                <dt className="text-neutral-700">No. BPKB</dt>
                <dd className="font-mono text-xs">{k.bpkbNo}</dd>
              </dl>

              <h3 className="mb-2 mt-5 text-sm font-semibold">Riwayat Kedatangan</h3>
              <ol className="relative flex flex-col gap-3 border-l border-dashed border-neutral-400 pl-4">
                {k.riwayat.map((r) => (
                  <li key={r.tgl + r.ket} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border border-neutral-600 bg-white" />
                    <p className="text-xs text-neutral-700">{r.tgl}</p>
                    <p>{r.ket}</p>
                  </li>
                ))}
              </ol>

              <Button className="mt-5 w-full sm:w-auto" onClick={() => go("progres", { woId: k.woId })}>
                Lihat Progres Servis
              </Button>
            </Panel>
          )
        })}
      </div>
    </>
  )
}

export function ProgresServis() {
  const { wos, woId, setWoId, setApproval } = useStore()
  const milik = KENDARAAN_SAYA.map((k) => k.woId)
  const daftar = wos.filter((w) => milik.includes(w.id))
  const wo = daftar.find((w) => w.id === woId) ?? daftar[0]
  const stepIdx = STATUS_FLOW.indexOf(wo.status)
  const totalEstimasi = wo.estimasi.reduce((s, e) => s + e.biaya, 0)

  return (
    <>
      <PageHeader
        tag="Pelanggan • Progres"
        title={`Progres Servis ${wo.nopol}`}
        desc={`${wo.kendaraan} • ${wo.id} • Mekanik: ${wo.mekanik}`}
        actions={
          <NativeSelect
            aria-label="Pilih kendaraan"
            value={wo.id}
            onChange={(e) => setWoId(e.target.value)}
            className="w-full sm:w-64"
          >
            {daftar.map((w) => (
              <option key={w.id} value={w.id}>
                {w.nopol} — {w.kendaraan}
              </option>
            ))}
          </NativeSelect>
        }
      />

      <Panel title="Status Pengerjaan" className="mb-5">
        <ol className="grid grid-cols-5 gap-1 sm:gap-2" aria-label="Tahapan servis">
          {STATUS_FLOW.map((s, i) => {
            const done = i < stepIdx
            const current = i === stepIdx
            return (
              <li key={s} className="flex flex-col items-center gap-2 text-center" aria-current={current ? "step" : undefined}>
                <div className="flex w-full items-center">
                  <span className={cn("h-px flex-1", i === 0 ? "bg-transparent" : done || current ? "bg-neutral-900" : "bg-neutral-300")} />
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                      done && "border-neutral-900 bg-neutral-900 text-white",
                      current && "border-neutral-900 bg-white text-neutral-900 ring-4 ring-neutral-200",
                      !done && !current && "border-neutral-300 text-neutral-600",
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden /> : i + 1}
                  </span>
                  <span className={cn("h-px flex-1", i === STATUS_FLOW.length - 1 ? "bg-transparent" : done ? "bg-neutral-900" : "bg-neutral-300")} />
                </div>
                <span className={cn("text-[11px] leading-tight sm:text-xs", current ? "font-semibold text-neutral-900" : "text-neutral-700")}>
                  {s}
                </span>
              </li>
            )
          })}
        </ol>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Temuan Kerusakan">
          {wo.temuan.length === 0 ? (
            <p className="text-sm text-neutral-700">Belum ada temuan. Mekanik sedang memeriksa kendaraan.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {wo.temuan.map((t) => (
                <li key={t} className="flex gap-2 rounded-md border border-neutral-300 px-3 py-2">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-700" />
                  {t}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Estimasi Biaya Servis Khusus" actions={wo.approval === "menunggu" ? <WarnBadge>Menunggu Persetujuan</WarnBadge> : undefined}>
          {wo.estimasi.length === 0 ? (
            <p className="text-sm text-neutral-700">
              {wo.jenis === "Servis Rutin"
                ? "Servis rutin memakai harga standar paket, tidak perlu persetujuan estimasi."
                : "Estimasi belum dikirim oleh mekanik."}
            </p>
          ) : (
            <>
              <ul className="flex flex-col text-sm">
                {wo.estimasi.map((e) => (
                  <li key={e.item} className="flex justify-between gap-3 border-b border-dashed border-neutral-300 py-2">
                    <span>{e.item}</span>
                    <span className="tabular-nums">{rupiah(e.biaya)}</span>
                  </li>
                ))}
                <li className="flex justify-between gap-3 py-2 font-semibold">
                  <span>Total estimasi</span>
                  <span className="tabular-nums">{rupiah(totalEstimasi)}</span>
                </li>
              </ul>
              <p className="mb-4 text-xs text-neutral-700">Estimasi durasi: {wo.durasi || "-"}</p>

              {wo.approval === "menunggu" && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" onClick={() => setApproval(wo.id, "disetujui")}>
                    Setujui Estimasi
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => setApproval(wo.id, "ditolak")}>
                    Tolak
                  </Button>
                </div>
              )}
              {wo.approval === "disetujui" && <Notice>Anda menyetujui estimasi ini. Pengerjaan dilanjutkan oleh mekanik.</Notice>}
              {wo.approval === "ditolak" && (
                <div className="flex flex-col gap-2">
                  <Notice>Anda menolak estimasi. Bengkel akan menghubungi Anda.</Notice>
                  <Button variant="outline" onClick={() => setApproval(wo.id, "menunggu")}>
                    Batalkan Penolakan
                  </Button>
                </div>
              )}
            </>
          )}
        </Panel>
      </div>
    </>
  )
}
