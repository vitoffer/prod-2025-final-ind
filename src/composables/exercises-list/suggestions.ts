import { ref } from 'vue'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { useExerciseOptions } from '../exerciseOptions'
import { getFilteredSelectSuggestions, type Option } from '@/utils/exercisesList'

export function useExercisesListSuggestions(type: 'filter' | 'editing') {
  const { sportsItemsOptions, tagsOptions } = useExerciseOptions()

  const sportsItemsSuggestions = ref<string[]>([])
  const tagsSuggestions = ref<string[]>([])

  function getSuggestions<T extends object, K extends keyof T>(
    options: Option<T, K>[],
    field: K,
    query: string,
  ) {
    const suggestions = getFilteredSelectSuggestions(options, field, query)
    if (type === 'editing' && suggestions.length === 0) {
      suggestions.push(query)
    }
    return suggestions
  }

  function showSportsItemsSuggestions(event: AutoCompleteCompleteEvent) {
    sportsItemsSuggestions.value = getSuggestions(sportsItemsOptions.value, 'name', event.query)
  }

  function showTagsSuggestions(event: AutoCompleteCompleteEvent) {
    tagsSuggestions.value = getSuggestions(tagsOptions.value, 'name', event.query)
  }

  return {
    sportsItemsSuggestions,
    tagsSuggestions,
    showSportsItemsSuggestions,
    showTagsSuggestions,
  }
}
