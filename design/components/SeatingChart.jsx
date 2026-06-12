import { mockSeating, layoutSpec } from "@/data"

// ============================================================
// 会议室平面图预览（SVG）—— 设计稿
// 说明：位置布局按参考图绘制，颜色 / 形状 / 规范沿用 v1。
//       座位编号取自 data.jsx 的 mock 数据（非算法生成）。
//
// 布局对照参考图：
//   · 中央横向圆角长桌
//   · 上排 / 下排座位（长边 A 客方 / 长边 B 主方）
//   · 右侧短边竖排 2 座（占位，不参与排序）
//   · 左侧竖排「电子白板」（无座）
//   · 两个「门」分别位于左下角与右下角
// ============================================================

const VIEW_W = 820
const VIEW_H = 470

const SEAT = 56 // 座位边长（v1 规范）
const SEAT_GAP = 70 // 座位间距（v1 规范）

// 房间内边界
const ROOM = { x: 24, y: 24, w: VIEW_W - 48, h: VIEW_H - 48 }

// 会议桌主体
const TABLE = { x: 220, y: 185, w: 420, h: 100, r: 10 }

// 单个座位方块（v1 视觉规范：实心 primary / 虚线空位）
function Seat({ x, y, num }) {
  const filled = num != null
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={SEAT}
        height={SEAT}
        rx={8}
        fill={filled ? "var(--color-primary)" : "transparent"}
        stroke={filled ? "var(--color-primary)" : "var(--color-border)"}
        strokeWidth={filled ? 0 : 2}
        strokeDasharray={filled ? "0" : "5 4"}
      />
      {filled && (
        <text
          x={x + SEAT / 2}
          y={y + SEAT / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="24"
          fontWeight="600"
          fill="var(--color-primary-foreground)"
        >
          {num}
        </text>
      )}
    </g>
  )
}

export default function SeatingChart() {
  const { sideA, sideB } = mockSeating

  // 上/下排座位水平居中于会议桌
  const topCount = sideA.length
  const bottomCount = sideB.length
  const rowWidth = (n) => n * SEAT + (n - 1) * (SEAT_GAP - SEAT)
  const topStartX = TABLE.x + (TABLE.w - rowWidth(topCount)) / 2
  const bottomStartX = TABLE.x + (TABLE.w - rowWidth(bottomCount)) / 2

  const topY = TABLE.y - SEAT - 28 // 上排 y
  const bottomY = TABLE.y + TABLE.h + 28 // 下排 y

  // 右侧短边竖排 2 座
  const rightX = TABLE.x + TABLE.w + 30
  const rightCY = TABLE.y + TABLE.h / 2
  const shortSeatsY = [rightCY - SEAT - 8, rightCY + 8]

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mx-auto h-auto w-full max-w-3xl"
        role="img"
        aria-label="会议室座次平面图预览"
      >
        {/* 房间外墙 */}
        <rect
          x={ROOM.x}
          y={ROOM.y}
          width={ROOM.w}
          height={ROOM.h}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={2}
        />

        {/* 会议桌主体 */}
        <rect
          x={TABLE.x}
          y={TABLE.y}
          width={TABLE.w}
          height={TABLE.h}
          rx={TABLE.r}
          fill="var(--color-card)"
          stroke="var(--color-border)"
          strokeWidth={2}
        />
        <text
          x={TABLE.x + TABLE.w / 2}
          y={TABLE.y + TABLE.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="18"
          fontWeight="600"
          fill="var(--color-muted-foreground)"
          letterSpacing="4"
        >
          会 议 桌
        </text>

        {/* 上排座位（长边 A · 客方） */}
        {sideA.map((num, i) => (
          <Seat key={`a-${i}`} x={topStartX + i * SEAT_GAP} y={topY} num={num} />
        ))}
        <text
          x={TABLE.x + TABLE.w / 2}
          y={topY - 14}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-primary)"
        >
          长边 A · 客方（面门为尊）
        </text>

        {/* 下排座位（长边 B · 主方） */}
        {sideB.map((num, i) => (
          <Seat key={`b-${i}`} x={bottomStartX + i * SEAT_GAP} y={bottomY} num={num} />
        ))}
        <text
          x={TABLE.x + TABLE.w / 2}
          y={bottomY + SEAT + 18}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-accent-foreground)"
        >
          长边 B · 主方（门侧）
        </text>

        {/* 右侧短边竖排 2 座（占位，不参与排序） */}
        {shortSeatsY.map((y, i) => (
          <Seat key={`s-${i}`} x={rightX} y={y} num={null} />
        ))}
        <text
          x={rightX + SEAT / 2}
          y={shortSeatsY[1] + SEAT + 16}
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-muted-foreground)"
        >
          短边占位
        </text>

        {/* 左侧竖排「电子白板」（无座） */}
        <rect
          x={ROOM.x + 64}
          y={TABLE.y - 30}
          width={30}
          height={TABLE.h + 60}
          rx={6}
          fill="var(--color-secondary)"
          stroke="var(--color-border)"
          strokeWidth={1.5}
        />
        <text
          x={ROOM.x + 64 + 15}
          y={TABLE.y + TABLE.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-muted-foreground)"
          writingMode="vertical-rl"
          letterSpacing="2"
        >
          {layoutSpec.whiteboard.label}
        </text>

        {/* 门 —— 左下角 与 右下角（accent 色，沿用 v1 规范，贴底墙） */}
        {(() => {
          const doorW = 110
          const doorH = 30
          const doorY = ROOM.y + ROOM.h - doorH - 8
          const positions = [
            { x: ROOM.x + 8, label: layoutSpec.doors[0]?.label ?? "门" },
            { x: ROOM.x + ROOM.w - doorW - 8, label: layoutSpec.doors[1]?.label ?? "门" },
          ]
          return positions.map((d, i) => (
            <g key={`door-${i}`}>
              <rect x={d.x} y={doorY} width={doorW} height={doorH} rx={6} fill="var(--color-accent)" />
              <text
                x={d.x + doorW / 2}
                y={doorY + doorH / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="600"
                fill="var(--color-accent-foreground)"
                letterSpacing="2"
              >
                {d.label}
              </text>
            </g>
          ))
        })()}
      </svg>

      {/* 图例 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-3.5 rounded-sm bg-primary" />
          有人座位（标数字）
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-3.5 rounded-sm border-2 border-dashed border-border" />
          空位占位
        </span>
        <span className="text-muted-foreground/70">
          ※ 演示数据：客 {mockSeating.guestCount} · 主 {mockSeating.hostCount}（1 号对坐）
        </span>
      </div>
    </div>
  )
}
