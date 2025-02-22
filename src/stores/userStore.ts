import { checkAchievements } from '@/gamification/achievements'
import { baseBody, baseLevel, basePoints, baseXP } from '@/gamification/constants'
import { addXP, XPForCompletedWorkout } from '@/gamification/xp'
import type { Achievement, BodyType, CustomItem, FilledExercisesWorkout, User } from '@/types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useGlobalStore } from './globalStore'

export const useUserStore = defineStore('user', () => {
  const globalStore = useGlobalStore()
  const isNewUser = ref<boolean>(localStorage.getItem('user') === null)

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
      hat: '/accessories/hat/1.svg',
      body: baseBody,
      necklace: null,
      bracelet: null,
      pants: null,
      boots: null,
    },
    customizationItems: [
      { id: 1, type: 'hat', imageUrl: '/accessories/hat/1.svg', name: 'Синяя шапка', price: 10 },
    ],
    achievements: [],
    stats: {
      totalSeconds: 0,
      totalReps: 0,
      totalWeight: 0,
      totalWorkouts: 0,
      completedExercises: 0,
      skippedExercises: 0,
      lastCompletedWorkouts: [],
    },
  }

  const user = ref<User>(baseUser)

  if (localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user')!)
  }

  watch(
    user,
    (newUser) => {
      localStorage.setItem('user', JSON.stringify(newUser))
    },
    { deep: true }, // Глубокое наблюдение за всеми изменениями в объекте
  )

  function updateUser(params: Partial<User>) {
    user.value = {
      ...user.value,
      ...params,
    }
  }

  function wearItem(item: CustomItem) {
    user.value.character[item.type] = item.imageUrl
  }

  function unWearItem(item: CustomItem) {
    user.value.character[item.type] = null
  }

  function changeBodyType(type: BodyType) {
    user.value.character.body = type
  }

  function buyItem(item: CustomItem) {
    user.value.points -= item.price
    user.value.customizationItems.push(item)
  }

  function pushWorkoutToHistory(workout: FilledExercisesWorkout) {
    // Добавляем статистику пропущенных и выполненных упражнений

    if (user.value.stats.lastCompletedWorkouts.length === 5) {
      user.value.stats.lastCompletedWorkouts.shift()
    }
    user.value.stats.lastCompletedWorkouts.push(workout)

    const newAchievements = checkAchievements(user.value, workout)

    if (newAchievements.length > 0) {
      globalStore.addToast({
        severity: 'success',
        summary: 'Новые достижения!',
        detail: newAchievements.map((a) => a.name).join(', '),
        life: 5000,
      })
    }

    addXP(user.value, XPForCompletedWorkout(workout))
  }

  function addAchievement(achievement: Achievement) {
    user.value.achievements.push(achievement)
  }

  return {
    isNewUser,
    toggleIsNewUser,
    user,
    updateUser,
    pushWorkoutToHistory,
    addXP,
    wearItem,
    unWearItem,
    buyItem,
    addAchievement,
    changeBodyType,
  }
})
