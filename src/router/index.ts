import ExercisesListPage from '@/views/ExercisesListPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ExercisesListPage,
      name: 'ExercisesListPage',
    },
  ],
})

export default router
