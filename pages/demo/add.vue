<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDemo } from '~/composables/useDemo';

const router = useRouter();
const route = useRoute();
const { 
  formData, 
  formErrors, 
  loading, 
  submitting, 
  error, 
  isEditMode,
  fetchItem, 
  resetForm, 
  submitForm 
} = useDemo();

// 取得 URL 參數中的 ID
const id = computed(() => {
  const urlId = route.query.id;
  return urlId ? Number(urlId) : null;
});

// 頁面標題
const pageTitle = computed(() => {
  return isEditMode.value ? '修改物品' : '新增物品';
});

// 初始化頁面，如果有 ID 則取得資料
onMounted(async () => {
  resetForm();
  
  // 如果有 ID 則取得該筆資料
  if (id.value) {
    await fetchItem(id.value);
  }
});

// 處理表單提交
async function handleSubmit() {
  const success = await submitForm();
  
  if (success) {
    // 跳轉回列表頁
    router.push('/demo');
  }
}

// 返回列表頁
function goBack() {
  router.push('/demo');
}
</script>

<template>
  <div class="min-h-screen bg-amber-50 py-8 px-4">
    <div class="container mx-auto max-w-2xl bg-[#f9f7f0] border border-amber-200 rounded-lg shadow-md p-8 relative notebook-paper">
      <!-- 標題區域 -->
      <div class="border-b-2 border-amber-200 mb-8 pb-2">
        <h1 class="text-3xl font-serif text-amber-800 notebook-title">{{ pageTitle }}</h1>
      </div>
      
      <!-- 錯誤訊息 -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-r shadow-sm">
        <p class="font-medium">注意</p>
        <p>{{ error }}</p>
      </div>
      
      <!-- 載入中 -->
      <div v-if="loading" class="py-12 text-center">
        <div class="w-16 h-16 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-amber-800 font-serif italic">載入中...</p>
      </div>
      
      <!-- 表單 -->
      <form v-else @submit.prevent="handleSubmit" class="notebook-form">
        <!-- 名稱 -->
        <div class="mb-6">
          <label class="block text-amber-800 text-base font-serif mb-2" for="name">
            物品名稱
          </label>
          <input 
            v-model="formData.name"
            id="name"
            type="text"
            class="w-full px-4 py-3 bg-[#fffdf7] border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-colors"
            :class="{ 'border-red-400': formErrors.name }"
            placeholder="請輸入物品名稱"
          />
          <p v-if="formErrors.name" class="text-red-500 text-xs italic mt-2 font-serif">{{ formErrors.name }}</p>
        </div>
        
        <!-- 購買日期 -->
        <div class="mb-6">
          <label class="block text-amber-800 text-base font-serif mb-2" for="buy_date">
            購買日期
          </label>
          <input 
            v-model="formData.buy_date"
            id="buy_date"
            type="date"
            class="w-full px-4 py-3 bg-[#fffdf7] border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-colors font-serif"
            :class="{ 'border-red-400': formErrors.buy_date }"
          />
          <p v-if="formErrors.buy_date" class="text-red-500 text-xs italic mt-2 font-serif">{{ formErrors.buy_date }}</p>
        </div>
        
        <!-- 保固期限 -->
        <div class="mb-8">
          <label class="block text-amber-800 text-base font-serif mb-2" for="warranty_period">
            保固期限 (天數)
          </label>
          <div class="relative">
            <input 
              v-model.number="formData.warranty_period"
              id="warranty_period"
              type="number"
              min="1"
              class="w-full px-4 py-3 bg-[#fffdf7] border-b-2 border-amber-200 focus:border-amber-500 focus:outline-none transition-colors"
              :class="{ 'border-red-400': formErrors.warranty_period }"
            />
            <span class="absolute right-4 top-3 text-amber-700 font-serif">天</span>
          </div>
          <p v-if="formErrors.warranty_period" class="text-red-500 text-xs italic mt-2 font-serif">{{ formErrors.warranty_period }}</p>
        </div>
        
        <!-- 快速設定保固 -->
        <div class="mb-8 bg-[#fffaeb] p-4 rounded-lg border border-dashed border-amber-200">
          <p class="text-amber-800 font-serif mb-2">快速設定:</p>
          <div class="flex flex-wrap gap-2">
            <button 
              type="button" 
              @click="formData.warranty_period = 30" 
              class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
            >
              1 個月
            </button>
            <button 
              type="button" 
              @click="formData.warranty_period = 90" 
              class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
            >
              3 個月
            </button>
            <button 
              type="button" 
              @click="formData.warranty_period = 180" 
              class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
            >
              6 個月
            </button>
            <button 
              type="button" 
              @click="formData.warranty_period = 365" 
              class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
            >
              1 年
            </button>
            <button 
              type="button" 
              @click="formData.warranty_period = 730" 
              class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
            >
              2 年
            </button>
            <button 
              type="button" 
              @click="formData.warranty_period = 1095" 
              class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
            >
              3 年
            </button>
          </div>
        </div>
        
        <!-- 按鈕 -->
        <div class="flex items-center justify-between pt-4 border-t border-dashed border-amber-200">
          <button
            type="button"
            @click="goBack"
            class="bg-transparent border border-amber-600 text-amber-600 hover:bg-amber-50 font-medium py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors flex items-center"
          >
            <span class="material-icons-outlined text-sm mr-1">arrow_back</span>
            返回
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:shadow-outline shadow-md hover:shadow-lg transition-all flex items-center"
            :class="{ 'opacity-50 cursor-not-allowed': submitting }"
          >
            <span class="material-icons-outlined text-sm mr-1">{{ isEditMode ? 'save' : 'add' }}</span>
            {{ submitting ? '提交中...' : '提交' }}
          </button>
        </div>
      </form>
      
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

.notebook-form input {
  font-family: 'Courier New', Courier, monospace;
}

.notebook-form input:focus {
  background-color: rgba(255, 250, 235, 0.5);
}

@media (max-width: 768px) {
  .notebook-paper::before {
    display: none;
  }
}
</style> 