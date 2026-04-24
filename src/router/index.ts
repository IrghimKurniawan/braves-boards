import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import BoardsView from '../views/BoardsView.vue'
import TimeTrackerView from '../views/TimeTrackerView.vue'
import ReportsView from '../views/ReportsView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import TeamView from '../views/TeamView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: LoginView, meta: { public: true } },
  { path: '/dashboard', component: DashboardView },
  { path: '/boards', component: BoardsView },
  { path: '/tracker', component: TimeTrackerView },
  { path: '/reports', component: ReportsView },
  { path: '/projects', component: ProjectsView },
  { path: '/team', component: TeamView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔥 FINAL GUARD
router.beforeEach((to, _from, next) => {
  // ✅ 1. Ambil token dari URL (hasil redirect backend)
  const params = new URLSearchParams(window.location.search)
  const token = params.get('access_token')

  if (token) {
    localStorage.setItem('access_token', token)

    // bersihin URL
    window.history.replaceState({}, document.title, to.path)
  }

  // ✅ 2. Cek login
  const isPublic = to.meta.public === true
  const hasToken = !!localStorage.getItem('access_token')

  if (!isPublic && !hasToken) {
    return next('/')
  }

  if (isPublic && hasToken && to.path === '/') {
    return next('/dashboard')
  }

  next()
})

export default router