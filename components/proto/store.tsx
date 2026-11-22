"use client"

import { createContext, useContext, useMemo, useState } from "react"
import {
  ANTREAN_AWAL,
  SPAREPART_AWAL,
  STATUS_FLOW,
  WO_AWAL,
  type Antrean,
  type Approval,
  type PageId,
  type Role,
  type Sparepart,
  type Status,
  type WO,
  NAV,
} from "@/lib/proto/data"

type Store = {
  role: Role
  page: PageId
  woId: string
  setWoId: (id: string) => void
  setRole: (r: Role) => void
  go: (page: PageId, opts?: { woId?: string }) => void
  antrean: Antrean[]
  tambahAntrean: (a: Omit<Antrean, "no" | "status">) => void
  majuStatusAntrean: (no: string) => void
  wos: WO[]
  majuStatusWO: (id: string) => void
  updateWO: (id: string, patch: Partial<WO>) => void
  setApproval: (id: string, a: Approval) => void
  spareparts: Sparepart[]
  ubahStok: (id: string, delta: number) => void
  pakaiSparepart: (woId: string, sparepartId: string, qty: number) => void
}

const Ctx = createContext<Store | null>(null)

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error("useStore harus di dalam StoreProvider")
  return v
}

const nextStatus = (s: Status): Status => {
  const i = STATUS_FLOW.indexOf(s)
  return STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)]
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("publik")
  const [page, setPage] = useState<PageId>("beranda")
  const [woId, setWoId] = useState("WO-0042")
  const [antrean, setAntrean] = useState(ANTREAN_AWAL)
  const [wos, setWos] = useState(WO_AWAL)
  const [spareparts, setSpareparts] = useState(SPAREPART_AWAL)

  const value = useMemo<Store>(
    () => ({
      role,
      page,
      woId,
      setWoId,
      setRole: (r) => {
        setRoleState(r)
        setPage(NAV[r][0].id)
        if (typeof window !== "undefined") window.scrollTo({ top: 0 })
      },
      go: (p, opts) => {
        if (opts?.woId) setWoId(opts.woId)
        setPage(p)
        if (typeof window !== "undefined") window.scrollTo({ top: 0 })
      },
      antrean,
      tambahAntrean: (a) =>
        setAntrean((prev) => [
          ...prev,
          {
            ...a,
            no: "A-" + String(prev.length + 1).padStart(3, "0"),
            status: "Menunggu",
          },
        ]),
      majuStatusAntrean: (no) =>
        setAntrean((prev) =>
          prev.map((a) => (a.no === no ? { ...a, status: nextStatus(a.status) } : a)),
        ),
      wos,
      majuStatusWO: (id) =>
        setWos((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: nextStatus(w.status) } : w)),
        ),
      updateWO: (id, patch) =>
        setWos((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w))),
      setApproval: (id, a) =>
        setWos((prev) =>
          prev.map((w) =>
            w.id === id
              ? { ...w, approval: a, status: a === "disetujui" ? "Dikerjakan" : w.status }
              : w,
          ),
        ),
      spareparts,
      ubahStok: (id, delta) =>
        setSpareparts((prev) =>
          prev.map((s) => (s.id === id ? { ...s, stok: Math.max(0, s.stok + delta) } : s)),
        ),
      pakaiSparepart: (wId, spId, qty) => {
        setWos((prev) =>
          prev.map((w) => {
            if (w.id !== wId) return w
            const existing = w.parts.find((p) => p.sparepartId === spId)
            const parts = existing
              ? w.parts.map((p) =>
                  p.sparepartId === spId ? { ...p, qty: p.qty + qty } : p,
                )
              : [...w.parts, { sparepartId: spId, qty }]
            return { ...w, parts }
          }),
        )
        setSpareparts((prev) =>
          prev.map((s) => (s.id === spId ? { ...s, stok: Math.max(0, s.stok - qty) } : s)),
        )
      },
    }),
    [role, page, woId, antrean, wos, spareparts],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
