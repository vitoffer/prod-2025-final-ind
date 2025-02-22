import type { FilledExercisesWorkout } from '@/types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useRunWorkoutStore = defineStore('runWorkout', () => {
  const selectedRunWorkout = ref<FilledExercisesWorkout | null>(null)

  const runWorkoutInLS = localStorage.getItem('runWorkout')

  if (runWorkoutInLS) {
    selectedRunWorkout.value = JSON.parse(runWorkoutInLS)
  }

  function updateWorkout(workout: FilledExercisesWorkout) {
    selectedRunWorkout.value = workout
  }

  function removeRunWorkoutFromLS() {
    localStorage.removeItem('runWorkout')
  }

  watch(
    selectedRunWorkout,
    (newSelectedRunWorkout: FilledExercisesWorkout | null) => {
      localStorage.setItem('runWorkout', JSON.stringify(newSelectedRunWorkout))
    },
    { deep: true },
  )

  return { selectedRunWorkout, updateWorkout, removeRunWorkoutFromLS }
})
