<template>
  <Layout>
    <div class="bg-white p-4 rounded-xl shadow border mb-6 flex items-center gap-4">
      <input
        type="text"
        placeholder="What are you working on?"
        class="flex-1 outline-none text-sm"
      />
      <font-awesome-icon icon="tag" class="text-gray-400 cursor-pointer" />
      <font-awesome-icon icon="calendar" class="text-gray-400 cursor-pointer" />
      <span class="text-sm text-gray-600">00:00:00</span>
      <button class="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600">
        Start
      </button>
    </div>

    <h2 class="text-sm font-semibold text-gray-600 mb-3">This week</h2>

    <div class="space-y-4">
      <div v-for="(group, i) in data" :key="i" class="bg-gray-100 rounded-xl border">
        <div class="flex justify-between text-xs text-gray-500 px-4 py-2 border-b">
          <span>{{ group.date }}</span>
          <span>Total: {{ group.total }}</span>
        </div>
        <div class="divide-y">
          <div
            v-for="(item, j) in group.items"
            :key="j"
            class="flex items-center justify-between px-4 py-3 bg-white"
          >
            <div>
              <p class="text-sm text-gray-700 font-medium">{{ item.title }}</p>
              <span class="text-xs text-orange-500">• {{ item.project }}</span>
            </div>
            <div class="text-xs text-gray-500 flex items-center gap-4">
              <span>{{ item.time }}</span>
              <font-awesome-icon icon="calendar" />
            </div>
            <div class="flex items-center gap-4 text-sm">
              <span class="text-gray-700">{{ item.duration }}</span>
              <button class="text-gray-500 hover:text-blue-500">
                <font-awesome-icon icon="play" />
              </button>
              <span class="text-gray-400 cursor-pointer">⋮</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faTag, faCalendar } from "@fortawesome/free-solid-svg-icons";

library.add(faPlay, faTag, faCalendar);

const data = [
  {
    date: "Thu, Apr 2",
    total: "04:00:00",
    items: [
      {
        title: "Snap Journal - Fixing some bugs in home...",
        project: "FS Internship",
        time: "19.00 - 21.00",
        duration: "02:00:00",
      },
      {
        title: "Snap Journal - Adding theme feature...",
        project: "FS Internship",
        time: "15.00 - 16.00",
        duration: "01:00:00",
      },
    ],
  },
];
</script>