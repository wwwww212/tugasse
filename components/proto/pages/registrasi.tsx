"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, NativeSelect, Notice, PageHeader, Panel } from "../bits"
import { useStore } from "../store"
import { cn } from "@/lib/utils"

export function Registrasi() {
  const { go } = useStore()
  const [jenis, setJenis] = useState<"Motor" | "Mobil">("Motor")
  const [riwayat, setRiwayat] = useState([{ tahun: "2021", dari: "Hendra Santoso", ke: "Budi Santoso" }])
  const [saved, setSaved] = useState(false)

  return (
    <>
      <PageHeader
        tag="Admin • Registrasi"
        title="Registrasi Pelanggan, Kendaraan & BPKB"
        desc="Draft form pendataan awal. Seluruh isian bersifat contoh dan tidak disimpan ke server."
      />

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
      >
        <Panel title="1. Data Pelanggan">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap">
              <Input placeholder="Nama pelanggan" defaultValue="Budi Santoso" />
            </Field>
            <Field label="No. HP / WhatsApp">
              <Input type="tel" inputMode="tel" placeholder="08xx-xxxx-xxxx" defaultValue="0812-3456-7890" />
            </Field>
            <Field label="Alamat" className="sm:col-span-2">
              <Input placeholder="Alamat singkat (opsional)" />
            </Field>
          </div>
        </Panel>

        <Panel title="2. Data Kendaraan">
          <div className="mb-4 flex gap-2" role="group" aria-label="Jenis kendaraan">
            {(["Motor", "Mobil"] as const).map((j) => (
              <Button
                key={j}
                type="button"
                variant={jenis === j ? "default" : "outline"}
                aria-pressed={jenis === j}
                onClick={() => setJenis(j)}
              >
                {j}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Merek">
              <NativeSelect defaultValue="">
                <option value="" disabled>
                  Pilih merek
                </option>
                {(jenis === "Motor"
                  ? ["Honda", "Yamaha", "Suzuki", "Kawasaki"]
                  : ["Toyota", "Daihatsu", "Honda", "Suzuki", "Mitsubishi"]
                ).map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Tipe / Model">
              <Input placeholder={jenis === "Motor" ? "mis. Vario 125" : "mis. Avanza 1.3 G"} />
            </Field>
            <Field label="Tahun">
              <Input type="number" inputMode="numeric" placeholder="2020" />
            </Field>
            <Field label="Nomor Polisi">
              <Input placeholder="B 1234 XYZ" />
            </Field>
            <Field label="Nomor Rangka">
              <Input placeholder="17 karakter" className="font-mono" />
            </Field>
            <Field label="Nomor Mesin">
              <Input placeholder="Nomor mesin" className="font-mono" />
            </Field>
            <Field label="Kilometer Saat Ini">
              <Input type="number" inputMode="numeric" placeholder="0" />
            </Field>
          </div>
        </Panel>

        <Panel title="3. Data BPKB" desc="Dicatat untuk keperluan verifikasi kepemilikan.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Pemilik BPKB">
              <Input placeholder="Sesuai BPKB" defaultValue="Hendra Santoso" />
            </Field>
            <Field label="Nomor BPKB">
              <Input placeholder="mis. R-1234567-AB" className="font-mono" />
            </Field>
            <Field label="Hubungan Pembawa dengan Pemilik" className="sm:col-span-2">
              <NativeSelect defaultValue="Saudara">
                <option>Pemilik sendiri</option>
                <option>Saudara</option>
                <option>Pasangan</option>
                <option>Karyawan / Sopir</option>
                <option>Lainnya</option>
              </NativeSelect>
            </Field>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Riwayat Ganti Pemilik</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setRiwayat((r) => [...r, { tahun: "", dari: "", ke: "" }])}
              >
                <Plus data-icon="inline-start" /> Tambah Baris
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {riwayat.map((r, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid items-end gap-2 rounded-md border border-dashed border-neutral-400 p-3",
                    "sm:grid-cols-[100px_1fr_1fr_auto]",
                  )}
                >
                  <Field label="Tahun">
                    <Input defaultValue={r.tahun} placeholder="2021" />
                  </Field>
                  <Field label="Dari (pemilik lama)">
                    <Input defaultValue={r.dari} />
                  </Field>
                  <Field label="Ke (pemilik baru)">
                    <Input defaultValue={r.ke} />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Hapus baris riwayat ${i + 1}`}
                    onClick={() => setRiwayat((rs) => rs.filter((_, j) => j !== i))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              {riwayat.length === 0 && (
                <p className="rounded-md border border-dashed border-neutral-400 p-3 text-sm text-neutral-700">
                  Belum ada riwayat ganti pemilik.
                </p>
              )}
            </div>
          </div>
        </Panel>

        {saved && (
          <Notice>
            Draft tersimpan (simulasi). Lanjutkan dengan mencatat kedatangan kendaraan ini di antrean.
          </Notice>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => go("antrean")}>
            Batal
          </Button>
          <Button type="submit" variant="outline">
            Simpan Draft
          </Button>
          <Button type="button" onClick={() => go("antrean")}>
            Simpan & Catat Kedatangan
          </Button>
        </div>
      </form>
    </>
  )
}
