import {
  baseBody,
  baseLevel,
  basePoints,
  baseXP,
  requiredLevelToFitBody,
  requiredLevelToNormalBody,
} from '@/constants'
import type { User, Workout } from '@/types'
import { XPForLevel } from '@/utils/gamification'
import { defineStore } from 'pinia'
import { type ToastMessageOptions } from 'primevue'
import { ref, toValue } from 'vue'

export const useUserStore = defineStore('user', () => {
  // const isNewUser = ref<boolean>(localStorage.getItem('user') === null)
  const isNewUser = ref<boolean>(false)

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
    history: {
      lastCompletedWorkouts: [],
    },
  }

  const user = ref<User>(baseUser)
  // const user = ref<User>({
  //   age: 20,
  //   heightCm: 180,
  //   weightKg: 75,
  //   level: baseLevel,
  //   xp: baseXP,
  //   points: basePoints,
  //   character: {
  //     hat: '1',
  //     body: baseBody,
  //     necklace: '1',
  //     bracelet: '1',
  //     pants: '3',
  //     boots: '1',
  //   },
  //   customizationItems: [],
  //   achievements: [],
  //   history: {
  //     lastCompletedWorkouts: [],
  //   },
  // })

  // if (localStorage.getItem('user')) {
  //   user.value = JSON.parse(localStorage.getItem('user')!)
  // }

  function updateUser(params: Partial<User>) {
    user.value = {
      ...user.value,
      ...params,
    }

    // updateUserInLS()
  }

  function updateUserInLS() {
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function pushWorkoutToHistory(workout: Workout) {
    if (user.value.history.lastCompletedWorkouts.length === 5) {
      user.value.history.lastCompletedWorkouts.shift()
    }

    user.value.history.lastCompletedWorkouts.push(workout)

    // updateUserInLS()
  }

  function checkLevelUp(showToast: (options: ToastMessageOptions) => void) {
    let newLevel = user.value.level
    let remainingXP = user.value.xp

    while (remainingXP >= XPForLevel(newLevel + 1)) {
      remainingXP -= XPForLevel(newLevel + 1)
      newLevel++
    }

    if (newLevel > user.value.level) {
      levelUp(newLevel, remainingXP, showToast)
    }
  }

  function levelUp(
    newLevel: number,
    remainingXP: number,
    showToast: (options: ToastMessageOptions) => void,
  ) {
    const startLevel = toValue(user.value.level)
    user.value.level = newLevel
    user.value.xp = remainingXP

    showToast({ summary: 'Уровень повысился', life: 3000, severity: 'success' })

    if (startLevel < requiredLevelToFitBody && user.value.level >= requiredLevelToFitBody) {
      user.value.character.body = 'fit'
    } else if (
      startLevel < requiredLevelToNormalBody &&
      user.value.level >= requiredLevelToNormalBody
    ) {
      user.value.character.body = 'normal'
    }
  }

  function addXP(xpGained: number, showToast: (options: ToastMessageOptions) => void) {
    user.value.xp += xpGained

    checkLevelUp(showToast)

    // updateUserInLS()
  }

  function addPoints(pointsCount: number) {
    user.value.points += pointsCount

    // updateUserInLS()
  }

  return {
    isNewUser,
    toggleIsNewUser,
    user,
    updateUser,
    pushWorkoutToHistory,
    checkLevelUp,
    addXP,
    addPoints,
  }
})
