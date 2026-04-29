# QA 问题记录

## 2026-04-29 GA4 已加载但无访问数据

- **现象**
  - 线上页面已成功加载 `gtag/js?id=G-MQ33RTBS1D`
  - `GA4 Realtime` 中看不到 `FlashResume` 的访问数据
  - 浏览器 `Network` 中看不到 `g/collect` 请求

- **影响范围**
  - `GitHub Pages` 线上环境
  - `GA4` 页面访问统计

- **根因**
  - `src/services/analyticsService.ts` 中 `gtag` 队列函数实现不符合 Google 官方标准
  - 旧实现将 `args` 数组直接 push 到 `dataLayer`
  - 导致 `config` 命令未被正确消费，`page_view` 未成功发送

- **修复方案**
  - 将 `window.gtag` 改为官方标准写法：`dataLayer.push(arguments)`
  - 将 `gtag('js', ...)` 与 `gtag('config', ...)` 调整为在 `gtag.js` 脚本加载完成后执行
  - 保留 `GA4` 前端埋点，默认不启用左下角访问量角标

- **验证结果**
  - 重新部署后，`Network` 可看到 `https://www.google-analytics.com/g/collect`
  - `GA4 Realtime` 可看到 `FlashResume` 访问数据

- **经验总结**
  - `gtag.js` 成功加载不代表统计事件一定已发送
  - 排查 `GA4` 时要优先检查：
    - 是否存在 `g/collect`
    - 是否查看的是 `Realtime`
    - `Measurement ID` 是否已进入线上构建产物
