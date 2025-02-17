import { createRouter, createWebHistory, type RouteLocation } from 'vue-router'
import ExercisesListPage from '@/views/ExercisesListPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import WorkoutsListPage from '@/views/WorkoutsListPage.vue'

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
    props: (route: RouteLocation) => ({
      newUser: route.params.newUser === 'true',
    }),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const localStorageUser = localStorage.getItem('user')

  if (!localStorageUser) {
    if (to.name !== 'ProfilePage') {
      return { name: 'ProfilePage', params: { newUser: 'true' } }
    } else {
      to.params.newUser = 'true'
    }
  }
})

export default router
