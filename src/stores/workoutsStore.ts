import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Workout } from '@/types'
import baseWorkoutsList from '@/base-data/workouts'

export const useWorkoutsStore = defineStore('workouts', () => {
  const list = ref<Workout[]>([])
  if (localStorage.getItem('workoutsList') === null) {
    list.value = baseWorkoutsList
    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  } else {
    list.value = JSON.parse(localStorage.getItem('workoutsList')!)
  }

  function removeWorkout(id: number) {
    list.value = list.value.filter((workout) => workout.id !== id)

    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  }

  function updateWorkout(id: number, updatedWorkout: Workout) {
    const index = list.value.findIndex((workout) => workout.id === id)
    if (index !== -1) {
      list.value[index] = { ...list.value[index], ...updatedWorkout }
    }

    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  }

  function createWorkout(newWorkout: Workout) {
    list.value.push(newWorkout)

    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  }

  return { list, removeWorkout, updateWorkout, createWorkout }
})
