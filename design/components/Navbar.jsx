import { productInfo } from "@/data"

// 顶部导航栏（可复用组件）
export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Logo 标记 */}
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M3 12h18" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">
              {productInfo.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {productInfo.slogan}
            </span>
          </div>
        </div>

        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {productInfo.version}
        </span>
      </div>
    </header>
  )
}
