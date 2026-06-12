// ============================================================
// data.jsx —— 所有 mock 数据集中存放（数据与 UI 分离）
// 注意：本文件仅提供"演示用"静态数据，不包含座次排列算法逻辑。
// ============================================================

// 产品信息
export const productInfo = {
  name: "会议桌牌自动排序工具",
  slogan: "输入人数，一键生成符合座次礼仪的会议平面图",
  version: "MVP v1.0",
}

// 输入区默认配置
export const inputConfig = {
  guest: {
    label: "客方人数",
    sublabel: "长边 A · 上座 · 面门",
    min: 0,
    max: 8,
    defaultValue: 5,
  },
  host: {
    label: "主方人数",
    sublabel: "长边 B · 门侧",
    min: 0,
    max: 8,
    defaultValue: 5,
  },
}

// 座次规则说明（用于规则卡片展示）
export const seatingRules = [
  {
    id: "left-first",
    title: "以左为尊",
    desc: "1 号居中，2 号在左手边，3 号在右手边，依次左右交替。",
  },
  {
    id: "center-first",
    title: "居中为尊",
    desc: "奇数时 1 号居中，偶数时 1 号与 2 号居中。",
  },
  {
    id: "door-first",
    title: "面门为尊",
    desc: "正对门的长边 A 为上座，安排客方就座。",
  },
  {
    id: "host-guest",
    title: "主客分明",
    desc: "客方坐长边 A，主方坐长边 B，互不混排。",
  },
  {
    id: "one-to-one",
    title: "主客 1 号对坐",
    desc: "客方 1 号与主方 1 号必须正对，作为显式约束保证。",
  },
]

// ============================================================
// 会议室布局规格（SVG 渲染参数）
// ============================================================
export const layoutSpec = {
  seatsPerSide: 8, // 长边每侧 8 座
  shortSideSeats: 2, // 短边占位 2 座
  table: { label: "会议桌" },
  whiteboard: { label: "电子白板（无座）" },
  doors: [
    { id: "door1", label: "门 1" },
    { id: "door2", label: "门 2" },
  ],
}

// ============================================================
// 演示用座位排布（mock —— 非算法生成）
// 数组下标 = 物理位置（从左到右），值 = 显示的编号；null = 空位
// 此处以"客方 5 人 / 主方 5 人"为示例静态数据
// ============================================================
export const mockSeating = {
  guestCount: 5,
  hostCount: 5,
  // 长边 A（客方）：从左到右 8 个物理位置
  sideA: [null, null, 4, 2, 1, 3, 5, null],
  // 长边 B（主方）：从左到右 8 个物理位置
  sideB: [null, null, 4, 2, 1, 3, 5, null],
  // 短边占位（不参与排序，仅展示）
  shortSide: ["占位", "占位"],
}

// 预设示例（用于"案例验证"快捷切换，纯展示数据）
export const presetCases = [
  { id: "5-5", label: "客5 · 主5", guest: 5, host: 5 },
  { id: "3-3", label: "客3 · 主3", guest: 3, host: 3 },
  { id: "8-8", label: "客8 · 主8", guest: 8, host: 8 },
  { id: "4-6", label: "客4 · 主6", guest: 4, host: 6 },
  { id: "0-2", label: "客0 · 主2", guest: 0, host: 2 },
]

// 操作按钮区文案
export const actions = {
  download: "下载 SVG",
  print: "打印 / 导出 PDF",
  reset: "重置",
}

// 底部提示信息
export const footerTips = [
  "导出的 SVG 可拖入 PPT / Word / Illustrator 二次编辑",
  "可将数字替换为真实姓名，或微调短边座位",
  "MVP 仅支持标准长方形会议室（18 座布局）",
]
