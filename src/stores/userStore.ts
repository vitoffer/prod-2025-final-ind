import { baseBody, baseLevel, basePoints, baseXP } from '@/constants'
import type { User, Workout } from '@/types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

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
    level: baseLevel,
    xp: baseXP,
    points: basePoints,
    character: {
      hat: null,
      body: baseBody,
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
    level: baseLevel,
    xp: baseXP,
    points: basePoints,
    character: {
      hat: '1',
      body: baseBody,
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

  watch(
    () => user.value.xp,
    () => {
      setLevel()
    },
  )

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

  function addXP(count) {
    user.value.xp += count
  }

  function setLevel() {
    const XPForCurrentLevel = getXPForLevel(user.value.level)
  }

  function getXPForLevel(level: number) {
    return 1.01 ** level * 100
  }

  return { isNewUser, toggleIsNewUser, user, updateUser, pushWorkoutToHistory, addXP }
})
