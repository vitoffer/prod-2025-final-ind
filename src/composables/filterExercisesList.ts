import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseDifficulty, FiltersObject } from '@/types'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { computed, ref } from 'vue'

export function useFilterExercisesList() {
  const exercisesStore = useExercisesStore()

  const searchSportsItemsSelect = (event: AutoCompleteCompleteEvent) => {
    sportsItemsSelectSuggestions.value = sportsItemsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)
  }

  const searchTagsSelect = (event: AutoCompleteCompleteEvent) => {
    tagsSelectSuggestions.value = tagsOptions.value
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
  const sportsItemsSelectSuggestions = ref<string[]>([])
  const tagsSelectSuggestions = ref<string[]>([])

  const filtersObj = ref<FiltersObject>({
    name: '',
    description: '',
    difficulty: null,
    sportsItems: [],
    tags: [],
  })

  return {
    searchSportsItemsSelect,
    searchTagsSelect,
    filteredExercisesList,
    difficultyOptions,
    sportsItemsOptions,
    tagsOptions,
    sportsItemsSelectSuggestions,
    tagsSelectSuggestions,
    filtersObj,
  }
}
