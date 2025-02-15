import { ref } from 'vue'
import { defineStore } from 'pinia'
import baseExercisesList from '@/base-data/exercises'

export const useExercisesStore = defineStore('exercises', () => {
  const list = ref(baseExercisesList)

  function remove(id: number) {
    list.value = list.value.filter((exercise) => exercise.id !== id)
  }

  return { list, remove }
})
