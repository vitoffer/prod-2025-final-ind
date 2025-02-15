import { ref } from 'vue'
import { defineStore } from 'pinia'
import baseExercisesList from '@/base-data/exercises'
import type { Exercise } from '@/types'

export const useExercisesStore = defineStore('exercises', () => {
  const list = ref(baseExercisesList)

  function removeExercise(id: number) {
    list.value = list.value.filter((exercise) => exercise.id !== id)
  }

  function updateExercise(id: number, updatedExercise: Exercise) {
    const index = list.value.findIndex((exercise) => exercise.id === id)
    if (index !== -1) {
      list.value[index] = { ...list.value[index], ...updatedExercise }
    }
  }

  function createExercise(newExercise: Exercise) {
    list.value.push(newExercise)
  }

  return { list, removeExercise, updateExercise, createExercise }
})
