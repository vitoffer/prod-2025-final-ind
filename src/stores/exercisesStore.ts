import { ref } from 'vue'
import { defineStore } from 'pinia'
import baseExercisesList from '@/base-data/exercises'

export const useExercisesStore = defineStore('exercises', () => {
  const list = ref(baseExercisesList)

  return { list }
})
