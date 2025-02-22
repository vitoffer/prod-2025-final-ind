import { createRouter, createWebHistory } from 'vue-router'
import ExercisesListPage from '@/views/ExercisesListPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import WorkoutsListPage from '@/views/WorkoutsListPage.vue'
import RunWorkoutPage from '@/views/RunWorkoutPage.vue'
import { useUserStore } from '@/stores/userStore'
import ShopPage from '@/views/ShopPage.vue'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'

const routes = [
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
  {
    path: '/run-workout/:id',
    component: RunWorkoutPage,
    name: 'RunWorkoutPage',
  },
  {
    path: '/shop',
    component: ShopPage,
    name: 'ShopPage',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (userStore.isNewUser) {
    if (to.name !== 'ProfilePage') {
      return { name: 'ProfilePage' }
    }
  }

  if (to.name === 'RunWorkoutPage') {
    const runWorkoutStore = useRunWorkoutStore()
    if (!runWorkoutStore.selectedRunWorkout) {
      return { name: 'WorkoutsListPage' }
    }
  }
})

export default router
