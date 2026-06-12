// 卡片容器组件（可复用）
export default function Card({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-card-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
