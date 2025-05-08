<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDemo } from '~/composables/useDemo';

const router = useRouter();
const { items, loading, error, fetchItems, expiringItems } = useDemo();

// 頁面載入時獲取資料
onMounted(() => {
  fetchItems();
});

// 跳轉到新增頁面
function goToAddPage() {
  router.push('/demo/add');
}

// 跳轉到編輯頁面
function goToEditPage(id: number) {
  router.push(`/demo/add?id=${id}`);
}

// 格式化日期
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW');
}

// 計算距離到期的天數
function getDaysUntilExpiry(dateString: string): number {
  if (!dateString) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiryDate = new Date(dateString);
  expiryDate.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
</script>

<template>
  <div class="min-h-screen bg-amber-50 py-8 px-4">
    <div class="container mx-auto max-w-5xl bg-[#f9f7f0] border border-amber-200 rounded-lg shadow-md p-8 relative notebook-paper">
      <!-- 標題區域 -->
      <div class="border-b-2 border-amber-200 mb-8 pb-2">
        <h1 class="text-3xl font-serif text-amber-800 notebook-title">購買物品紀錄</h1>
      </div>
      
      <!-- 錯誤訊息 -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-r shadow-sm">
        <p class="font-medium">注意</p>
        <p>{{ error }}</p>
      </div>
      
      <!-- 即將到期的物品摘要 -->
      <div v-if="!loading && expiringItems.length > 0" class="mb-8 bg-[#fffaeb] border-l-4 border-yellow-400 p-4 rounded-r shadow-sm notebook-section">
        <h2 class="text-xl font-serif text-amber-800 mb-3 flex items-center">
          <span class="material-icons-outlined mr-2 text-amber-600">schedule</span>
          即將到期的物品
        </h2>
        <p class="text-sm text-amber-700 mb-4 italic">這些物品將在 30 天內到期，請注意檢查保固狀態</p>
        
        <div class="space-y-3">
          <div v-for="item in expiringItems" :key="item.id" 
               class="flex justify-between items-center p-3 border-b border-dashed border-amber-200 hover:bg-amber-50 transition-colors">
            <div>
              <span class="font-medium text-amber-900">{{ item.name }}</span>
              <p class="text-sm text-amber-700">到期日: {{ formatDate(item.warranty_date || '') }}</p>
            </div>
            <div class="flex items-center">
              <span class="inline-block px-3 py-1 text-xs font-serif rounded-full shadow-sm" 
                :class="{
                  'bg-red-100 text-red-800 border border-red-200': getDaysUntilExpiry(item.warranty_date || '') <= 7,
                  'bg-yellow-100 text-yellow-800 border border-yellow-200': getDaysUntilExpiry(item.warranty_date || '') > 7 && getDaysUntilExpiry(item.warranty_date || '') <= 14,
                  'bg-blue-100 text-blue-800 border border-blue-200': getDaysUntilExpiry(item.warranty_date || '') > 14
                }"
              >
                剩餘 {{ getDaysUntilExpiry(item.warranty_date || '') }} 天
              </span>
              <button 
                @click="goToEditPage(item.id as number)" 
                class="ml-3 text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center"
              >
                <span class="material-icons-outlined text-sm mr-1">edit</span>
                編輯
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 新增按鈕 -->
      <div class="mb-6">
        <button 
          @click="goToAddPage" 
          class="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full shadow-md transition-all hover:shadow-lg flex items-center font-medium"
        >
          <span class="material-icons-outlined mr-1">add</span>
          新增物品
        </button>
      </div>
      
      <!-- 載入中 -->
      <div v-if="loading" class="py-12 text-center">
        <div class="w-16 h-16 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-amber-800 font-serif italic">載入中...</p>
      </div>
      
      <!-- 資料列表 -->
      <div v-else-if="items.length > 0" class="overflow-x-auto notebook-table">
        <table class="w-full border-collapse bg-[#f9f7f0] rounded-lg overflow-hidden">
          <thead>
            <tr class="border-b-2 border-amber-200">
              <th class="px-6 py-3 text-left text-sm font-serif text-amber-800 uppercase tracking-wider">名稱</th>
              <th class="px-6 py-3 text-left text-sm font-serif text-amber-800 uppercase tracking-wider">購買日期</th>
              <th class="px-6 py-3 text-left text-sm font-serif text-amber-800 uppercase tracking-wider">保固期限</th>
              <th class="px-6 py-3 text-left text-sm font-serif text-amber-800 uppercase tracking-wider">保固到期</th>
              <th class="px-6 py-3 text-right text-sm font-serif text-amber-800 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-b border-dashed border-amber-200 hover:bg-amber-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{{ formatDate(item.buy_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{{ item.warranty_period }} 天</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{{ formatDate(item.warranty_date || '') }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="goToEditPage(item.id as number)" 
                  class="text-amber-600 hover:text-amber-800 flex items-center justify-end"
                >
                  <span class="material-icons-outlined text-sm mr-1">edit</span>
                  編輯
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 無資料 -->
      <div v-else class="text-center py-12 bg-[#f9f7f0] rounded-lg border border-dashed border-amber-200">
        <p class="text-amber-700 font-serif italic">尚無資料</p>
        <p class="text-sm text-amber-600 mt-2">點擊上方「新增物品」按鈕開始記錄</p>
      </div>
      
      <!-- 筆記本裝飾元素 -->
      <!-- <div class="absolute left-0 top-0 bottom-0 w-px bg-amber-200 ml-12 hidden md:block"></div> -->
    </div>
  </div>
</template>

<style scoped>
.notebook-paper {
  background-image: 
    linear-gradient(#f9f7f0 1px, transparent 1px),
    linear-gradient(90deg, rgba(226, 183, 87, 0.05) 1px, transparent 1px);
  background-size: 100% 1.5rem, 1rem 100%;
  position: relative;
}

.notebook-paper::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1rem;
  background: rgba(226, 183, 87, 0.1);
  border-right: 1px solid rgba(226, 183, 87, 0.2);
}

.notebook-title {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .notebook-paper::before {
    display: none;
  }
}
</style> 