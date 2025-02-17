import { useExercisesStore } from '@/stores/exercisesStore'
import type { ExerciseDifficulty } from '@/types'
import { computed } from 'vue'

export function useExerciseOptions() {
  const exercisesStore = useExercisesStore()

  const difficultyOptions: ExerciseDifficulty[] = ['простое', 'среднее', 'сложное']
  const sportsItemsOptions = computed<{ name: string }[]>(() => {
    const list: { name: string }[] = []

    for (const exercise of exercisesStore.list) {
      for (const sportsItem of exercise.sportsItems) {
        if (!list.find((elem) => elem.name === sportsItem)) {
          list.push({ name: sportsItem })
        }
      }
    }

    return list
  })
  const tagsOptions = computed<{ name: string }[]>(() => {
    const list: { name: string }[] = []

    for (const exercise of exercisesStore.list) {
      for (const tag of exercise.tags) {
        if (!list.find((elem) => elem.name === tag)) {
          list.push({ name: tag })
        }
      }
    }

    return list
  })

  return {
    difficultyOptions,
    sportsItemsOptions,
    tagsOptions,
  }
}
