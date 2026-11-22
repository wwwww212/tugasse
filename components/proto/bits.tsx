import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  desc,
  actions,
  tag,
}: {
  title: string
  desc?: string
  actions?: React.ReactNode
  tag?: string
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-neutral-300 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {tag && (
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-neutral-700">
            {tag}
          </p>
        )}
        <h1 className="text-xl font-semibold text-neutral-900 text-balance">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-neutral-600">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({
  title,
  desc,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  desc?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn("rounded-md border border-neutral-400 bg-white", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 bg-neutral-50 px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>}
            {desc && <p className="text-xs text-neutral-700">{desc}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  )
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string
  children: React.ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-medium text-neutral-700">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-neutral-700">{hint}</p>}
    </div>
  )
}

export function NativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-white px-2.5 text-sm text-neutral-900 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  )
}

export function Placeholder({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      role="img"
      aria-label={label ?? "Placeholder gambar"}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-md border border-dashed border-neutral-400 bg-neutral-100 text-xs text-neutral-700",
        "before:absolute before:inset-0 before:bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),rgb(163_163_163)_50%,transparent_calc(50%+0.5px)),linear-gradient(to_bottom_right,transparent_calc(50%-0.5px),rgb(163_163_163)_50%,transparent_calc(50%+0.5px))] before:opacity-60",
        className,
      )}
    >
      {label && (
        <span className="relative z-10 rounded border border-neutral-300 bg-white px-2 py-0.5 font-mono">
          {label}
        </span>
      )}
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  Menunggu: "border-neutral-400 bg-white text-neutral-700",
  Diagnosa: "border-neutral-500 bg-neutral-200 text-neutral-800",
  Dikerjakan: "border-neutral-700 bg-neutral-700 text-white",
  Selesai: "border-neutral-900 bg-neutral-900 text-white",
  Diambil: "border-neutral-400 bg-neutral-100 text-neutral-700 line-through decoration-neutral-400",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-sm border px-2 font-medium", STATUS_STYLE[status])}
    >
      {status}
    </Badge>
  )
}

export function WarnBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="rounded-sm border-2 border-dashed border-neutral-800 bg-white px-2 font-semibold text-neutral-900"
    >
      {children}
    </Badge>
  )
}

export function Stat({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <div className="rounded-md border border-neutral-400 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-700">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900">{value}</p>
      {note && <p className="mt-1 text-xs text-neutral-700">{note}</p>}
    </div>
  )
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="rounded-md border border-dashed border-neutral-500 bg-neutral-50 px-3 py-2 text-sm text-neutral-800"
    >
      {children}
    </div>
  )
}

export function ScrollTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-neutral-300">
      <div className="min-w-[640px]">{children}</div>
    </div>
  )
}
