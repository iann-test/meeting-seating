"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Card from "@/components/Card"
import Button from "@/components/Button"
import NumberStepper from "@/components/NumberStepper"
import SeatingChart from "@/components/SeatingChart"
import {
  inputConfig,
  seatingRules,
  presetCases,
  actions,
  footerTips,
} from "@/data"

// ============================================================
// 主界面（唯一页面）—— 设计稿
// 左侧：输入区 + 规则说明  |  右侧：SVG 平面图预览 + 操作按钮
// 注：仅做 UI 与交互状态展示，不实现座次排列算法。
// ============================================================
export default function MainPage() {
  const [guest, setGuest] = useState(inputConfig.guest.defaultValue)
  const [host, setHost] = useState(inputConfig.host.defaultValue)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* ============ 左侧：输入区 + 规则 ============ */}
          <div className="flex flex-col gap-6">
            <Card
              title="输入人数"
              description="分别设置客方与主方人数（0–8），右侧平面图将实时刷新。"
            >
              <div className="flex flex-col gap-4">
                <NumberStepper
                  label={inputConfig.guest.label}
                  sublabel={inputConfig.guest.sublabel}
                  value={guest}
                  min={inputConfig.guest.min}
                  max={inputConfig.guest.max}
                  onChange={setGuest}
                  accent="primary"
                />
                <NumberStepper
                  label={inputConfig.host.label}
                  sublabel={inputConfig.host.sublabel}
                  value={host}
                  min={inputConfig.host.min}
                  max={inputConfig.host.max}
                  onChange={setHost}
                  accent="accent"
                />
              </div>

              {/* 预设案例快捷切换 */}
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  快捷案例
                </p>
                <div className="flex flex-wrap gap-2">
                  {presetCases.map((c) => {
                    const active = c.guest === guest && c.host === host
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setGuest(c.guest)
                          setHost(c.host)
                        }}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* 座次规则说明卡片 */}
            <Card title="座次规则" description="自动排列遵循以下礼仪规则。">
              <ul className="flex flex-col gap-3">
                {seatingRules.map((rule, i) => (
                  <li key={rule.id} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {rule.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {rule.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* ============ 右侧：预览 + 操作 ============ */}
          <div className="flex flex-col gap-6">
            <Card
              title="平面图预览"
              description="长方形会议桌 · 18 座标准布局 · 主客 1 号对坐。"
              action={
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="secondary"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                    }
                  >
                    {actions.print}
                  </Button>
                  <Button
                    variant="primary"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    }
                  >
                    {actions.download}
                  </Button>
                </div>
              }
            >
              {/* 当前选择摘要 */}
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                  客方 {guest} 人
                </span>
                <span className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                  主方 {host} 人
                </span>
                <span className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                  合计 {guest + host} 人就座
                </span>
              </div>

              <SeatingChart />
            </Card>

            {/* 底部提示 */}
            <Card title="使用提示">
              <ul className="flex flex-col gap-2">
                {footerTips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
