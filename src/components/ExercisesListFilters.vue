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
  <ul
    class="filters flex w-fit flex-col flex-wrap items-center justify-center gap-2 gap-x-8 md:grid md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2 lg:flex-row lg:gap-4"
  >
    <li class="lg:col-span-2 lg:col-start-1 lg:row-span-1 lg:row-start-1">
      <FloatLabel variant="in">
        <InputText id="filterName" v-model="filtersObject.name" class="w-[250px]" />
        <label for="filterName">Название</label>
      </FloatLabel>
    </li>
    <li class="lg:col-span-2 lg:col-start-3 lg:row-span-1 lg:row-start-1">
      <FloatLabel variant="in">
        <InputText id="filterDesc" v-model="filtersObject.description" class="w-[250px]" />
        <label for="filterDesc">Описание</label>
      </FloatLabel>
    </li>
    <li
      class="flex flex-col items-center justify-center gap-1 md:col-span-2 lg:col-span-2 lg:col-start-5 lg:row-span-1 lg:row-start-1"
    >
      <p>Сложность</p>
      <SelectButton v-model="filtersObject.difficulty" :options="difficultyOptions" />
    </li>
    <li class="lg:col-span-2 lg:col-start-2 lg:row-span-1 lg:row-start-2">
      <FloatLabel variant="in">
        <AutoComplete
          v-model="filtersObject.sportsItems"
          multiple
          :suggestions="sportsItemsSelectSuggestions"
          @complete="$emit('searchSportsItemsSelect', $event)"
          id="filterSportsItems"
          class="w-[250px]"
        />
        <label for="filterSportsItems">Инвентарь</label>
      </FloatLabel>
    </li>
    <li class="lg:col-span-2 lg:col-start-4 lg:row-span-1 lg:row-start-2">
      <FloatLabel variant="in">
        <AutoComplete
          v-model="filtersObject.tags"
          multiple
          :suggestions="tagsSelectSuggestions"
          @complete="$emit('searchTagsSelect', $event)"
          id="filterTags"
          class="w-[250px]"
        />
        <label for="filterTags">Теги</label>
      </FloatLabel>
    </li>
  </ul>
</template>

<style scoped></style>
