<script setup lang="ts">
import { difficultyOptions } from '@/constants'
import type { AutoCompleteCompleteEvent } from 'primevue'

defineProps<{ sportsItemsSelectSuggestions: string[]; tagsSelectSuggestions: string[] }>()
defineEmits<{
  searchSportsItemsSelect: [event: AutoCompleteCompleteEvent]
  searchTagsSelect: [event: AutoCompleteCompleteEvent]
}>()
defineModel('filtersObject')
</script>

<template>
  <p class="text-center">Фильтры</p>
  <ul class="filters flex flex-col lg:flex-row">
    <li>
      <FloatLabel variant="in" class="mb-2">
        <InputText id="filterName" v-model="filtersObject.name" />
        <label for="filterName">Название</label>
      </FloatLabel>
    </li>
    <li>
      <FloatLabel variant="in" class="mb-2">
        <InputText id="filterDesc" v-model="filtersObject.description" />
        <label for="filterDesc">Описание</label>
      </FloatLabel>
    </li>
    <li>
      <p>Сложность</p>
      <SelectButton v-model="filtersObject.difficulty" :options="difficultyOptions"></SelectButton>
    </li>
    <li>
      <FloatLabel variant="in" class="mb-2">
        <AutoComplete
          v-model="filtersObject.sportsItems"
          multiple
          :suggestions="sportsItemsSelectSuggestions"
          @complete="$emit('searchSportsItemsSelect', $event)"
          id="filterSportsItems"
        />
        <label for="filterSportsItems">Инвентарь</label>
      </FloatLabel>
    </li>
    <li>
      <FloatLabel variant="in" class="mb-2">
        <AutoComplete
          v-model="filtersObject.tags"
          multiple
          :suggestions="tagsSelectSuggestions"
          @complete="$emit('searchTagsSelect', $event)"
          id="filterTags"
        />
        <label for="filterTags">Теги</label>
      </FloatLabel>
    </li>
  </ul>
</template>

<style scoped></style>
