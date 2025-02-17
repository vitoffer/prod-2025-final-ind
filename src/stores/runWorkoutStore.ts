import type { Workout } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRunWorkoutStore = defineStore('runWorkout', () => {
  const selectedRunWorkout = ref<Workout | null>(null)

  function changeRunWorkout(workout: Workout) {
    selectedRunWorkout.value = workout
  }

  return { selectedRunWorkout, changeRunWorkout }
})
