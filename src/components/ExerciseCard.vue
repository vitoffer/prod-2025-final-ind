<script setup lang="ts">
import type { Exercise } from '@/types'
import { ref } from 'vue'

interface MediaObj {
  type: 'video' | 'photo'
  src: string
}

const props = defineProps<{ exercise: Exercise }>()

const mediasList = ref<MediaObj[]>([])

if (props.exercise.videoUrl !== null) {
  mediasList.value.push({ type: 'video', src: props.exercise.videoUrl })
}
if (props.exercise.photoUrlList.length !== 0) {
  mediasList.value.push(
    ...props.exercise.photoUrlList.map((url: string): MediaObj => {
      return { type: 'photo', src: url }
    }),
  )
}
</script>

<template>
  <div
    class="exercise-card flex w-[450px] flex-col rounded-2xl border-4 border-green-700 pt-3 pr-4 pb-3 pl-4"
  >
    <div class="mb-2 text-center text-2xl font-semibold">{{ exercise.name }}</div>
    <div class="wrapper mb-auto flex h-[250px] w-[100%] items-center justify-stretch">
      <Galleria
        v-if="mediasList.length !== 0"
        :value="mediasList"
        :circular="true"
        :showThumbnails="false"
        :showItemNavigators="true"
        :showItemNavigatorsOnHover="true"
        :showIndicators="true"
        :showIndicatorsOnItem="true"
      >
        <template #item="slotProps">
          <div class="flex h-[250px] w-[100%] items-center">
            <iframe
              v-if="slotProps.item.type === 'video'"
              class="aspect-video w-[100%] rounded-xl"
              :src="slotProps.item.src"
              frameBorder="0"
              allow="clipboard-write; autoplay"
              allowfullscreen
            ></iframe>
            <img
              v-else-if="slotProps.item.type === 'photo'"
              :src="slotProps.item.src"
              alt="Картинка упражнения"
            />
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
        @click="$emit('changeExercise', exercise.id)"
        class="flex aspect-square cursor-pointer items-center justify-center rounded-md border-4 border-amber-400 p-1 leading-none"
      >
        <i class="pi pi-pencil text-amber-400" style="font-size: 1.25rem"></i>
      </button>
      <button
        @click="$emit('removeExercise', exercise.id)"
        class="flex aspect-square cursor-pointer items-center justify-center rounded-md border-4 border-red-400 p-1 leading-none"
      >
        <i class="pi pi-times-circle text-red-400" style="font-size: 1.25rem"></i>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-galleria) {
  width: 100%;
}
</style>
