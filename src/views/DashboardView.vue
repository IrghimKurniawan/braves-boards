<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-700">
        Manage Tasks and Track Time Efficiently
      </h2>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
        + Create New Board
      </button>
    </div>

    <!-- CARD -->
    <div class="bg-white w-60 p-4 rounded-xl shadow border">
      <h3 class="font-semibold text-gray-800 mb-2">First Board</h3>
      <p class="text-sm text-gray-500">0 tasks</p>
      <p class="text-xs text-gray-400 mt-2">Total Time : 0s</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue'
</script>