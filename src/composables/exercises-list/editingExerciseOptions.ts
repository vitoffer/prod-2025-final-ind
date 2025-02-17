import type { AutoCompleteCompleteEvent } from 'primevue'
import { ref } from 'vue'
import { useExerciseOptions } from '../exerciseOptions'

export function useEditingExerciseOptions() {
  const { sportsItemsOptions, tagsOptions } = useExerciseOptions()

  const searchSportsItemsSelectEditing = (event: AutoCompleteCompleteEvent) => {
    sportsItemsSelectEditingSuggestions.value = sportsItemsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)
    if (sportsItemsSelectEditingSuggestions.value.length === 0) {
      sportsItemsSelectEditingSuggestions.value.push(event.query.toLowerCase())
    }
  }

  const searchTagsSelectEditing = (event: AutoCompleteCompleteEvent) => {
    tagsSelectEditingSuggestions.value = tagsOptions.value
      .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
      .map((option) => option.name)

    if (tagsSelectEditingSuggestions.value.length === 0) {
      tagsSelectEditingSuggestions.value.push(event.query.toLowerCase())
    }
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
