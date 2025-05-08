/**
 * 購買物品紀錄 API 服務
 * 使用 JSONP 方式處理 API 請求，繞過 CORS 限制
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbwFcSx8zMYcKdnwqdfauch2buFgwgdPq4NR4Q9QTmXXSoevUKCsin7S2WWqTGhE2cu_nA/exec';

// 定義資料類型
export interface Item {
  id?: number;
  name: string;
  buy_date: string;
  warranty_period: number;
  warranty_date?: string;
}

// API 回應類型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

/**
 * 建立 JSONP 請求
 * @param url 請求的 URL
 * @param params 請求參數
 * @returns Promise<T> 回傳 Promise
 */
function createJsonpRequest<T>(url: string, params: Record<string, any>): Promise<T> {
  return new Promise((resolve, reject) => {
    // 創建唯一的回調函數名稱
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    
    // 建立 URL 查詢參數
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
    });
    queryParams.append('callback', callbackName);
    
    // 建立完整 URL
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    // 建立 script 元素
    const script = document.createElement('script');
    script.src = fullUrl;
    
    // 設置回調函數
    (window as any)[callbackName] = (data: ApiResponse<T>) => {
      // 清理 DOM 和回調
      document.body.removeChild(script);
      delete (window as any)[callbackName];
      
      if (data.success) {
        resolve(data.data);
      } else {
        reject(new Error(data.error || '未知錯誤'));
      }
    };
    
    // 處理錯誤
    script.onerror = () => {
      document.body.removeChild(script);
      delete (window as any)[callbackName];
      reject(new Error('網路請求失敗'));
    };
    
    // 添加 script 到 DOM
    document.body.appendChild(script);
  });
}

/**
 * 購買物品 API 服務
 */
export const demoService = {
  /**
   * 取得所有物品資料
   * @returns Promise<Item[]>
   */
  getAll(): Promise<Item[]> {
    return createJsonpRequest<Item[]>(API_URL, {
      action: 'get'
    });
  },
  
  /**
   * 取得單一物品資料
   * @param id 物品 ID
   * @returns Promise<Item>
   */
  getById(id: number): Promise<Item> {
    return createJsonpRequest<Item>(API_URL, {
      action: 'get',
      id
    });
  },
  
  /**
   * 新增物品
   * @param item 物品資料
   * @returns Promise<Item>
   */
  create(item: Omit<Item, 'id' | 'warranty_date'>): Promise<Item> {
    return createJsonpRequest<Item>(API_URL, {
      action: 'post',
      data: item
    });
  },
  
  /**
   * 更新物品
   * @param item 物品資料
   * @returns Promise<Item>
   */
  update(item: Item): Promise<Item> {
    return createJsonpRequest<Item>(API_URL, {
      action: 'put',
      data: item
    });
  }
}; 