<template>
  <div :class="darkMode ? 'dark' : ''">
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition duration-300">
      <button
        @click="darkMode = !darkMode"
        class="absolute top-5 right-5 px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
      >
        {{ darkMode ? 'Light' : 'Dark' }}
      </button>

      <div class="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl">
        <div class="flex items-center justify-center gap-3 mb-2">
          <div class="p-5 text-lg font-semibold text-gray-700 border-b border-gray-200 flex items-center gap-1">
            <img src="../assets/Grid.png" alt="" class="w-5" />
            Braves <span class="text-blue-600">Board</span>
          </div>
        </div>

        <router-link
          to="/dashboard"
          class="flex items-center justify-center gap-3 w-full border border-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium text-sm"
        >
          <img src="../assets/google.png" alt="google" class="w-5 h-5" />
          Sign in with Google
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const darkMode = ref<boolean>(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'true') darkMode.value = true
})

watch(darkMode, (val: boolean) => {
  localStorage.setItem('theme', String(val))
})
</script>