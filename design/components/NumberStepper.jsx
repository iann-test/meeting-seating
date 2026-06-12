// 人数步进输入组件（可复用）—— 纯 UI，受控组件
export default function NumberStepper({
  label,
  sublabel,
  value,
  min = 0,
  max = 8,
  onChange,
  accent = "primary",
}) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  const dotColor =
    accent === "primary" ? "bg-primary" : "bg-accent-foreground"

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} aria-hidden="true" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {sublabel && (
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label="减少"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary text-lg font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          −
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = Number.parseInt(e.target.value, 10)
            if (Number.isNaN(v)) return onChange(min)
            onChange(Math.min(max, Math.max(min, v)))
          }}
          className="h-10 flex-1 rounded-md border border-input bg-background text-center text-xl font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label="增加"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary text-lg font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          +
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        范围 {min} – {max} 人
      </p>
    </div>
  )
}
