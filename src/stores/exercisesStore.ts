import { ref } from 'vue'
import { defineStore } from 'pinia'
import baseExercisesList from '@/base-data/exercises'
import type { Exercise } from '@/types'

export const useExercisesStore = defineStore('exercises', () => {
  const list = ref<Exercise[]>([])
  if (localStorage.getItem('exercisesList') === null) {
    list.value = baseExercisesList
    localStorage.setItem('exercisesList', JSON.stringify(list.value))
  } else {
    list.value = JSON.parse(localStorage.getItem('exercisesList')!)
  }

  function removeExercise(id: number) {
    list.value = list.value.filter((exercise) => exercise.id !== id)

    localStorage.setItem('exercisesList', JSON.stringify(list.value))
  }

  function updateExercise(id: number, updatedExercise: Exercise) {
    const index = list.value.findIndex((exercise) => exercise.id === id)
    if (index !== -1) {
      list.value[index] = { ...list.value[index], ...updatedExercise }
    }

    localStorage.setItem('exercisesList', JSON.stringify(list.value))
  }

  function createExercise(newExercise: Exercise) {
    list.value.push(newExercise)

    localStorage.setItem('exercisesList', JSON.stringify(list.value))
  }

  return { list, removeExercise, updateExercise, createExercise }
})
