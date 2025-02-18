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

  const sportsItemsSelectFilterSuggestions = ref<string[]>([])
  const tagsSelectFilterSuggestions = ref<string[]>([])

  const filtersObject = ref<FiltersObject>({
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
    filtersObject,
  }
}
