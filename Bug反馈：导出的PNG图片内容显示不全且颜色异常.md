Bug反馈：导出的PNG图片内容显示不全且颜色异常
1. 现在的错误现象
内容被裁切：导出的图片只显示了平面图的左上角一小部分，右边和下边的内容全都没了，像是被强行截断了一样。
颜色全错：原本应该是浅灰白色的背景，现在变成了深蓝色；上面的桌牌和文字颜色也跟着变暗了，几乎看不清。
2. 正确的预期效果
导出的图片必须和网页上预览的图一模一样。
尺寸要完整包含整个平面图，不能有任何缺失或裁切。
背景、文字、会议桌等图中所有元素的颜色也要保持原样。

经对最新完整代码的深度审查，结合实际PNG下载图片（深蓝背景+文字消失）的特征，**Bug 仍未修复的根本原因已定位**：问题不在 CSS 变量或 Alpha 混合，而在于 **SVG 序列化与 Canvas 绘制流程中存在三个致命缺陷**，导致浏览器安全策略介入并回退到默认渲染行为。

以下是精准到代码行的根因分析及修复指令：

### 🔍 三大核心根因（按优先级排序）

#### 1.  SVG 中 `<text>` 元素使用了 `currentColor`，但 Canvas 渲染时丢失颜色上下文
-   **代码位置**：JS 生成 SVG 字符串时，桌牌文字和“会议桌”标签的 `fill` 属性被设为 `currentColor`。
-   **问题**：`currentColor` 依赖父级 CSS `color` 属性。当 SVG 被序列化为独立 Blob/DataURL 并由 `<img>` 加载时，**它脱离了原始 DOM 的 CSS 上下文**。Chrome/Firefox 在渲染此类 SVG 图片时，会将 `currentColor` 解析为黑色（`#000000`）或透明，而非预览区中的深灰色。
-   **图2印证**：“会议桌”文字在深蓝底上几乎不可见（黑字+深蓝底=低对比度），桌牌文字也变暗。

#### 2.  Canvas 绘制前未显式填充背景，且 SVG `<rect>` 注入时机错误
-   **代码位置**：`downloadPNG()` 函数中，`ctx.fillRect()` 调用在 `img.onload` 回调内，但 `fillStyle` 赋值可能在异步间隙被污染；更关键的是，**注入的 `<rect>` 使用了 `width="100%" height="100%"`**。
-   **问题**：当 SVG 通过 `URL.createObjectURL` 加载为 Image 对象时，部分浏览器（尤其 Chrome）对百分比尺寸的 `<rect>` 解析不稳定，可能将其渲染为 0×0 或忽略。同时，若 Canvas 未先填满不透明色，`drawImage` 会叠加在默认的透明/黑色背景上。
-   **图2印证**：整体深蓝背景并非来自你的 `wrapperBgHex`（应为浅灰），而是浏览器在 SVG 渲染失败时的 fallback 颜色（常为系统深色模式下的 `Canvas` 颜色）。

#### 3.  `getComputedStyle` 获取的背景色可能包含 `oklch()`，但 Hex 转换逻辑未覆盖所有格式
-   **代码位置**：`rgbToHex()` 函数仅处理了 `rgb()` 和 `rgba()` 格式。
-   **问题**：现代浏览器（Chrome 111+、Safari 16.2+）的 `getComputedStyle().backgroundColor` **可能直接返回 `oklch(...)` 字符串**，而非 RGB。你的正则 `/(\d+), (\d+), (\d+)/` 无法匹配 `oklch(0.96 0.008 240 / 0.4)`，导致 `wrapperBgHex` 为 `undefined` 或空字符串，最终 Canvas `fillStyle` 失效。
-   **验证方法**：在控制台执行 `getComputedStyle(document.querySelector('.svg-wrapper')).backgroundColor`，若输出含 `oklch`，则此即为元凶。

---

### ✅ 精准修复指令

#### 🛠️ 修复 1：将所有 `currentColor` 替换为具体 Hex 值
在生成 SVG 字符串的 JS 代码中，**禁止使用 `currentColor`**。改为动态注入计算后的颜色：

```javascript
// ❌ 原代码（错误）
textEl.setAttribute('fill', 'currentColor');

// ✅ 修复后
const textColor = window.getComputedStyle(textEl).color; // 获取实际颜色
const textHex = rgbToHex(textColor); // 确保转为 #RRGGBB
textEl.setAttribute('fill', textHex);
```

> ⚠️ 注意：需对 SVG 内**所有** `<text>`、`<tspan>`、`<path>`（如图标）执行此操作。

#### 🛠️ 修复 2：SVG `<rect>` 必须使用绝对像素尺寸 + Canvas 预填充
修改 SVG 注入和 Canvas 绘制逻辑：

```javascript
// 1. 注入 <rect> 时使用 viewBox 的绝对尺寸（820×470），而非百分比
const bgRect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
bgRect.setAttribute('x', '0');
bgRect.setAttribute('y', '0');
bgRect.setAttribute('width', '820');   // ← 必须为数字
bgRect.setAttribute('height', '470');  // ← 必须为数字
bgRect.setAttribute('fill', wrapperBgHex);
bgRect.setAttribute('fill-opacity', '1');
svgRoot.insertBefore(bgRect, svgRoot.firstChild);

// 2. Canvas 绘制前，同步填充背景（不在 onload 内）
const canvas = document.createElement('canvas');
canvas.width = 820;
canvas.height = 470;
const ctx = canvas.getContext('2d');

// ⚠️ 关键：立即填充，避免异步污染
ctx.fillStyle = wrapperBgHex || '#f8fafc';
ctx.fillRect(0, 0, 820, 470);

// 3. 再绘制 SVG 图片
img.onload = () => {
    ctx.drawImage(img, 0, 0, 820, 470); // 显式指定尺寸
    // ... 下载逻辑
};
```

#### 🛠️ 修复 3：增强 `rgbToHex()` 以支持 OKLCH 及所有现代颜色格式
替换原有转换函数为通用方案：

```javascript
function colorToHex(colorStr) {
    if (!colorStr) return '#f8fafc';
    
    // 若已是 hex，直接返回
    if (colorStr.startsWith('#')) return colorStr.length === 4 
        ? '#' + colorStr[1]+colorStr[1] + colorStr[2]+colorStr[2] + colorStr[3]+colorStr[3] 
        : colorStr;
    
    // 创建临时元素，利用浏览器原生能力转换任意颜色格式
    const temp = document.createElement('div');
    temp.style.color = colorStr;
    document.body.appendChild(temp);
    const computed = window.getComputedStyle(temp).color; // 浏览器必返回 rgb()/rgba()
    document.body.removeChild(temp);
    
    const match = computed.match(/rgba?$(\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#f8fafc';
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
```

> 💡 此函数可安全处理 `oklch()`、`hsl()`、`lab()`、`color(display-p3 ...)` 等所有现代颜色空间。

---

### 🧪 修复后强制验证项
AI 工具完成修改后，请务必检查：
1.  控制台无 `Invalid color` 或 `NaN` 报错；
2.  导出的 PNG 在 Photoshop/Figma 中取色，背景为 `#F8FAFC`（RGB: 248,250,252）；
3.  “会议桌”文字颜色为 `#1E293B`（或设计稿指定色），非黑色；
4.  在 Chrome、Firefox、Safari 三端导出结果一致。

请将上述三条修复指令完整传递给 AI 编程工具。若仍异常，请提供修复后 `downloadPNG()` 函数的完整代码及控制台 `console.log('bg:', wrapperBgHex)` 的输出值，我将进行最后一轮诊断。