import { ref, computed } from 'vue';
import { demoService } from '~/utils/demoService';
import type { Item } from '~/utils/demoService';

/**
 * 購買物品紀錄邏輯處理
 */
export function useDemo() {
  // 列表資料
  const items = ref<Item[]>([]);
  
  // 載入中狀態
  const loading = ref(false);
  
  // 錯誤訊息
  const error = ref<string | null>(null);
  
  // 表單資料
  const formData = ref<Omit<Item, 'id' | 'warranty_date'>>({
    name: '',
    buy_date: '',
    warranty_period: 365, // 預設一年保固
  });
  
  // 表單提交中狀態
  const submitting = ref(false);
  
  // 表單錯誤
  const formErrors = ref<Record<string, string>>({});
  
  // 當前編輯的項目 ID
  const currentId = ref<number | null>(null);
  
  // 表單是否有效
  const isFormValid = computed(() => {
    return (
      formData.value.name.trim() !== '' &&
      formData.value.buy_date !== '' &&
      formData.value.warranty_period > 0 &&
      Object.keys(formErrors.value).length === 0
    );
  });
  
  // 是否為編輯模式
  const isEditMode = computed(() => {
    return currentId.value !== null;
  });
  
  // 最近30天內即將到期的物品
  const expiringItems = computed(() => {
    if (!items.value.length) return [];
    
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    return items.value.filter(item => {
      if (!item.warranty_date) return false;
      
      const warrantyDate = new Date(item.warranty_date);
      return warrantyDate >= today && warrantyDate <= thirtyDaysLater;
    }).sort((a, b) => {
      // 按照保固日期由近到遠排序
      const dateA = new Date(a.warranty_date || '');
      const dateB = new Date(b.warranty_date || '');
      return dateA.getTime() - dateB.getTime();
    });
  });
  
  /**
   * 載入所有資料
   */
  async function fetchItems() {
    loading.value = true;
    error.value = null;
    
    try {
      items.value = await demoService.getAll();
    } catch (err) {
      console.error('獲取資料失敗', err);
      error.value = err instanceof Error ? err.message : '獲取資料失敗';
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * 獲取單一項目資料
   * @param id 項目 ID
   */
  async function fetchItem(id: number) {
    loading.value = true;
    error.value = null;
    currentId.value = id;
    
    try {
      const item = await demoService.getById(id);
      
      // 設置表單資料
      formData.value = {
        name: item.name,
        buy_date: item.buy_date.split('T')[0], // 格式化日期
        warranty_period: item.warranty_period
      };
    } catch (err) {
      console.error('獲取資料失敗', err);
      error.value = err instanceof Error ? err.message : '獲取資料失敗';
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * 重置表單
   */
  function resetForm() {
    formData.value = {
      name: '',
      buy_date: '',
      warranty_period: 365
    };
    formErrors.value = {};
    currentId.value = null;
  }
  
  /**
   * 驗證表單
   * @returns {boolean} 表單是否有效
   */
  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    
    if (!formData.value.name.trim()) {
      errors.name = '名稱不能為空';
    }
    
    if (!formData.value.buy_date) {
      errors.buy_date = '購買日期不能為空';
    }
    
    if (!formData.value.warranty_period || formData.value.warranty_period <= 0) {
      errors.warranty_period = '保固期間必須大於0天';
    }
    
    formErrors.value = errors;
    return Object.keys(errors).length === 0;
  }
  
  /**
   * 提交表單
   */
  async function submitForm() {
    if (!validateForm()) return;
    
    submitting.value = true;
    error.value = null;
    
    try {
      if (isEditMode.value && currentId.value) {
        // 更新項目
        await demoService.update({
          ...formData.value,
          id: currentId.value
        });
      } else {
        // 新增項目
        await demoService.create(formData.value);
      }
      
      // 重置表單
      resetForm();
      
      // 返回成功狀態
      return true;
    } catch (err) {
      console.error('提交失敗', err);
      error.value = err instanceof Error ? err.message : '提交失敗';
      return false;
    } finally {
      submitting.value = false;
    }
  }
  
  // 返回功能
  return {
    // 狀態
    items,
    loading,
    error,
    formData,
    formErrors,
    submitting,
    isFormValid,
    isEditMode,
    currentId,
    expiringItems,
    
    // 方法
    fetchItems,
    fetchItem,
    resetForm,
    validateForm,
    submitForm
  };
} 