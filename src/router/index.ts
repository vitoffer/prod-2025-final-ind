import ExercisesListPage from '@/views/ExercisesListPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import WorkoutsListPage from '@/views/WorkoutsListPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'ExercisesListPage' },
    },
    {
      path: '/exercises',
      component: ExercisesListPage,
      name: 'ExercisesListPage',
    },
    {
      path: '/workouts',
      component: WorkoutsListPage,
      name: 'WorkoutsListPage',
    },
    {
      path: '/profile',
      component: ProfilePage,
      name: 'ProfilePage',
    },
  ],
})

export default router
