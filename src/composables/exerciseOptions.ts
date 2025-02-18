import { useExercisesStore } from '@/stores/exercisesStore'
import { computed } from 'vue'

export function useExerciseOptions() {
  const exercisesStore = useExercisesStore()

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
    sportsItemsOptions,
    tagsOptions,
  }
}
