# DESIGN - 会议桌牌自动排序工具

## 1. 视觉主色调

| Token | 色值 (OKLCH) | Tailwind 映射 | 用途 |
|---|---|---|---|
| 主色 primary | oklch(0.5 0.13 235) | blue-600 近似 | 有人座位填充、主按钮、客方标识 |
| primary-foreground | oklch(0.99 0 0) | — | 按钮/座位上的反白文字 |
| 辅色 accent | oklch(0.92 0.04 200) | — | 主方标识、门标签 |
| accent-foreground | oklch(0.3 0.06 235) | — | 主方标签文字 |
| 背景 background | oklch(0.98 0.005 240) | slate-50 近似 | 页面底色 |
| 卡片 card | oklch(1 0 0) | white | 卡片/输入区/预览区底色 |
| 前景 foreground | oklch(0.2 0.02 250) | slate-900 近似 | 正文标题 |
| muted-foreground | oklch(0.52 0.02 250) | — | 辅助说明文字 |
| 边框 border | oklch(0.9 0.01 240) | slate-200 近似 | 卡片边框、组件边框、空位虚线 |
| secondary | oklch(0.95 0.01 240) | — | 次按钮底色、步进器按钮、白板填充 |

### 命名约定
- 本项目为单文件 HTML（非 Tailwind 项目）→ 用 CSS 变量 `:root { --color-primary: ... }` 映射上述色值
- SVG 内通过 `fill="var(--color-primary)"` 引用

## 2. 排版规范

| 层级 | 字号 | 字重 | 用途 |
|---|---|---|---|
| 座位数字 | 24px | 600 | SVG 座位方块内编号 |
| 会议桌标签 | 18px | 600 | "会 议 桌"，letter-spacing: 4px |
| 页面标题 | 16px (base) | 600 | 卡片标题 |
| 侧边标签 | 13px | 600 | "长边 A·客方"、"长边 B·主方" |
| 正文/说明 | 14px (sm) | 400 | 卡片描述、提示文字 |
| 辅助文字 | 12px (xs) | 400–500 | 规则说明、范围提示、图例 |

- **字体族**：`Geist Sans` → 映射为系统字体兜底 `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **抗锯齿**：`antialiased` (`-webkit-font-smoothing: antialiased`)

## 3. 组件复用规范

| 组件 | 使用场景 | 关键样式 |
|---|---|---|
| **Card** | 输入区容器、规则说明、预览区、使用提示 | `rounded-xl border border-border bg-card p-5 shadow-sm` |
| **Button / primary** | 下载 SVG（主操作） | `rounded-md bg-primary text-primary-foreground px-4 py-2.5` hover→`opacity: 0.9` |
| **Button / secondary** | 打印/导出 PDF（次操作） | `rounded-md border border-border bg-card px-4 py-2.5` hover→`bg-secondary` |
| **NumberStepper** | 客方/主方人数输入 | `rounded-lg border bg-card p-4`，按钮 40×40 `rounded-md bg-secondary`，输入框 `h-10 rounded-md text-center text-xl font-semibold` |
| **Navbar** | 顶部导航栏 | `sticky top-0 border-b bg-card/80 backdrop-blur px-6 py-3`，含 Logo + 产品名 + 版本标签 |
| **Seat（SVG 内）** | 座位渲染 | 56×56 `rounded-[8px]`，有人→`fill: var(--primary)` + 白色数字，空位→`fill: transparent stroke: var(--border) stroke-dasharray: 5 4` |
| **PresetChip** | 快捷案例切换 | `rounded-full border px-3 py-1 text-xs`，选中态→`bg-primary text-primary-foreground` |

## 4. 平面图 SVG 坐标规格

| 元素 | 参数 | 值 |
|---|---|---|
| **viewBox** | — | `0 0 820 470` |
| **房间外框** | x, y, w, h | 24, 24, 772, 422 |
| **会议桌** | x, y, w, h, rx | 220, 185, 420, 100, 10 |
| **座位方块** | 尺寸 | 56 × 56，圆角 8px |
| **座位间距** | 中心距 | 70px（相邻座位中心点间距） |
| **上排座位 y** | — | `TABLE.y - SEAT - 28` = 101 |
| **下排座位 y** | — | `TABLE.y + TABLE.h + 28` = 313 |
| **上/下排起始 x** | — | 水平居中于会议桌：`TABLE.x + (TABLE.w - rowWidth) / 2` |
| **短边竖排 2 座** | x | `TABLE.x + TABLE.w + 30` = 670 |
| **短边 y** | — | 以 TABLE 垂直中点对称分布，间距 16px |
| **电子白板** | x, y, w, h | ROOM.x + 64, TABLE.y - 30, 30, TABLE.h + 60, rx=6 |
| **门** | w, h | 110 × 30，rx=6 |
| **门 y** | — | ROOM.y + ROOM.h - h - 8 = 408 |
| **门 1 x** | — | ROOM.x + 8 = 32 |
| **门 2 x** | — | ROOM.x + ROOM.w - w - 8 = 678 |

### 座位行宽计算
```
rowWidth(n) = n × 56 + (n − 1) × (70 − 56)
            = n × 56 + (n − 1) × 14
```

## 5. 关键布局规格

| 区域 | 规格 |
|---|---|
| **页面最大宽度** | `max-w-6xl`（1152px），水平居中 |
| **双栏布局** | `grid grid-cols-1 lg:grid-cols-[360px_1fr]`，间距 24px |
| **左侧栏** | 固定 360px，包含输入 Card + 规则 Card，垂直间距 24px |
| **右侧栏** | 自适应，包含预览 Card + 提示 Card，垂直间距 24px |
| **页面内边距** | `px-6 py-8` |
| **圆角基准** | `--radius: 0.625rem`（10px），派生 sm/md/lg/xl/2xl/3xl/4xl |

## 6. 状态视觉表现

| 状态 | 表现 |
|---|---|
| **座位有人** | primary 色填充方块 + 白色粗体数字（24px / 600） |
| **座位空位** | 透明填充 + border 色虚线边框（stroke-dasharray: 5 4） |
| **按钮 hover** | primary→降低不透明度至 90%；secondary→切换 bg-secondary |
| **按钮 disabled** | `opacity: 0.5` + `cursor: not-allowed` |
| **步进器 disabled** | `opacity: 0.4` |
| **输入框 focus** | `ring: 2px var(--ring)` |
| **快捷按钮选中** | `bg-primary text-primary-foreground`；未选中→`bg-card text-muted-foreground hover:bg-secondary` |
| **加载中** | （MVP 暂不需要，无异步操作） |
| **空数据** | 人数为 0 时该侧无座位方块，仅保留侧边标签 |

## 7. 交互动效

| 触发 | 效果 | 时长 |
|---|---|---|
| 按钮 hover | opacity/background-color 切换 | 150ms `transition-colors` |
| 输入框 focus | ring 出现 | 即时 |
| 快捷按钮切换 | 选中态颜色切换 | `transition-colors` |
| 页面加载 | 无（纯静态，即开即用） | — |

## 8. 图例（SVG 下方）

- 蓝色实心方块 → "有人座位（标数字）"
- 灰色虚线方块 → "空位占位"
- 辅助文字 → 当前客/主人数 + "1 号对坐"

## 9. 打印样式

通过 CSS `@media print` 控制：
- 隐藏导航栏、输入区（仅保留平面图）
- SVG 缩放至 A4 宽度适配
- 保留图例
