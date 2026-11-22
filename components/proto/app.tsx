"use client"

import { useState } from "react"
import { Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NAV, ROLES, type Role } from "@/lib/proto/data"
import { cn } from "@/lib/utils"
import { Field } from "./bits"
import { StoreProvider, useStore } from "./store"
import { Antrean } from "./pages/antrean"
import { Beranda } from "./pages/beranda"
import { Dashboard } from "./pages/dashboard"
import { Katalog } from "./pages/katalog"
import { KendaraanSaya, ProgresServis } from "./pages/pelanggan"
import { Pembayaran } from "./pages/pembayaran"
import { Registrasi } from "./pages/registrasi"
import { Stok } from "./pages/stok"
import { WoDetail } from "./pages/wo-detail"
import { WoList } from "./pages/wo-list"

function DemoBar() {
  const { role, setRole } = useStore()
  return (
    <div className="sticky top-0 z-40 border-b border-neutral-700 bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:gap-4">
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-neutral-300">
          Draft Demo — Pilih Role
        </p>
        <nav aria-label="Pilih role demo" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <ul className="flex w-max gap-1.5">
            {ROLES.map((r, i) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setRole(r.id)}
                  aria-pressed={role === r.id}
                  title={r.sub}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    role === r.id
                      ? "border-white bg-white text-neutral-900"
                      : "border-neutral-600 text-neutral-200 hover:bg-neutral-800",
                  )}
                >
                  <span className="font-mono text-[11px] opacity-60">{i + 1}</span>
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { setRole } = useStore()
  const masuk = (r: Role) => {
    onOpenChange(false)
    setRole(r)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Masuk / Daftar</DialogTitle>
          <DialogDescription>Draft form. Pilih role di bawah untuk masuk instan.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="daftar">Daftar</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-3 flex flex-col gap-3">
            <Field label="No. HP / Email">
              <Input placeholder="08xx-xxxx-xxxx" />
            </Field>
            <Field label="Kata Sandi">
              <Input type="password" placeholder="••••••••" />
            </Field>
            <Button onClick={() => masuk("pelanggan")}>Masuk sebagai Pelanggan</Button>
          </TabsContent>
          <TabsContent value="daftar" className="mt-3 flex flex-col gap-3">
            <Field label="Nama Lengkap">
              <Input placeholder="Nama Anda" />
            </Field>
            <Field label="No. HP">
              <Input type="tel" placeholder="08xx-xxxx-xxxx" />
            </Field>
            <Field label="Kata Sandi">
              <Input type="password" placeholder="Minimal 8 karakter" />
            </Field>
            <Button onClick={() => masuk("pelanggan")}>Daftar Akun</Button>
          </TabsContent>
        </Tabs>
        <div className="border-t border-dashed border-neutral-300 pt-3">
          <p className="mb-2 text-xs text-neutral-700">Masuk cepat (demo staf):</p>
          <div className="flex flex-wrap gap-2">
            {(["admin", "mekanik", "pemilik"] as const).map((r) => (
              <Button key={r} size="sm" variant="outline" onClick={() => masuk(r)} className="capitalize">
                {r}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Shell() {
  const { role, page, go } = useStore()
  const [loginOpen, setLoginOpen] = useState(false)
  const items = NAV[role]
  const roleInfo = ROLES.find((r) => r.id === role)!
  const sidebar = role !== "publik"

  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-900">
      <DemoBar />

      <header className="border-b border-neutral-400 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <button type="button" onClick={() => go(NAV[role][0].id)} className="flex items-center gap-2 text-left">
            <span className="flex size-8 items-center justify-center rounded-md border-2 border-neutral-900">
              <Wrench className="size-4" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">Bengkel Maju Jaya</span>
              <span className="block text-[11px] text-neutral-700">Motor &amp; Mobil</span>
            </span>
          </button>
          {role === "publik" ? (
            <Button onClick={() => setLoginOpen(true)}>Login / Daftar</Button>
          ) : (
            <span className="rounded-md border border-neutral-400 px-2.5 py-1 text-xs text-neutral-700">
              Role: <strong className="font-semibold">{roleInfo.label}</strong>
            </span>
          )}
        </div>
      </header>

      <div className={cn("mx-auto max-w-7xl gap-6 px-4 py-5", sidebar && "lg:grid lg:grid-cols-[220px_1fr]")}>
        <nav
          aria-label={`Menu ${roleInfo.label}`}
          className={cn("mb-5 -mx-4 overflow-x-auto px-4", sidebar ? "lg:mx-0 lg:mb-0 lg:overflow-visible lg:px-0" : "")}
        >
          <ul className={cn("flex w-max gap-1.5", sidebar && "lg:w-full lg:flex-col")}>
            {items.map((n) => {
              const active = page === n.id
              return (
                <li key={n.id} className={cn(sidebar && "lg:w-full")}>
                  <button
                    type="button"
                    onClick={() => go(n.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "w-full rounded-md border px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
                      active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-400 bg-white text-neutral-700 hover:border-neutral-700",
                    )}
                  >
                    {n.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <main className="min-w-0">
          <Pages onLogin={() => setLoginOpen(true)} />
        </main>
      </div>

      <footer className="border-t border-neutral-300 py-4 text-center font-mono text-[11px] uppercase tracking-wider text-neutral-700">
        Draft mid-fidelity wireframe • data dummy statis
      </footer>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}

function Pages({ onLogin }: { onLogin: () => void }) {
  const { page } = useStore()
  switch (page) {
    case "beranda":
      return <Beranda onLogin={onLogin} />
    case "katalog":
      return <Katalog />
    case "antrean":
      return <Antrean />
    case "registrasi":
      return <Registrasi />
    case "wo":
      return <WoList />
    case "wo-detail":
      return <WoDetail />
    case "stok":
      return <Stok />
    case "pembayaran":
      return <Pembayaran />
    case "dashboard":
      return <Dashboard />
    case "kendaraan-saya":
      return <KendaraanSaya />
    case "progres":
      return <ProgresServis />
  }
}

export function PrototypeApp() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
