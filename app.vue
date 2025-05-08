<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// 添加 Material Icons 載入
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&display=swap',
    }
  ],
})
</script>
