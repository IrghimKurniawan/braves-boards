import { createApp } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import App from './App.vue'
import LoginView from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import BoardsView from './views/BoardsView.vue'
import TimeTrackerView from './views/TimeTrackerView.vue'
import ReportsView from './views/ReportsView.vue'
import ProjectsView from './views/ProjectsView.vue'
import TeamView from './views/TeamView.vue'

import './index.css'

const routes: RouteRecordRaw[] = [
  { path: '/',          component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/boards',    component: BoardsView },
  { path: '/tracker',   component: TimeTrackerView },
  { path: '/reports',   component: ReportsView },
  { path: '/projects',  component: ProjectsView },
  { path: '/team',      component: TeamView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')