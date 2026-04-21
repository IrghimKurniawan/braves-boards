<template>
  <div class="w-56 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
    <nav class="flex-1 py-4 px-3 flex flex-col gap-4">
      <RouterLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
        :class="
          $route.path === menu.path
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        "
      >
        <font-awesome-icon
          :icon="menu.icon"
          class="w-4 h-4"
          :class="$route.path === menu.path ? 'text-white' : 'text-gray-500'"
        />
        <span>{{ menu.name }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTachometerAlt,
  faClipboardList,
  faClock,
  faChartBar,
  faProjectDiagram,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import type { MenuItem } from '../types'

library.add(faTachometerAlt, faClipboardList, faClock, faChartBar, faProjectDiagram, faUsers)

const menus: MenuItem[] = [
  { name: 'Dashboard',    path: '/dashboard', icon: 'tachometer-alt' },
  { name: 'Boards',       path: '/boards',    icon: 'clipboard-list' },
  { name: 'Time Tracker', path: '/tracker',   icon: 'clock' },
  { name: 'Reports',      path: '/reports',   icon: 'chart-bar' },
  { name: 'Projects',     path: '/projects',  icon: 'project-diagram' },
  { name: 'Team',         path: '/team',      icon: 'users' },
]
</script>