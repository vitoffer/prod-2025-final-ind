import type { Workout } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWorkoutsStore } from './workoutsStore'

export const useRunWorkoutStore = defineStore('runWorkout', () => {
  // const selectedRunWorkout = ref<Workout | null>(null)
  const workoutsStore = useWorkoutsStore()
  const selectedRunWorkout = ref<Workout | null>(workoutsStore.list[1])

  function changeRunWorkout(workout: Workout) {
    selectedRunWorkout.value = workout
  }

  return { selectedRunWorkout, changeRunWorkout }
})
