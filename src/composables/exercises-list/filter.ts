import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, FiltersObject } from '@/types'
import { computed, ref } from 'vue'

export function useExercisesListFilter() {
  const exercisesStore = useExercisesStore()

  const filtersObject = ref<FiltersObject>({
    name: '',
    description: '',
    difficulty: null,
    sportsItems: [],
    tags: [],
  })

  const filteredExercisesList = computed<Exercise[]>(() => {
    return exercisesStore.list.filter((exercise) => {
      const matchesName =
        filtersObject.value.name === '' ||
        exercise.name.toLowerCase().includes(filtersObject.value.name.toLowerCase())
      const matchesDescription =
        filtersObject.value.description === '' ||
        exercise.description?.toLowerCase().includes(filtersObject.value.description.toLowerCase())
      const matchesDifficulty =
        filtersObject.value.difficulty === null ||
        exercise.difficulty === filtersObject.value.difficulty
      const matchesSportsItems =
        filtersObject.value.sportsItems.length === 0 ||
        filtersObject.value.sportsItems.some((item) => exercise.sportsItems.includes(item))
      const matchesTags =
        filtersObject.value.tags.length === 0 ||
        filtersObject.value.tags.some((tag) => exercise.tags.includes(tag))

      return (
        matchesName && matchesDescription && matchesDifficulty && matchesSportsItems && matchesTags
      )
    })
  })

  return {
    filtersObject,
    filteredExercisesList,
  }
}
