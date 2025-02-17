import type { AutoCompleteCompleteEvent } from 'primevue'
import { ref } from 'vue'
import { useExerciseOptions } from './exerciseOptions'

export function useEditingExerciseOptions() {
  const { sportsItemsOptions, tagsOptions } = useExerciseOptions()

  const searchSportsItemsSelectEditing = (event: AutoCompleteCompleteEvent) => {
    sportsItemsSelectEditingSuggestions.value = sportsItemsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)
  }

  const searchTagsSelectEditing = (event: AutoCompleteCompleteEvent) => {
    tagsSelectEditingSuggestions.value = tagsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)
  }

  const sportsItemsSelectEditingSuggestions = ref<string[]>([])
  const tagsSelectEditingSuggestions = ref<string[]>([])

  return {
    searchSportsItemsSelectEditing,
    searchTagsSelectEditing,
    sportsItemsSelectEditingSuggestions,
    tagsSelectEditingSuggestions,
  }
}
