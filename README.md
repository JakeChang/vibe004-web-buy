# 購買物品紀錄系統

這是一個基於 Nuxt.js 建立的購買物品紀錄系統，可以記錄購買物品的資訊，包括名稱、購買日期和保固期限，並提供快到期物品提醒功能。

## 功能特點

- 列表顯示所有已購買物品
- 提供 30 天內即將到期物品的摘要提醒
- 新增購買物品記錄
- 修改現有物品資訊
- 響應式設計，適應不同裝置

## 技術方案

- 前端框架：Nuxt 3 + Vue 3
- 樣式工具：Tailwind CSS 4
- API 串接：使用 JSONP 技術繞過 CORS 限制

## 安裝指南

確保安裝以下相依套件：

```bash
npm install
```

## 開發伺服器

啟動開發伺服器（開啟 http://localhost:3000）：

```bash
npm run dev
```

## 專案結構

- `pages/` - 頁面元件
  - `index.vue` - 首頁
  - `demo/` - 示範頁面
    - `index.vue` - 物品列表頁面
    - `add.vue` - 新增/修改物品頁面
- `composables/` - 組合式函數
  - `useDemo.ts` - 管理物品資料和操作邏輯
- `utils/` - 工具函數
  - `demoService.ts` - API 服務層，處理資料請求
- `assets/` - 靜態資源
  - `css/` - 樣式檔案

## API 說明

系統使用 Google Apps Script 作為後端服務，通過 JSONP 技術實現跨域請求。API 支援以下操作：

- 取得所有物品資料
- 取得單一物品資料
- 新增物品記錄
- 修改物品資訊
