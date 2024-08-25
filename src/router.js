import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import GalleryView from './pages/ProcessView.vue'
import ProjectView from './pages/ProjectView.vue'
import MeView from './pages/MeView.vue'
import TestView from './pages/Test.vue'
import { ROUTES } from './utils/constants'

const routes = [
  { path: ROUTES.home, component: HomeView },
  { path: ROUTES.me, component: MeView },
  { path: "/test", component: TestView },
  { path: ROUTES.process, component: GalleryView },
  { path: ROUTES.project, component: ProjectView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})