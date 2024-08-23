import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './Pages/HomeView.vue'
import GalleryView from './Pages/ProcessView.vue'
import ProjectView from './Pages/ProjectView.vue'
import MeView from './Pages/MeView.vue'
import { ROUTES } from './utils/constants'

const routes = [
  { path: ROUTES.home, component: HomeView },
  { path: ROUTES.me, component: MeView },
  { path: ROUTES.process, component: GalleryView },
  { path: ROUTES.project, component: ProjectView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})