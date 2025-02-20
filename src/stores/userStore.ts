import type { User, Workout } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isNewUser = ref<boolean>(localStorage.getItem('user') === null)
  // const isNewUser = ref<boolean>(false)

  function toggleIsNewUser() {
    isNewUser.value = !isNewUser.value
  }

  const baseUser: User = {
    age: 20,
    heightCm: 180,
    weightKg: 75,
    level: 1,
    xp: 0,
    points: 10,
    character: {
      hat: null,
      body: 'normal',
      necklace: null,
      bracelet: null,
      pants: null,
      boots: null,
    },
    customizationItems: [],
    achievements: [],
  }

  // const user = ref<User>(baseUser)
  const user = ref<User>({
    age: 20,
    heightCm: 180,
    weightKg: 75,
    level: 1,
    xp: 0,
    points: 10,
    character: {
      hat: '1',
      body: 'fit',
      necklace: '1',
      bracelet: '1',
      pants: '3',
      boots: '1',
    },
    customizationItems: [],
    achievements: [],
    history: {
      lastCompletedWorkouts: [],
    },
  })

  // if (localStorage.getItem('user')) {
  //   user.value = JSON.parse(localStorage.getItem('user')!)
  // }

  function updateUser(params: Partial<User>) {
    user.value = {
      ...user.value,
      ...params,
    }

    updateUserInLS()
  }

  function updateUserInLS() {
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function pushWorkoutToHistory(workout: Workout) {
    if (user.value.history.lastCompletedWorkouts.length === 5) {
      user.value.history.lastCompletedWorkouts.shift()
    }

    user.value.history.lastCompletedWorkouts.push(workout)

    console.log(user.value.history)

    // updateUserInLS()
  }

  return { isNewUser, toggleIsNewUser, user, updateUser, pushWorkoutToHistory }
})
