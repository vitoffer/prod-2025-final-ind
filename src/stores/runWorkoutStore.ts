import type { FilledExercisesWorkout } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRunWorkoutStore = defineStore('runWorkout', () => {
  const selectedRunWorkout = ref<FilledExercisesWorkout | null>(null)
  // const selectedRunWorkout = ref<Workout | null>(workoutsStore.list[1])

  function updateWorkout(workout: FilledExercisesWorkout) {
    selectedRunWorkout.value = workout
  }

  return { selectedRunWorkout, updateWorkout }
})
