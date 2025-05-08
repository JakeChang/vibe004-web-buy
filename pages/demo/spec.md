# 頁面結構

實現一個簡單的購買物品紀錄

## 功能要求

- 列表: 用列表方式顯示，頁面讀取時，需要有 loading 狀態
    - 在列表頁面上方新增一個 summary 區塊
        - 列出最近 30 天快要到期的物品，使用 warranty_date 來判斷
- 新增: 用表單方式建立
- 修改: 用表單方式修改資料，與新增共用頁面

## 欄位要求

- 取得所有: id,name,buy_date,warranty_period,warranty_date,按鈕(編輯)
- 建立單筆: name,buy_date(日期),warranty_period(天數，用數字表示)
- 更新單筆: name,buy_date(日期),warranty_period(天數，用數字表示)

## 實現檔案

- 主頁面元件: 
    - pages/demo/index.vue: 呈現列表資料的頁面
    - pages/demo/add.vue: 新增與修改資料的頁面，如果網址有帶入 id，則為修改，要先去取得單一資料。
- 邏輯處理: composables/useDemo.ts
    - 負責邏輯，管理 UI 狀態
    - 處理錯誤訊息
    - 處理表單驗證邏輯
    - 提供表單提交方法
    - 管理 UI 狀態
- API 呼叫: utils/demoService.ts
    - 服務層，負責 API 串接
    - 使用 JSONP 方式處理 POST/PUT 請求，繞過 CORS 限制
    - 提供錯誤處理

## API

- 取得所有資料:

```
curl -L --get \                                                                                                                      
>   --data-urlencode "action=get" \
>   --data-urlencode "callback=handleResponse" \
>   "https://script.google.com/macros/s/AKfycbwFcSx8zMYcKdnwqdfauch2buFgwgdPq4NR4Q9QTmXXSoevUKCsin7S2WWqTGhE2cu_nA/exec"

handleResponse({"success":true,"data":[{"id":1,"name":"高效能筆記型電腦","buy_date":"2023-01-15T00:00:00.000Z","warranty_period":730,"warranty_date":"2025-01-14T00:00:00.000Z"}]})%  
```

- 取得單一資料:

```
curl -L --get \                                                                                                                        
>   --data-urlencode "action=get" \
>   --data-urlencode "id=1" \
>   --data-urlencode "callback=handleResponse" \
>   "https://script.google.com/macros/s/AKfycbwFcSx8zMYcKdnwqdfauch2buFgwgdPq4NR4Q9QTmXXSoevUKCsin7S2WWqTGhE2cu_nA/exec"

handleResponse({"success":true,"data":{"id":1,"name":"高效能筆記型電腦","buy_date":"2023-01-15T00:00:00.000Z","warranty_period":730,"warranty_date":"2025-01-14T00:00:00.000Z"}})%     
```

- 新增 (通過 JSONP 實現):

```
curl -L --get \                                                                                                                       
>   --data-urlencode "action=post" \
>   --data-urlencode 'data={"name":"筆記型電腦","buy_date":"2023-01-15","warranty_period":365}' \
>   --data-urlencode "callback=handleResponse" \
>   "https://script.google.com/macros/s/AKfycbwFcSx8zMYcKdnwqdfauch2buFgwgdPq4NR4Q9QTmXXSoevUKCsin7S2WWqTGhE2cu_nA/exec"

handleResponse({"success":true,"data":{"id":2,"name":"筆記型電腦","buy_date":"2023-01-15T00:00:00.000Z","warranty_period":365,"warranty_date":"2024-01-15T00:00:00.000Z"}})%  
```

- 修改 (通過 JSONP 實現):

```
curl -L --get \                                                                                                                       
>   --data-urlencode "action=put" \
>   --data-urlencode 'data={"id":1,"name":"高效能筆記型電腦","buy_date":"2023-01-15","warranty_period":730}' \
>   --data-urlencode "callback=handleResponse" \
>   "https://script.google.com/macros/s/AKfycbwFcSx8zMYcKdnwqdfauch2buFgwgdPq4NR4Q9QTmXXSoevUKCsin7S2WWqTGhE2cu_nA/exec"

handleResponse({"success":true,"data":{"id":1,"name":"高效能筆記型電腦","buy_date":"2023-01-15T00:00:00.000Z","warranty_period":730,"warranty_date":"2025-01-14T00:00:00.000Z"}})%
```

## 備註

- 使用 tailwindcss 排版
- 應用 JSONP 技術繞過 CORS 限制，不依賴伺服器代理
