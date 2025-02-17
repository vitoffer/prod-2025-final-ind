import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, FiltersObject } from '@/types'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { computed, ref } from 'vue'
import { useExerciseOptions } from '../exerciseOptions'

export function useFilterExercisesList() {
  const exercisesStore = useExercisesStore()
  const { sportsItemsOptions, tagsOptions } = useExerciseOptions()

  const searchSportsItemsSelectFilter = (event: AutoCompleteCompleteEvent) => {
    sportsItemsSelectFilterSuggestions.value = sportsItemsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)
  }

  const searchTagsSelectFilter = (event: AutoCompleteCompleteEvent) => {
    tagsSelectFilterSuggestions.value = tagsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)
  }

  const filteredExercisesList = computed<Exercise[]>(() => {
    return exercisesStore.list.filter((exercise) => {
      const matchesName =
        filtersObj.value.name === '' ||
        exercise.name.toLowerCase().includes(filtersObj.value.name.toLowerCase())
      const matchesDescription =
        filtersObj.value.description === '' ||
        exercise.description?.toLowerCase().includes(filtersObj.value.description.toLowerCase())
      const matchesDifficulty =
        filtersObj.value.difficulty === null || exercise.difficulty === filtersObj.value.difficulty
      const matchesSportsItems =
        filtersObj.value.sportsItems.length === 0 ||
        filtersObj.value.sportsItems.some((item) => exercise.sportsItems.includes(item))
      const matchesTags =
        filtersObj.value.tags.length === 0 ||
        filtersObj.value.tags.some((tag) => exercise.tags.includes(tag))

      return (
        matchesName && matchesDescription && matchesDifficulty && matchesSportsItems && matchesTags
      )
    })
  })

  const sportsItemsSelectFilterSuggestions = ref<string[]>([])
  const tagsSelectFilterSuggestions = ref<string[]>([])

  const filtersObj = ref<FiltersObject>({
    name: '',
    description: '',
    difficulty: null,
    sportsItems: [],
    tags: [],
  })

  return {
    searchSportsItemsSelectFilter,
    searchTagsSelectFilter,
    filteredExercisesList,
    sportsItemsSelectFilterSuggestions,
    tagsSelectFilterSuggestions,
    filtersObj,
  }
}
