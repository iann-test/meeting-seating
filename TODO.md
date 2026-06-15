# TODO - 会议桌牌自动排序工具

> **总预计耗时：约 3.5 小时**
> **执行约束：严格串行，完成一个任务并验收通过后才能开始下一个。**

---

## T1 · 项目骨架：HTML 结构 + CSS 变量 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 30 分钟 |
| **依赖** | 无 |
| **修改目标** | 创建 `index.html`，搭建完整 HTML 骨架 + 定义所有 CSS 变量 |
| **允许修改范围** | 新建文件 `d:\TEST\会议座次自动排序\index.html`，写入 `<style>` 和 `<body>` 静态结构（不含交互逻辑） |
| **参考来源** | DESIGN.md §1（色值）、§2（排版）、§5（布局）；ARCHITECTURE.md §3（内部结构图）；design/data.jsx（文案常量） |

### 验收标准
- [ ] 浏览器打开 `index.html`，页面空白但无控制台错误
- [ ] `<style>` 中定义了完整的 `:root` CSS 变量（10 个色值 Token：`--color-primary`、`--color-background`、`--color-card`、`--color-foreground`、`--color-muted-foreground`、`--color-border`、`--color-secondary`、`--color-accent`、`--color-accent-foreground`、`--color-ring`）
- [ ] `<body>` 包含正确的 HTML 结构：`#navbar` → `#main`（内含 `#left-panel` + `#right-panel`）→ `#tips-card`
- [ ] 页面最大宽度 1152px（`max-w-6xl`），水平居中
- [ ] 双栏布局骨架就位：左侧 360px + 右侧自适应
- [ ] `font-family` 为系统字体兜底：`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- [ ] `antialiased` 生效
- [ ] 圆角 CSS 变量 `--radius: 0.625rem` 已定义

---

## T2 · 组件样式：Card / Button / NumberStepper / Navbar  「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 25 分钟 |
| **依赖** | T1（HTML 骨架 + CSS 变量已就位） |
| **修改目标** | 为全部 6 类可复用组件编写 CSS 类 |
| **允许修改范围** | 仅修改 `index.html` 的 `<style>` 块，追加组件 CSS |
| **参考来源** | DESIGN.md §3（组件复用规范表）、§6（状态视觉表现）、§7（交互动效）；design/components/ 下各 .jsx 文件的 className |

### 验收标准
- [ ] **Navbar**：`sticky top-0 border-b bg-card/80 backdrop-blur px-6 py-3`，含 Logo 方框（38×38 `bg-primary`）+ 产品名 + 版本标签样式
- [ ] **Card**：`rounded-xl border border-border bg-card p-5 shadow-sm`，标题 `text-base font-semibold`，描述 `text-sm text-muted-foreground`
- [ ] **Button / primary**：`rounded-md bg-primary text-primary-foreground px-4 py-2.5`，hover 降低 opacity 至 0.9，transition 150ms
- [ ] **Button / secondary**：`rounded-md border border-border bg-card px-4 py-2.5`，hover 切换 `bg-secondary`
- [ ] **NumberStepper**：`rounded-lg border bg-card p-4`，按钮 40×40 `rounded-md bg-secondary`，输入框 `h-10 rounded-md text-center text-xl font-semibold`，disabled 态 `opacity: 0.4`
- [ ] **PresetChip**：`rounded-full border px-3 py-1 text-xs`，选中态 `bg-primary text-primary-foreground`，未选中 `bg-card text-muted-foreground hover:bg-secondary`
- [ ] 所有交互元素 focus 时显示 `ring: 2px var(--ring)`

---

## T3 · 平面图静态元素：房间、会议桌、白板、门   「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 20 分钟 |
| **依赖** | T1（HTML 骨架就位） |
| **修改目标** | 在 `#preview-card` 内渲染 SVG 静态元素（不随人数变化的部分） |
| **允许修改范围** | 修改 `index.html` 的 `<body>` 中 `#preview-card` 区域，添加 `<svg>` 标签及静态子元素 |
| **参考来源** | DESIGN.md §4（SVG 坐标规格表）；design/components/SeatingChart.jsx（静态 rect 和 text） |

### 验收标准
- [ ] SVG `viewBox="0 0 820 470"`，自适应容器宽度
- [ ] 房间外墙：`<rect>` x=24 y=24 w=772 h=422，`fill="none" stroke="var(--color-border)" stroke-width=2`
- [ ] 会议桌：`<rect>` x=220 y=185 w=420 h=100 rx=10，`fill="var(--color-card)" stroke="var(--color-border)" stroke-width=2`
- [ ] 会议桌中央文字："会 议 桌"，18px/600，letter-spacing=4，`fill="var(--color-muted-foreground)"`
- [ ] 电子白板：`<rect>` x=ROOM.x+64(88) y=TABLE.y-30(155) w=30 h=160 rx=6，`fill="var(--color-secondary)" stroke="var(--color-border)" stroke-width=1.5` + 竖排文字"电子白板（无座）"
- [ ] 门 1：`<rect>` x=32 y=408 w=110 h=30 rx=6 `fill="var(--color-accent)"` + 文字"门 1"
- [ ] 门 2：`<rect>` x=678 y=408 w=110 h=30 rx=6 `fill="var(--color-accent)"` + 文字"门 2"
- [ ] 白板和门的文字均 `font-size=13 font-weight=600 fill="var(--color-accent-foreground)"` 或 `"var(--color-muted-foreground)"`

---

## T4 · 座位渲染函数（JS）：有人/空位/短边占位 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 25 分钟 |
| **依赖** | T3（SVG 静态元素就位） |
| **修改目标** | 用 JavaScript 动态生成座位 `<g>` 元素的 SVG 字符串，包括长边 A 上排、长边 B 下排、短边竖排占位、侧边标签 |
| **允许修改范围** | 修改 `index.html` 的 `<script>` 块，新增座位渲染相关函数 |
| **参考来源** | DESIGN.md §4（座位坐标、行宽公式、SEAT=56、SEAT_GAP=70）、§6（有人/空位视觉表现）；design/components/SeatingChart.jsx（Seat 函数） |

### 验收标准
- [ ] `renderSeat(x, y, num)` 函数：有人时返回 primary 填充方块（56×56 rx=8）+ 居中白色数字（24px/600）；空位时返回透明填充 + border 色虚线方块（`stroke-dasharray="5 4"`）
- [ ] 上排座位（长边 A·客方）水平居中渲染于 TABLE 上方 y=101
- [ ] 下排座位（长边 B·主方）水平居中渲染于 TABLE 下方 y=313
- [ ] 座位行宽计算正确：`rowWidth(n) = n × 56 + (n − 1) × 14`
- [ ] 短边竖排 2 座位于 TABLE 右侧 x=670，以 TABLE 垂直中点对称，间距 16px，均为空位（虚线方块）
- [ ] 上排标签文字"长边 A · 客方（面门为尊）"13px/600 `fill="var(--color-primary)"`
- [ ] 下排标签文字"长边 B · 主方（门侧）"13px/600 `fill="var(--color-accent-foreground)"`
- [ ] 短边标签"短边占位"11px `fill="var(--color-muted-foreground)"`
- [ ] 暂时用硬编码 mock 数据验证渲染（例如客方 5 人 `[null,null,5,3,1,2,4,null]`）

---

## T5 · 座次排列算法 + 对坐修正 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 30 分钟 |
| **依赖** | 无（纯逻辑函数，可独立开发测试） |
| **修改目标** | 实现 `arrangeSeats(n)` 纯函数 + 主客对坐修正逻辑 |
| **允许修改范围** | 修改 `index.html` 的 `<script>` 块，新增算法函数 |
| **参考来源** | ARCHITECTURE.md §4（算法核心、对坐保证、边界情况）；PRD.md §3（排列规则）；桌牌摆放规则.txt |

### 验收标准
- [ ] `arrangeSeats(n, isHost, oneIdx)` 返回长度为 8 的数组，有人座位存排名数字（1-based），空位存 `null`
- [ ] 1号位由 `getOneIdx(isHost)` 三场景判定：均偶→客3主4 / 主满客不满→双方4 / 客满主不满→双方3 / 均不满→双方3
- [ ] 客方/主方各自使用方向正确的填位顺序（客左=大索引 / 主左=小索引）
- [ ] 对坐验证：A 索引 i ↔ B 索引 i（同索引正对），非均偶时 1 号同索引
- [ ] n=0 返回全 null 数组
- [ ] n=8 返回全满数组（无 null）
- [ ] n 超出 [0,8] 范围时 clamp + `console.warn`
- [ ] 非整数输入向下取整

---

## T6 · 交互逻辑：输入控制 + 实时预览联动 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 25 分钟 |
| **依赖** | T2（组件样式）+ T4（座位渲染）+ T5（排列算法） |
| **修改目标** | 实现客方/主方人数调整 → SVG 实时刷新 + 人数摘要更新 + 图例更新 |
| **允许修改范围** | 修改 `index.html` 的 `<script>` 块，新增交互逻辑函数 |
| **参考来源** | design/pages/MainPage.jsx（状态管理 + onChange 联动）；design/components/NumberStepper.jsx（受控组件逻辑） |

### 验收标准
- [ ] 客方步进器：点击 − / + 按钮，值在 0–8 之间变化，输入框实时显示；达到边界时按钮 disabled
- [ ] 主方步进器：同上
- [ ] 输入框支持直接键入数字（0–8），非法值 clamp 到边界
- [ ] 人数变化时 SVG 平面图即时刷新（座位方块 + 数字更新）
- [ ] 人数摘要栏实时显示："客方 X 人 | 主方 Y 人 | 合计 Z 人就座"
- [ ] 图例文字更新：当前客/主人数 + 1 号对坐状态提示
- [ ] 快捷案例按钮组（客5·主5 / 客3·主3 / 客8·主8 / 客4·主6 / 客0·主2）：点击后同时设置客方和主方人数，按钮变选中态
- [ ] 客方 0 人时长边 A 无座位方块、仅保留标签；主方同理
- [ ] 页面首次加载默认显示客 5 人 + 主 5 人

---

## T7 · 座次规则说明卡片 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 10 分钟 |
| **依赖** | T2（Card 组件样式） |
| **修改目标** | 在左侧栏 #input-card 下方插入规则说明 Card，列出 5 条座次规则 |
| **允许修改范围** | 修改 `index.html` 的 `<body>` 中 `#left-panel` 区域 |
| **参考来源** | design/data.jsx（seatingRules 数组）；design/pages/MainPage.jsx（规则列表渲染） |

### 验收标准
- [ ] Card 标题"座次规则"，描述"自动排列遵循以下礼仪规则。"
- [ ] 5 条规则依次列出，每条含：圆形序号标记（`bg-secondary`）、标题、描述
- [ ] 规则顺序：①以左为尊 ②居中为尊 ③面门为尊 ④主客分明 ⑤主客 1 号对坐
- [ ] 所有文案与 design/data.jsx 中 `seatingRules` 一致

---

## T8 · 使用提示卡片 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 10 分钟 |
| **依赖** | T2（Card 组件样式） |
| **修改目标** | 在右侧栏预览 Card 下方插入使用提示 Card |
| **允许修改范围** | 修改 `index.html` 的 `<body>` 中 `#right-panel` 区域 |
| **参考来源** | design/data.jsx（footerTips 数组）；design/pages/MainPage.jsx（footer tips 渲染） |

### 验收标准
- [ ] Card 标题"使用提示"
- [ ] 3 条提示前均有 ✓ 图标（SVG inline polyline），`fill="var(--color-primary)"`
- [ ] 提示内容：
  - "导出的 SVG 可拖入 PPT / Word / Illustrator 二次编辑"
  - "可将数字替换为真实姓名，或微调短边座位"
  - "MVP 仅支持标准长方形会议室（18 座布局）"
- [ ] 提示文字 `text-sm text-muted-foreground`

---

## T9 · PNG 下载 + 自定义微调模式 「已完成」

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 60 分钟 |
| **依赖** | T4（座位渲染完整）+ T6（实时预览联动） |
| **修改目标** | 实现 PNG 下载 + 自定义微调模式（姓名编辑 + 拖拽换位） |
| **允许修改范围** | 修改 `index.html` 的 `<style>`、`<body>`、`<script>` |
| **参考来源** | ARCHITECTURE.md §1；用户自定义微调需求 |

### 验收标准
- [ ] 点击"下载 PNG"按钮触发浏览器下载
- [ ] 下载文件名为 `会议座次_客X_主Y.png`（X/Y 为当前人数）
- [ ] PNG 文件清晰（2x 分辨率），颜色正确（非 OKLCH）
- [ ] 点击"自定义微调"按钮进入自定义模式，SVG 边框高亮
- [ ] 自定义模式下单击有人座位可编辑姓名（Enter 确认，Esc 取消）
- [ ] 姓名标签显示在座位外侧，不遮挡座位标号和空位虚线框
- [ ] 自定义模式下可拖拽有人座位到空位，松手交换，姓名跟随移动
- [ ] 步进器/预设按钮变更人数时清空自定义状态，恢复算法排列
- [ ] 退出自定义模式保留手动调整

---

## T10 · 打印样式 @media print 「已取消」

> 依据用户需求：删除"打印/导出 PDF"按钮及相应需求。

---

| 属性 | 内容 |
|---|---|
| **优先级** | P1 |
| **预计耗时** | 15 分钟 |
| **依赖** | T6（交互联动完成） |
| **修改目标** | 添加 @media print CSS，隐藏输入区，仅保留平面图 + 图例 |
| **允许修改范围** | 修改 `index.html` 的 `<style>` 块 |
---

## T11 · 验收测试：5 组案例跑通

| 属性 | 内容 |
|---|---|
| **优先级** | P0 |
| **预计耗时** | 20 分钟 |
| **依赖** | T1–T9 全部完成 |
| **修改目标** | 运行 5 组预设案例，逐项核对所有验收标准 |
| **允许修改范围** | 仅修正 bug，不新增功能 |

### 验收标准
- [ ] **案例 1：客 5·主 5（奇-奇）** → 1 号对坐成立，空位方块数正确
- [ ] **案例 2：客 3·主 3（奇-奇）** → 1 号对坐成立，各有 5 个空位
- [ ] **案例 3：客 8·主 8（偶-偶）** → 双方均有 8 个实心方块、无空位，1/2 号各自居中
- [ ] **案例 4：客 4·主 6（偶-偶）** → 双方 1/2 号居中
- [ ] **案例 5：客 0·主 2** → 长边 A 无座位方块仅标签，长边 B 显示 2 个实心方块
- [ ] 所有案例 PNG 下载后颜色正确、清晰
- [ ] 所有案例自定义微调模式正常（姓名编辑 + 拖拽换位）
- [ ] 文件在无网络环境下双击可正常使用
- [ ] 零依赖确认：页面上无任何外部 CSS/JS/字体引用
