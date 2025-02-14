<script setup lang="ts">
import type { Exercise } from '@/types'

const props = defineProps<{ exercise: Exercise }>()
</script>

<template>
  <div
    class="exercise-card flex w-[450px] flex-col rounded-2xl border-4 border-green-700 pt-3 pr-4 pb-3 pl-4"
  >
    <div class="mb-2 text-center text-2xl font-semibold">{{ exercise.name }}</div>
    <div class="wrapper mb-auto flex h-[250px] items-center">
      <iframe
        v-if="exercise.videoUrl !== null"
        class="aspect-video w-[100%] rounded-xl"
        :src="exercise.videoUrl"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        allowfullscreen
      ></iframe>
      <Galleria
        v-else-if="exercise.photoUrlList.length !== 0"
        :value="exercise.photoUrlList"
        :circular="true"
        :showThumbnails="false"
        :showItemNavigators="true"
        :showItemNavigatorsOnHover="true"
        :showIndicators="true"
        :showIndicatorsOnItem="true"
      >
        <template #item="slotProps">
          <div class="flex h-[250px] items-center">
            <img :src="slotProps.item" alt="Картинка упражнения" />
          </div>
        </template>
      </Galleria>
      <p v-else-if="exercise.description !== null" class="self-start text-lg">
        {{ exercise.description }}
      </p>
    </div>
    <div class="mt-3">
      <div class="tags-container max-w-[100%]">
        <ul class="tags-list mb-4 flex flex-nowrap gap-1 overflow-hidden">
          <li
            v-for="tag in exercise.tags.slice(0, 3)"
            :key="tag"
            class="tag max-w-[100%] rounded-md border-2 pr-2 pl-2"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
      <ul class="sports-items-list flex flex-wrap gap-1">
        <li
          v-for="item in exercise.sportsItems.slice(0, 3)"
          :key="item"
          class="sports-item max-w-[100%] rounded-md border-2 pr-2 pl-2"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="buttons mt-4 flex justify-around">
      <button
        @click="$emit('editExercise', exercise.id)"
        class="flex aspect-square items-center justify-center rounded-md border-4 border-amber-500 p-1 leading-none"
      >
        <i class="pi pi-pencil text-amber-500" style="font-size: 1.25rem"></i>
      </button>
      <button
        class="flex aspect-square items-center justify-center rounded-md border-4 border-red-600 p-1 leading-none"
      >
        <i class="pi pi-times-circle text-red-600" style="font-size: 1.25rem"></i>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
