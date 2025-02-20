import type { Workout } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRunWorkoutStore = defineStore('runWorkout', () => {
  const selectedRunWorkout = ref<Workout | null>(null)
  // const selectedRunWorkout = ref<Workout | null>(workoutsStore.list[1])

  function updateWorkout(workout: Workout) {
    selectedRunWorkout.value = workout
  }

  return { selectedRunWorkout, updateWorkout }
})
