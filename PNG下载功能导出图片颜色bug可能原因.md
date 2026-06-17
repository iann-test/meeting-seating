Bug 描述：网页导出 PNG 图片背景色异常（纯蓝）
问题现象
预期行为：点击“导出PNG”按钮后，下载的图片背景颜色应与网页上 .preview-area 预览区的实际显示颜色（浅灰白色 #f8fafc）完全一致。
实际行为：导出的 PNG 图片背景变为异常的深蓝色，与网页预览严重不符。
影响范围：所有使用“导出PNG”功能的用户均会复现此问题。

以下是可能原因及修复方案：

🔍 核心原因定位

在你的 CSS 中，预览区容器的背景色使用了 CSS 变量：
.preview-area {
    background-color: var(--bg-color, #f8fafc); /* 问题根源 */
}

而在 JavaScript 的导出函数中，直接调用了 html2canvas：
html2canvas(previewArea, { scale: 2, useCORS: true })

html2canvas 对 CSS 变量的支持存在已知缺陷：当它克隆 DOM 节点到 Canvas 时，无法正确继承或计算 :root 中定义的 --bg-color 变量值。此时它会回退到浏览器默认的未定义状态，或者错误地匹配了某个深层样式，最终渲染出异常的深蓝色（可能是某个父级容器的默认背景或系统深色模式下的 fallback 颜色）。

✅ 修复方案

方案一：在截图前强制注入计算后的背景色（推荐）
在调用 html2canvas 之前，通过 JS 获取元素的实际计算样式，并临时设置为内联样式，截图完成后再移除：

async function exportPNG() {
    const previewArea = document.querySelector('.preview-area');
    
    // 1. 获取计算后的真实背景色
    const computedBg = window.getComputedStyle(previewArea).backgroundColor;
    
    // 2. 临时覆盖内联样式
    previewArea.style.backgroundColor = computedBg;
    
    try {
        const canvas = await html2canvas(previewArea, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: computedBg // 双重保险
        });
        
        // 下载逻辑...
    } finally {
        // 3. 截图完成后移除内联样式，恢复原状
        previewArea.style.backgroundColor = '';
    }
}

方案二：将 CSS 变量替换为具体色值
如果项目不依赖动态主题切换，可直接将 .preview-area 的背景色改为固定值：
.preview-area {
    background-color: #f8fafc; /* 直接写死，避免变量解析问题 */
}

方案三：升级或替换截图库
升级到最新版 html2canvas（v1.4+ 对 CSS 变量支持有所改善）。
或改用 dom-to-image-more，其对现代 CSS 特性的兼容性更好：
    import domtoimage from 'dom-to-image-more';
  domtoimage.toPng(previewArea, { bgcolor: '#f8fafc' })
  

⚠️ 补充排查点
若上述修复后仍有问题，请额外检查：
深色模式干扰：确认导出时是否触发了 @media (prefers-color-scheme: dark)，可在截图配置中加 window.matchMedia('(prefers-color-scheme: dark)').matches 判断并强制指定浅色背景。
外部资源跨域：若预览区包含网络图片或字体，确保服务器返回正确的 CORS 头，否则 useCORS: true 仍可能失败。

建议优先采用方案一，既保留了 CSS 变量的灵活性，又彻底规避了截图库的兼容性问题。